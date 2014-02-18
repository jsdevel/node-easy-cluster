'use strict';

describe('Cluster', function() {
  var assert = require('assert');
  var sinon = require('sinon');
  var prequire = require('proxyquire');
  var fsHelpers = {
    fileExists:null
  };
  var modulePath = '../../../lib/services/Cluster';
  var Cluster;

  beforeEach(function() {
    delete require.cache[modulePath];
    Cluster = prequire(modulePath, {
      '../util/fsHelpers':fsHelpers
    });
    fsHelpers.fileExists = sinon.stub().returns(true);
    fsHelpers.fileExists.reset();
  });

  describe('#create', function() {
    it('creates new Clusters', function(done) {
      Cluster.create({workerPath:'asdfasdf'}, function(err, id){
        assert(!err);
        id.should.equal(0);
        sinon.assert.calledWith(fsHelpers.fileExists, 'asdfasdf');
        done();
      });
    });

    it('expects an object', function(done){
      Cluster.create(null, function(err, id){
        err.should.be.an.instanceOf(Error);
        err.message.should.equal('Cannot read property \'workerPath\' of null');
        done();
      });
    });

    it('expects a workerPath argument', function(done) {
      Cluster.create({}, function(err, id){
        err.should.be.an.instanceOf(Error);
        err.message.should.equal('no workerPath given');
        done();
      });
    });

    it('expects a workerPath that exists', function(done) {
      fsHelpers.fileExists.returns(false);
      Cluster.create({workerPath:'asdf'}, function(err, id){
        err.should.be.an.instanceOf(Error);
        err.message.should.equal('workerPath: asdf is not an existing file.');
        done();
      });
    });

    it('increments the index when called more than once', function(done){
      createClusters(function(){
        Cluster.create({workerPath:'asdf'}, function(err, id){
          id.should.equal(3);
          done();
        });
      });
    });

    it('uses old indexes when clusters are deleted', function(done){
      createClusters(function(){
        Cluster.delete(1, function(err, id){
          Cluster.create({workerPath:'asdf'}, function(err, id){
            id.should.equal(1);
            done();
          });
        });
      });
    });

    it('does not allow multiple clusters to have the same name', function(done) {
      createClusters(function(){
        Cluster.create({name:'foomanchu', workerPath:'/asdf/asdf/doo'}, function(err, index){
          assert(err);
          done();
        });
      });
    });
  });

  describe('#delete', function() {

    beforeEach(function() {
      sinon.stub(Cluster.prototype, 'shutdown');
    });

    afterEach(function() {
      Cluster.prototype.shutdown.restore();
    });

    it('succeeds when the cluster does not exist', function(done) {
      Cluster.delete(1, function(err){
        assert(!err);
        done();
      });
    });
  });

  describe('#read', function() {
    describe('query all', function() {
      it('returns empty array when no cluster exists', function(done) {
        Cluster.read(function(err, results){
          assert(!err);
          results.should.be.an.Array;
          done();
        });
      });

      describe('when clusters exist', function() {
        beforeEach(createClusters);

        it('should return an array of clusters', function(done) {
          Cluster.delete(1, function(){
            Cluster.read(function(err, results){
              assert(!err);
              results.should.be.an.Array;
              results.should.match([
                {id:0, workerPath:'/some/path/0'},
                {id:2, workerPath:'/some/path/2'}
              ]);
              done();
            });
          });
        });
      });
    });

    describe('query byId', function() {
      it('returns null when no cluster exists with the given id', function(done) {
        Cluster.read(1, function(err, results){
          assert(!err);
          assert(results === null);
          done();
        });
      });

      describe('when clusters exist', function() {
        beforeEach(createClusters);

        it('returns the matching cluster', function() {
          Cluster.read(1, function(err, results){
            assert(!err);
            results.should.match({
              id:1,
              workerPath:'/some/path/1'
            });
          });
        });
      });
    });

    describe('query byName', function() {
      it('returns null when no cluster exists with the given name', function(done) {
        Cluster.read('foomanchu', function(err, results){
          assert(!err);
          assert(results === null);
          done();
        });
      });

      describe('when clusters exist', function() {
        beforeEach(createClusters);

        it('returns the matching cluster', function() {
          Cluster.read('foomanchu', function(err, results){
            assert(!err);
            results.should.match({
              id:1,
              name:'foomanchu',
              workerPath:'/some/path/1'
            });
          });
        });
      });
    });

    describe('query by unknown type', function() {
      it('provides an Error to callback', function() {
        Cluster.read(void 0, function(err, results){
          assert(!results);
          err.should.be.an.instanceOf(Error);
        });
      });
    });
  });

  describe('#update', function() {
    it('provides error on unknown query type', function(done){
      Cluster.update([], {}, function(err, results){
        assert(!results);
        err.should.be.an.instanceOf(Error);
        done();
      });
    });

    it('does not allow multiple clusters to have the same name', function(done) {
      createClusters(function(){
        Cluster.update(0, {name:'foomanchu'}, function(err, index){
          assert(err);
          done();
        });
      });
    });

    describe('when no cluster exists', function(){
      it('provides an Error to callback', function(done) {
        Cluster.update(0, {}, function(err, results){
          assert(!results);
          err.should.be.an.instanceOf(Error);
          done();
        });
      });
    });

    describe('when cluster exists', function() {
      beforeEach(createClusters);
      it('returns the results', function() {
        Cluster.update(0, {name:'dog', workerPath:'/some/new/path/0'}, function(err, results){
          assert(!err);
          results.workerPath.should.equal('/some/new/path/0');
          results.name.should.equal('dog');
        });
      });
    });
  });

  describe('Cluster', function() {
    describe('#handleUpdate', function() {
      beforeEach(createClusters);
      it('does not require workerPath if workerPath is already set on the Cluster', function(done) {
        Cluster.read(0, function(err, cluster){
          cluster.handleUpdate({});
          done();
        });
      });
    });
  });

  function createClusters(cb){
    Cluster.create({workerPath:'/some/path/0'}, function(err, id){
      id.should.equal(0);
      Cluster.create({name: 'foomanchu', workerPath:'/some/path/1'}, function(err, id){
        id.should.equal(1);
        Cluster.create({workerPath:'/some/path/2'}, function(err, id){
          id.should.equal(2);
          cb();
        });
      });
    });
  }
});