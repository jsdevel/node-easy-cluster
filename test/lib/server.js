'use strict';

describe('server.js', function() {
  var sinon = require('sinon');
  var prequire = require('proxyquire');
  var express = sinon.stub();
  express.json = sinon.stub();
  express.urlencoded = sinon.stub();
  var app = {
    namespace:sinon.stub().callsArg(1),
    use:sinon.stub()
  };
  var server = {
    address:sinon.stub(),
    listen:sinon.stub()
  };
  var http = {
    createServer : sinon.stub().returns(server)
  };
  var clustersController = sinon.stub();
  var indexController = sinon.stub();
  var enforceKey = sinon.stub();
  var jsonErrors = sinon.stub();
  var serverModule = prequire('../../lib/server.js', {
    'express':express,
    'http':http,
    './controllers/clusters':clustersController,
    './controllers':indexController,
    './middleware/enforceKey':enforceKey,
    './middleware/jsonErrors':jsonErrors
  });
  var address;
  var args;

  beforeEach(function() {
    address = {
      port:776
    };
    args = {
      'port':0
    };
    express.json.reset();
    express.urlencoded.reset();
    express.json.returns('jsonMiddleware');
    express.urlencoded.returns('urlencodedMiddleware');
    app.namespace.reset();
    app.use.reset();
    http.createServer.reset();
    server.listen.reset();
    server.address.reset();
    server.address.returns(address);
    enforceKey.reset();
    enforceKey.returns('enforceKey');
    jsonErrors.returns('jsonErrors');
    express.reset();
    express.returns(app);
    sinon.stub(console, 'log');
  });

  afterEach(function() {
    console.log.restore();
  });

  describe('by default', function(){
    beforeEach(function(){
      serverModule(args);
    });

    it('passes an app and the args to controllers', function() {
      sinon.assert.calledWith(indexController, app, sinon.match(args));
      sinon.assert.calledWith(clustersController, app, sinon.match(args));
    });

    it('adds json middleware to the app', function() {
      sinon.assert.calledWith(app.use, 'jsonMiddleware');
    });

    it('adds urlencoded middleware to the app', function() {
      sinon.assert.calledWith(app.use, 'urlencodedMiddleware');
    });

    it('creates a server with the app', function(){
      sinon.assert.calledWith(http.createServer, app);
    });

    it('listens on the port given in args', function(){
      server.listen.args[0][1]();
      sinon.assert.calledWith(server.listen, 0);
    });

    it('outputs the port listening on when port is 0', function() {
      server.listen.args[0][1]();
      sinon.assert.calledWith(console.log, 'Listening on port 776');
    });
  });

  describe('when --port is > 0 and --silent', function() {
    it('is silent about the port', function() {
      args.port = 5;
      args.silent = true;
      serverModule(args);
      server.listen.args[0][1]();
      sinon.assert.notCalled(console.log);
    });
  });

  describe('when key exists', function() {
    it('adds middleware to app', function() {
      args.key = 'wooot';
      serverModule(args);
      sinon.assert.calledWith(app.use, 'enforceKey');
      sinon.assert.calledWith(enforceKey, 'wooot');
    });
  });
});
