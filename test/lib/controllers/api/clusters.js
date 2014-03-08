'use strict';

describe('clusters controller', function() {
  var prequire = require('proxyquire').noCallThru();
  var sinon = require('sinon');
  var args;
  var crud = sinon.stub();
  var app = {crud:crud};
  var Cluster = {};
  var module = prequire('../../../../lib/controllers/api/clusters', {
    '../../services/Cluster': Cluster,
    'express-crud':crud
  });

  beforeEach(function() {
    args = {};
    crud.reset();
  });

  it('accepts an app and args', function() {
    module(app, args);
  });

  it('passes Cluster to crud', function() {
    module(app, args);
    sinon.assert.calledWith(crud, 'clusters', Cluster);
  });
});