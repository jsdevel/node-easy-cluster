'use strict';

describe('MasterProcess', function() {
  var assert = require('assert');
  var prequire = require('proxyquire');
  var path = require('path');
  var sinon = require('sinon');
  var on = sinon.stub();
  var master = {
    on:on
  };
  var spawn = sinon.stub().returns(master);
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
  var clusterStrategy = 'simple';

  beforeEach(function() {
    master.on.reset();
    childProcess.spawn.reset();
    fsHelpers.fileExists.reset();
    fsHelpers.fileExists.returns(true);
  });

  it('starts the workerPath with a default strategy', function() {
    var process = new MasterProcess({
      workerPath: workerPath
    });
    sinon.assert.calledWith(
      spawn,
      getPathOf('simple'),
      sinon.match([
        '--workerPath',
        workerPath
      ]),
      sinon.match({
        detached:true,
        stdio:'ignore'
      })
    );
    sinon.assert.calledWith(on, 'close', sinon.match.func);
    process.workerPath.should.equal(workerPath);
    process.master.should.equal(master);
  });

  it('allows the strategy to be configurable', function() {
    var process = new MasterProcess({
      workerPath: workerPath,
      strategy: 'graceful'
    });
    sinon.assert.calledWith(
      spawn,
      getPathOf('graceful'),
      sinon.match.array,
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
      var process = new MasterProcess({workerPath:workerPath});
      process.master.on.args[0][1](0);
      assert.equal(process.startupError, null);
    });

    it('sets startupError if code is truthy', function() {
      var process = new MasterProcess({workerPath:workerPath});
      process.master.on.args[0][1](1);
      process.startupError.should.be.an.instanceOf(Error);
    });
  });

  function getPathOf(strategy){
    return path.resolve(
      __dirname,
      '../../../../lib/services/MasterProcess/strategies/'+strategy+'.js'
    );
  }
});