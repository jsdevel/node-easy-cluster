'use strict';

module.exports = recycleWorkers;

function recycleWorkers(cluster, done){
  var workerIds = Object.keys(cluster.workers);
  var workers = [];
  workerIds.forEach(function(id){
    workers.push(cluster.workers[id]);
  });

  killWorkers(workers, done);
}

function killWorkers(workers, done){
  var nextWorker = workers.shift();

  if(nextWorker){
    nextWorker.once('exit', killWorkers.bind(null, workers, done));
    nextWorker.kill();
  } else done();
}
