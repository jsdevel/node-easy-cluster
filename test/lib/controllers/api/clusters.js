'use strict';

describe('clusters controller', function() {
  var assert = require('assert');
  var getRoute = require('../../../test-helpers').getRoute;
  var prequire = require('proxyquire');
  var sinon = require('sinon');
  var app = {
    delete: sinon.stub(),
    get: sinon.stub(),
    post: sinon.stub(),
    put: sinon.stub()
  };
  var next = sinon.stub();
  var req = {
    body: null
  };
  var res = {
    json: sinon.stub()
  };
  var Cluster = {
    create: sinon.stub()
  };
  var args;
  var module = prequire('../../../../lib/controllers/api/clusters', {
    '../../services/Cluster': Cluster
  });

  beforeEach(function() {
    app.delete.reset();
    app.get.reset();
    app.post.reset();
    app.put.reset();
    next.reset();
    req.body = {};
    res.json.reset();
    args = {};
    Cluster.create.reset();
  });

  it('accepts an app and args', function() {
    module(app, args);
  });

  describe('/clusters', function() {
    beforeEach(module.bind(null, app, args));

    describe('POST', function() {
      it('creates a new cluster', function(done) {
        Cluster.create.callsArgWith(1, null, 5);
        getRoute('/clusters', app.post.args)(req, res, next);
        sinon.assert.calledWith(
          Cluster.create,
          sinon.match.object,
          sinon.match.func
        );
        setTimeout(function(){
          sinon.assert.calledWith(res.json, sinon.match(5));
          sinon.assert.notCalled(next);
          done();
        }, 10);
      });
    });
  });
});