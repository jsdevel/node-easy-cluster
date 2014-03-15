'use strict';

describe('index controller', function(){
  var assert = require('assert');
  var prequire = require('proxyquire');
  var sinon = require('sinon');
  var Cluster = {
    read: sinon.stub()
  };
  var app = {
    get: sinon.stub()
  };
  var getRoute = require('../../../test-helpers').getRoute;
  var req = {
    body:{},
    query:{}
  };
  var res = {
    json: sinon.stub()
  };
  var next = sinon.stub();
  var module = prequire('../../../../lib/controllers/app', {
    '../../services/Cluster': Cluster
  });

  beforeEach(function() {
    req.body = {};
    req.query = {};
    res.json.reset();
    app.get.reset();
    Cluster.read.reset();
  });

  it('is a function', function() {
    module.should.be.type('function');
  });

  it('sets routes on the app', function() {
    module(app);
    sinon.assert.calledWith(app.get, '/', sinon.match.func);
  });

  describe('GET /', function() {
    beforeEach(function() {
      module(app);
    });

    it('returns no clusters when no cluster is loaded', function(done) {
      Cluster.read.callsArgWith(0, null, []);
      getRoute('/', app.get.args)(req, res);
      setTimeout(function(){
        assert.deepEqual(res.json.args[0][0], {
          clusters: []
        });
        done();
      }, 1);
    });

    it('returns clusters when a cluster is loaded', function(done) {
      Cluster.read.callsArgWith(0, null, [{}]);
      getRoute('/', app.get.args)(req,res,next);
      setTimeout(function(){
        assert.deepEqual(res.json.args[0][0], {
          clusters: [{}]
        });
        done();
      }, 10);
    });
  });
});