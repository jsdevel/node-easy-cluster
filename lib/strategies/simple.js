'use strict';

var cluster = require('cluster');
var args = require('minimist')(process.argv.slice(2));
var startupTime = 2000;//MAKE CONFIGURABLE
var workerCount = 2;//MAKE CONFIGURABLE
var startupThresholdForWorkersDied = 2;//MAKE CONFIGURABLE

var workersDied = 0;
var inStartupPhase = true;
var i;

var MAX_WORKER_DEATHS_IN_STARTUP_PHASE_REACHED = 42;

/* istanbul ignore else */
if(cluster.isMaster){
  for(i=0;i < workerCount;i++){
    cluster.fork();
  }

  cluster.on('exit', function(){
    workersDied += 1;

    if(workersDied >= startupThresholdForWorkersDied){
      return process.exit(MAX_WORKER_DEATHS_IN_STARTUP_PHASE_REACHED);
    }
    cluster.fork();
  });

  setTimeout(function(){
    inStartupPhase = false;
    process.send({});
  }, startupTime);
} else {
  require(args.workerPath);
}
