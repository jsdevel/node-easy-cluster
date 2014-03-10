'use strict';


describe('clusters', function() {
  var assert = require('assert');
  var request = require('request');
  var spawn = require('child_process').spawn;
  var path = require('path');
  var easyCluster;
  var clusters = 'http://localhost:18675/api/clusters';
  //process.env.NODE_DEBUG = 'request';

  before(function(done) {
    easyCluster = spawn(
      path.resolve(__dirname, '..', 'bin', 'easy-cluster.js'),
      [],
      {
        stdio:'inherit'
      }
    );
    setTimeout(done, 1000);
  });

  after(function(done) {
    easyCluster.kill();
    setTimeout(done, 1000);
  });

  it('returns null initially', function(done) {
    request(clusters, function(err, res, body){
      res.statusCode.should.equal(404);
      body.should.equal('null');
      done();
    });
  });

  it('can create clusters', function(done) {
    createCluster(function(err, req, body){
      body.should.equal('0');
      done();
    });
  });

  it('can retrieve a cluster by name', function(done) {
    request(clusters, {json:true, qs:{name:'shaman'}}, function(err, res, body){
      body.name.should.equal('shaman');
      body.master.pid.should.be.type('number');
      done();
    });
  });

  function createCluster(cb){
    request.post({
      url:clusters,
      form:{
        name: 'shaman',
        workerPath: path.resolve(__dirname, 'fixtures', 'dud-server.js')
      }
    }, function(err, req, body){
      cb(err, req, body);
    });

  }
});