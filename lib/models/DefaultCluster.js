'use strict';

module.exports = DefaultCluster;

function DefaultCluster(){
  this.id = null;
  this.name = null;
  this.strategy = 'simple';
  this.workerPath = null;
}
