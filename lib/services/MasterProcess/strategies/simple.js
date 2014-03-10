'use strict';

var cluster = require('cluster');
var args = require('minimist')(process.argv.slice(2));

console.log(args);

if(cluster.isMaster){
  require('os').cpus().forEach(cluster.fork.bind(cluster));
} else {
  require(args.workerPath);
}
