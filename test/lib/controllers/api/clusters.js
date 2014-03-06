'use strict';

describe('clusters controller', function() {
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
    body: null,
    params: null,
    query: null
  };
  var res = {
    json: sinon.stub(),
    send: sinon.stub()
  };
  var Cluster = {
    create: sinon.stub(),
    delete: sinon.stub(),
    read: sinon.stub()
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
    req.params = {};
    req.query = {};
    res.json.reset();
    args = {};
    Cluster.create.reset();
    Cluster.read.reset();
  });

  it('accepts an app and args', function() {
    module(app, args);
  });

  describe('/clusters', function() {
    beforeEach(module.bind(null, app, args));

    describe('DELETE', function() {
      it('calls delete on Cluster', function() {
        req.params.id = 8;
        Cluster.delete.callsArgWith(1, null);
        getRoute('/clusters/:id', app.delete.args)(req, res, next);
        sinon.assert.calledWith(
          Cluster.delete,
          8,
          sinon.match.func
        );
        sinon.assert.calledWith(res.send, 204);
      });
    });
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

    describe('GET', function() {
      describe('query by id', function() {
        it('returns 200 when a cluster is found', function() {
          var cluster = {};
          req.params.id = 7;
          Cluster.read.callsArgWith(1, null, cluster);
          getRoute('/clusters/:id', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            7,
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            200,
            cluster
          );
        });

        it('returns 404 when a cluster is not found', function() {
          req.params.id = 7;
          Cluster.read.callsArgWith(1, null, null);
          getRoute('/clusters/:id', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            7,
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            404,
            null
          );
        });
      });

      describe('query by name', function() {
        it('returns 200 when a cluster is found by that name', function() {
          var cluster = {};
          req.query.name = 'foo';
          Cluster.read.callsArgWith(1, null, cluster);
          getRoute('/clusters', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            'foo',
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            200,
            cluster
          );
        });

        it('returns 404 when a cluster is not found', function() {
          req.query.name = 'boo';
          Cluster.read.callsArgWith(1, null, null);
          getRoute('/clusters', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            'boo',
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            404,
            null
          );
        });
      });

      describe('query for all', function() {
        it('returns 200 when clusters are found', function() {
          var clusters = [{}];
          Cluster.read.callsArgWith(0, null, clusters);
          getRoute('/clusters', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            200,
            clusters
          );
        });

        it('returns 404 when no cluster is found', function() {
          var clusters = [];
          Cluster.read.callsArgWith(0, null, clusters);
          getRoute('/clusters', app.get.args)(req, res, next);
          sinon.assert.calledWith(
            Cluster.read,
            sinon.match.func
          );
          sinon.assert.calledWith(
            res.json,
            404,
            clusters
          );
        });
      });
    });
  });
});