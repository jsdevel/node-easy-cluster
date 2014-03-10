'use strict';

describe('MasterProcess', function() {
  var assert = require('assert');
  var prequire = require('proxyquire').noCallThru();
  var path = require('path');
  var sinon = require('sinon');
  var on = sinon.stub();
  var returnedChildProcess = {
    pid:6,
    on:on
  };
  var spawn = sinon.stub().returns(returnedChildProcess);
  var childProcess = {
    spawn:spawn
  };
  var fsHelpers = {
    fileExists: sinon.stub()
  };
  var MasterProcess = prequire('../../../../lib/services/MasterProcess', {
    'child_process':childProcess,
    '../../util/fsHelpers': fsHelpers
  });
  var workerPath = 'workerPath';

  beforeEach(function() {
    returnedChildProcess.on.reset();
    childProcess.spawn.reset();
    fsHelpers.fileExists.reset();
    fsHelpers.fileExists.returns(true);
  });

  it('starts the workerPath with a default strategy', function() {
    var master = new MasterProcess({
      workerPath: workerPath
    });
    sinon.assert.calledWith(
      spawn,
      'node',
      sinon.match([
        getPathOf('simple'),
        '--workerPath',
        workerPath
      ]),
      sinon.match({
        detached:true,
        stdio:'ignore'
      })
    );
    sinon.assert.calledWith(on, 'close', sinon.match.func);
    master.workerPath.should.equal(workerPath);
    master.process.should.equal(returnedChildProcess);
  });

  it('sets pid', function() {
    var process = new MasterProcess({
      workerPath: workerPath
    });
    process.pid.should.equal(6);
  });

  it('allows the strategy to be configurable', function() {
    var process = new MasterProcess({
      workerPath: workerPath,
      strategy: 'graceful'
    });
    sinon.assert.calledWith(
      spawn,
      'node',
      [
        getPathOf('graceful'),
        '--workerPath',
        workerPath
      ],
      sinon.match.object
    );
  });

  it('throws an error if the strategy does not exist', function() {
    fsHelpers.fileExists.returns(false);
    assert.throws(function(){
      new MasterProcess({
        workerPath: workerPath,
        strategy: 'asdfasdf'
      });
    });
    sinon.assert.calledWith(fsHelpers.fileExists, getPathOf('asdfasdf'));
  });

  describe('on closing', function() {
    it('sets no startupError if code is falsey', function(){
      var master = new MasterProcess({workerPath:workerPath});
      master.process.on.args[0][1](0);
      assert.equal(master.startupError, null);
    });

    it('sets startupError if code is truthy', function() {
      var master = new MasterProcess({workerPath:workerPath});
      master.process.on.args[0][1](1);
      master.startupError.should.be.an.instanceOf(Error);
    });
  });

  function getPathOf(strategy){
    return path.resolve(
      __dirname,
      '../../../../lib/services/MasterProcess/strategies/'+strategy+'.js'
    );
  }
});