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
  var MasterProcess = prequire('../../../../lib/services/MasterProcess', {
    'child_process':childProcess
  });
  var workerPath = 'workerPath';
  var clusterStrategy = 'simple';

  beforeEach(function() {
    master.on.reset();
    childProcess.spawn.reset();
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