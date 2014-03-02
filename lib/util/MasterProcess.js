'use strict';

module.exports = MasterProcess;

var masterPath = '../';
var path = require('path');
var spawn = require('child_process').spawn;

function MasterProcess(workerPath){
  this.workerPath = workerPath;
  this.master = spawnMaster(this, workerPath);
}

function spawnMaster(process, workerPath){
  var master = spawn(
    path.resolve(__dirname, './scripts/master.js'),
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