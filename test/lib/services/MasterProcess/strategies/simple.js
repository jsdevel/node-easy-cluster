'use strict';

describe('simple strategy', function() {
  var sinon = require('sinon');
  var prequire = require('proxyquire');
  var path = require('path');
  var strategyPath = path.resolve(
    __dirname,
    '..',
    '..',
    '..',
    '..',
    '..',
    'lib',
    'services',
    'MasterProcess',
    'strategies',
    'simple.js'
  );
  var cluster = {
    fork: sinon.stub(),
    on: sinon.stub(),
    isMaster: true
  };
  var os = {
    cpus: sinon.stub()
  };
  var origArgv = process.argv;
  var Module = require('module');

  beforeEach(function() {
    cluster.fork.reset();
    cluster.on.reset();
    cluster.isMaster = true;
    os.cpus.reset();
    os.cpus.returns([0,0,0,0]);
  });

  after(function() {
    process.argv = origArgv;
    delete Module._cache[strategyPath];
  });

  describe('master process', function() {
    it('initially forks as many workers as there are cpus', function() {
      runStrategy();
      cluster.fork.callCount.should.equal(4);
    });

    it('responds to exit events', function() {
      runStrategy();
      sinon.assert.calledWith(cluster.on, 'exit', sinon.match.func);
    });

    describe('exit handler', function() {
      it('forks a new worker', function() {
        cluster.fork.returns('fork called');
        runStrategy();
        cluster.on.args[0][1]().should.equal('fork called');
      });
    });
  });

  function runStrategy(){
    prequire(strategyPath, {
      'cluster': cluster,
      'os': os,
      '/jomama.js': null
    });
  }
});