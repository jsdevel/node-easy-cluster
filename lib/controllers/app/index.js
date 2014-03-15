'use strict';

var async = require('async');
var errToNext = require('../../util/errToNext');
var Cluster = require('../../services/Cluster');

module.exports = function(app, args){
  app.get('/', showStatus);
};

function showStatus(req, res, next){
  async.parallel([
    Cluster.read.bind(null)
  ], errToNext(next, handleStatus.bind(null, res)));
}

function handleStatus(res, clusters){
  res.json({
    clusters: clusters[0]
  });
}