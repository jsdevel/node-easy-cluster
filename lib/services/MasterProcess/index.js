'use strict';

module.exports = MasterProcess;

var path = require('path');
var spawn = require('child_process').spawn;

function MasterProcess(options){
  this.workerPath = options.workerPath;
  this.master = spawnMaster(this, options.workerPath, options.strategy);
}

function spawnMaster(process, workerPath, strategy){
  var master = spawn(
    path.resolve(__dirname, './strategies/'+(strategy || 'simple')+'.js'),
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