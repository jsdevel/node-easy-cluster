'use strict';

module.exports = MasterProcess;

var path = require('path');
var spawn = require('child_process').spawn;
var fileExists = require('../../util/fsHelpers').fileExists;

function MasterProcess(options){
  this.workerPath = options.workerPath;
  this.master = spawnMaster(this, options.workerPath, options.strategy);
}

function spawnMaster(process, workerPath, strategy){
  var proposedStrategyPath = path.resolve(
    __dirname,
    './strategies/'+(strategy || 'simple')+'.js'
  );
  var master;
    
  if(!fileExists(proposedStrategyPath))throw new Error(
    'strategy '+strategy+' does not exist'
  );

  master = spawn(
    proposedStrategyPath,
    [
      '--workerPath',
      workerPath
    ],
    {
      stdio:'ignore',
      detached:true
    }
  );
  master.on('close', handleClose.bind(null, process, workerPath));
  return master;
}

function handleClose(process, path, code){
  if(code){
    process.startupError = new Error(path+' exited with code: '+code);
  }
}