'use strict';

var cluster = require('cluster');
var ProcessManager;
var startupTime = 2000;//MAKE CONFIGURABLE
var workerCount = 2;//MAKE CONFIGURABLE
var startupThresholdForWorkersDied = 2;//MAKE CONFIGURABLE


var workersDied = 0;
var inStartupPhase = true;
var recycleWorkers;
var pm;
var args;
var i;
var MAX_WORKER_DEATHS_IN_STARTUP_PHASE_REACHED = 42;

/* istanbul ignore else */
if(cluster.isMaster){
  ProcessManager = require('process-messenger');
  recycleWorkers = require('../utils/recycleWorkers.js');
  pm = new ProcessManager();
  args = require('minimist')(process.argv.slice(2));

  for(i=0;i < workerCount;i++){
    cluster.fork({
      workerPath: args.workerPath
    });
  }

  cluster.on('exit', function(){
    workersDied += 1;

    if(workersDied >= startupThresholdForWorkersDied){
      return process.exit(MAX_WORKER_DEATHS_IN_STARTUP_PHASE_REACHED);
    }
    cluster.fork({
      workerPath: args.workerPath
    });
  });

  setTimeout(function(){
    inStartupPhase = false;
    pm.on('update', function(model, done){
      if(model.workerPath)args.workerPath = model.workerPath;
      recycleWorkers(cluster, done);
    });
    process.send({});
  }, startupTime);
} else {
  require(process.env.workerPath);
}
