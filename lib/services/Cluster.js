'use strict';

module.exports = Cluster;

var fsHelpers = require('../util/fsHelpers');
var clusters = [];

/**
 * A Cluster service that manages a cluster.  You shouldn't invoke
 * this directly.  Instead you should use Cluster#create.  You've been warned :\
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
  if(!model.workerPath){
    throw new Error('no workerPath given');
  }
  if(!fsHelpers.fileExists(model.workerPath)){
    throw new Error('workerPath: '+model.workerPath + ' is not an existing file.');
  }

  this.name = model.name || null;
  this.id = id;
  this.workerPath = model.workerPath;
}

//prototype methods
Cluster.prototype.shutdown = function(cb){
  process.nextTick(cb.bind(null));
  clusters[this.id] = null;
};


//static methods
Cluster.create = function(model, cb){
  var err = null;
  var index = getClusterIndex();
  try {
    clusters[index] = new Cluster(index, model);
  } catch(e){
    err = e;
  }
  process.nextTick(cb.bind(null, err, index));
};

Cluster.delete = function(id, cb){
  if(clusters[id]){
    clusters[id].shutdown(cb);
    clusters[id] = null;
  } else {
    process.nextTick(cb);
  }
};

Cluster.read = function(){
  var cb;
  var err = null;
  var query = null;
  var queryMode = null;
  var results = null;

  if(arguments.length === 1){
    cb = arguments[0];
    queryMode = 'all';
  } else {
    cb = arguments[1];
    query = arguments[0];
    if(typeof query === 'number')queryMode = 'byId';
    else if(typeof query === 'string')queryMode = 'byName';
    else err = new Error('unknown query '+query);
  }

  switch(queryMode){
    case 'all':
      //make copy of clusters to prevent external modification.
      results = [].concat(clusters).filter(nonNullFilter);
      break;
    case 'byId':
      results = clusters.filter(queryByIdFilter.bind(null, query))[0] || null;
      break;
    case 'byName':
      results = clusters.filter(queryByNameFilter.bind(null, query))[0] || null;
      break;
  }
  process.nextTick(cb.bind(null, err, results));
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
  return cluster instanceof Object && cluster.id === id;
}

function queryByNameFilter(name, cluster){
  return cluster instanceof Object && cluster.name === name;
}

