'use strict';

module.exports = MasterProcess;

var path = require('path');
var spawn = require('child_process').spawn;
var fileExists = require('../../util/fsHelpers').fileExists;

function MasterProcess(options){
  this.workerPath = options.workerPath;
  this.process = spawnMaster(this, options.workerPath, options.strategy);
  this.pid = this.process.pid;
}

function spawnMaster(master, workerPath, strategy){
  var proposedStrategyPath = path.resolve(
    __dirname,
    './strategies/'+(strategy || 'simple')+'.js'
  );
  var process;

  if(!fileExists(proposedStrategyPath))throw new Error(
    'strategy '+strategy+' does not exist'
  );

  process = spawn(
    'node',
    [
      proposedStrategyPath,
      '--workerPath',
      workerPath
    ],
    {
      stdio:'ignore',
      detached:true
    }
  );
  process.on('close', handleClose.bind(null, master, workerPath));
  return process;
}

function handleClose(process, path, code){
  if(code){
    process.startupError = new Error(path+' exited with code: '+code);
  }
}
