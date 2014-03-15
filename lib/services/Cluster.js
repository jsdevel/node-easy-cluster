'use strict';

module.exports = Cluster;

var async = require('async');
var errHandler = require('err-handler');
var fsHelpers = require('../util/fsHelpers');
var MasterProcess = require('./MasterProcess');
var clusters = [];

/**
 * A service that manages Clusters.  You shouldn't invoke this directly.
 * Instead you should use Cluster#create.  You've been warned :\
 *
 * @param {number} id
 * @param {Object} model
 * <pre>
 *  Required properties:
 *  workerPath - absolute path to worker.  Workers are started immediately upon
 *    creating a new cluster.
 *
 *  Optional properties:
 *  verifyNewWorkers - if true, the first worker is tested before updating all
 *    workers.  If the first worker fails to load, the update is aborted.  The
 *    default is false.
 *  verifyTimeout - time in milliseconds to take verifying new workers.  The
 *    default is 2000.
 *  workerLimit - Limits the number of workers.  The default value is set by the
 *    number of cores reported by the os.
 * </pre>
 * @constructor
 */
function Cluster(id, model){
  var masterArgs;
  this.name = null;
  this.id = id;
  this.handleUpdate(model);
  this.startupTime = parseInt(model.startupTime) || 0;
  this.strategy = model.strategy || 'simple';
  masterArgs = {
    workerPath: this.workerPath,
    strategy: this.strategy
  };
  this.master = new MasterProcess(masterArgs);
}

//prototype methods
Cluster.prototype.handleUpdate = function(model){
  if(!this.workerPath || model.workerPath){
    if(!model.workerPath){
      throw new Error('no workerPath given');
    }
    if(!fsHelpers.fileExists(model.workerPath)){
      throw new Error('workerPath: '+model.workerPath + ' is not an existing file.');
    }
    this.workerPath = model.workerPath;
  }

  if('name' in model && this.name !== model.name){
    if(clusters.filter(queryByNameFilter.bind(null, model.name)).length){
      throw new Error('cluster exists with name '+model.name);
    }
    this.name = model.name;
  }
};

Cluster.prototype.shutdown = function(cb){
  process.nextTick(cb.bind(null));
};


//static methods
Cluster.create = function(model, cb){
  var index = getClusterIndex();
  var cluster;
  try {
    cluster = new Cluster(index, model);
    clusters[index] = cluster;
    setTimeout(function(){
      var err = cluster.master.startupError;
      if(err){
        Cluster.delete(index, foo);
        cb(err);
      } else {
        cb(null, index);
      }
    }, cluster.startupTime);
  } catch(e){
    process.nextTick(cb.bind(null, e));
  }
};

Cluster.delete = function(id, cb){
  if(clusters[id]){
    clusters[id].shutdown(cb);
    clusters[id] = null;
  } else {
    process.nextTick(cb);
  }
};

Cluster.read = function(id, query, cb){
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

  results = results.map(toJSONFriendly);

  switch(queryMode){
    case 'byId':
    case 'byName':
      results = results[0] || null;
      break;
  }

  process.nextTick(cb.bind(null, err, results));
};

Cluster.update = function(id, data, cb){
  var proposedCluster = clusters[id];
  var err = null;
  if (proposedCluster) {
    try {
      proposedCluster.handleUpdate(data);
    } catch(e){
      err = e;
    }
  } else {
    err = new Error('cluster '+id+' not found.');
  }
  cb(err, proposedCluster);
};

//HELPER METHODS

function foo(){}

function getClusterIndex(){
  var proposedIndex = clusters.indexOf(null);
  return proposedIndex < 0 ? clusters.length : proposedIndex;
}

function nonNullFilter(cluster){
  return !!cluster;
}

function queryByIdFilter(id, cluster){
  return cluster instanceof Object && cluster.id === id;
}

function queryByNameFilter(name, cluster){
  return cluster instanceof Object && cluster.name === name;
}

function toJSONFriendly(cluster) {
  var jsonCluster = JSON.stringify(cluster, function(key, value){
    if(key === 'master'){
      return {pid:value.pid};
    }
    return value;
  });
  return JSON.parse(jsonCluster);
}