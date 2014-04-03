'use strict';

module.exports = Cluster;

/**
 * @constructor
 * Cluster represents a MasterProcess in a more friendly way.
 */
function Cluster(model, process){
  //validate the model
  if(!(model instanceof Object))throw new Error(
    'model wasn\'t an Object'
  );

  if(model.id > 0 === false)throw new Error(
    'model.id wasn\'t a number'
  );

  if(typeof model.workerPath !== 'string')throw new Error(
    'model.workerPath wasn\'t a string'
  );

  //validate the process
  if(!(process instanceof Object))throw new Error(
    'process wasn\'t an Object'
  );

  if(process.pid > 0 === false)throw new Error(
    'process.pid wasn\'t a number'
  );


  this.id = model.id;
  this.name = model.name || null;
  this.pid = null;
  this.strategy = model.strategy || 'simple';
  this.workerPath = model.workerPath;

  Object.defineProperty(this, 'process', {
    value: process
  });
}

