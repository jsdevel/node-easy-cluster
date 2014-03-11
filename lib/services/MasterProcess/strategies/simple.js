'use strict';

var cluster = require('cluster');
var args = require('minimist')(process.argv.slice(2));

/* istanbul ignore else */
if(cluster.isMaster){
  require('os').cpus().forEach(cluster.fork.bind(cluster));
  cluster.on('exit', cluster.fork.bind(cluster));
} else {
  require(args.workerPath);
}