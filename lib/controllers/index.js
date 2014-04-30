'use strict';

var async = require('async');
var errHandler = require('err-handler');
var Cluster = require('../services/ClusterService');

module.exports = function(app, args){
  app.get('/', showStatus);
};

function showStatus(req, res, next){
  async.parallel([
    Cluster.read.bind(null)
  ], errHandler(next, handleStatus.bind(null, res)));
}

function handleStatus(res, clusters){
  res.json({
    clusters: clusters[0]
  });
}
