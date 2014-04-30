'use strict';

module.exports = new ClusterService();

var async = require('async');
var errBack = require('err-back');
var errHandler = require('err-handler');
var clusters = [];
var createClusterProcess = require('./service-utils/createClusterProcess');
var Cluster = require('../models/Cluster.js');
var _ = require('lodash');

function ClusterService(){}

ClusterService.prototype.create = function(model, cb){
  createClusterProcess(model, errHandler(cb, function(process){
    var index = getClusterIndex();
    var cluster;

    model.id = index;

    cluster = new Cluster(model, process);
    clusters[index] = cluster;
    cb(null, cluster);
  }));
};

ClusterService.prototype.delete = function(id, cb){
  if(clusters[id]){
    clusters[id].kill();
    clusters[id] = null;
  }
  process.nextTick(cb);
};

ClusterService.prototype.read = function(id, query, cb){
  var err = null;
  var queryMode = 'all';
  var results = null;

  switch(arguments.length){
  case 1:
    cb = id;
    id = query = null;
    break;
  case 2:
    cb = query;
    query = id;
    id = null;
    break;
  }

  if(id !== null){
    queryMode = 'byId';
    id = parseInt(id);
  } else if(query && query.name){
    queryMode = 'byName';
  }

  switch(queryMode){
    case 'all':
      //make copy of clusters to prevent external modification.
      results = clusters.filter(nonNullFilter);
      break;
    case 'byId':
      results = clusters.filter(queryByIdFilter.bind(null, id));
      break;
    case 'byName':
      results = clusters.filter(queryByNameFilter.bind(null, query.name));
      break;
  }

  switch(queryMode){
    case 'byId':
      results = results[0] || null;
      break;
  }

  process.nextTick(cb.bind(null, err, results));
};

ClusterService.prototype.update = function(id, model, cb){
  var currentCluster = clusters[id];
  var proposedCluster;

  if(!currentCluster)return errBack('cluster '+id+' not found.', cb);

  proposedCluster = _.create(currentCluster, model);

  createClusterProcess(proposedCluster, errHandler(cb, function(process){
    var cluster = new Cluster(proposedCluster, process);
    currentCluster.kill();
    clusters[id] = cluster;
    cb(null, cluster);
  }));
};

//HELPER METHODS
function getClusterIndex(){
  var proposedIndex = clusters.indexOf(null);
  return proposedIndex < 0 ? clusters.length : proposedIndex;
}

function nonNullFilter(cluster){
  return !!cluster;
}

function queryByIdFilter(id, cluster){
  return cluster instanceof Cluster && cluster.id === id;
}

function queryByNameFilter(name, cluster){
  return cluster instanceof Cluster && cluster.name === name;
}

//close clusters on exit
['SIGINT', 'SIGTERM'].forEach(exitOnSignalEvent);

function exitOnSignalEvent(sig){
  process.on(sig, handleExit);
}

function handleExit(){
  clusters.filter(nonNullFilter).forEach(killCluster);
  process.exit();
}

function killCluster(cluster){
  cluster.kill();
}
