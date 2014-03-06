'use strict';

var Cluster = require('../../services/Cluster');
var errToNext = require('../../util/errToNext');

module.exports = function(app, args){
  app.get('/clusters/:id', getClusterById);
  app.post('/clusters', postCluster);
};

function getClusterById(req, res, next){
  Cluster.read(req.params.id, errToNext(next, function(cluster){
    res.json(cluster ? 200 : 404, cluster);
  }));
}

function postCluster(req, res, next){
  Cluster.create(req.body, errToNext(next, function(cluster){
    res.json(cluster);
  }));
}

