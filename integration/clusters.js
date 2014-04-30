'use strict';


describe('clusters', function() {
  var assert = require('assert');
  var request = require('request').defaults({json:true});
  var spawn = require('child_process').spawn;
  var path = require('path');
  var easyCluster;
  var clusters = 'http://localhost:18675/clusters';
  //process.env.NODE_DEBUG = 'request';

  before(function(done) {
    easyCluster = spawn(
      path.resolve(__dirname, '..', 'bin', 'easy-cluster.js'),
      []
    );
    easyCluster.stdout.pipe(process.stdout);
    easyCluster.stderr.pipe(process.stderr);
    setTimeout(done, 500);
  });

  after(function(done) {
    easyCluster.kill();
    setTimeout(done, 500);
  });

  it('returns empty array initially', function(done) {
    request(clusters, {json:true}, function(err, res, body){
      res.statusCode.should.equal(404);
      done();
    });
  });

  it('can create clusters', function(done) {
    createCluster(function(err, req, body){
      body.should.have.properties({
        id:0,
        name:'shaman'
      });
      done();
    });
  });

  it('can retrieve a cluster by name', function(done) {
    request(clusters+'?name=shaman', function(err, res, body){
      body[0].should.have.properties(['name', 'id', 'pid']);
      done();
    });
  });

  it('can retrieve a cluster by id', function(done) {
    request(clusters+'/0', function(err, res, body){
      body.should.have.properties(['name', 'id', 'pid']);
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
