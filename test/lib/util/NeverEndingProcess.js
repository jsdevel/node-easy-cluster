'use strict';

describe('NeverEndingProcess', function() {
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
  var Module = prequire('../../../lib/util/NeverEndingProcess', {
    'child_process':childProcess
  });
  var workerPath = 'workerPath';

  beforeEach(function() {
    master.on.reset();
    childProcess.spawn.reset();
  });

  it('starts the workerPath', function() {
    var process = new Module(workerPath);
    sinon.assert.calledWith(
      spawn,
      path.resolve(__dirname, '../../../lib/util/scripts/master.js'),
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

  describe('on bad exit codes', function() {
    it('sets startupError', function() {
      var process = new Module(workerPath);
      process.master.on.args[0][1](1);
      process.startupError.should.be.an.instanceOf(Error);
    });
  });
});