'use strict';

var Cluster = require('../../services/Cluster');

module.exports = function(app, args){
  app.crud('clusters', Cluster);
};