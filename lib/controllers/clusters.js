'use strict';

var ClusterService = require('../services/ClusterService');

module.exports = function(app, args){
  app.crud('clusters', ClusterService);
};
