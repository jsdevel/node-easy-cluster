'use strict';

var Cluster = require('../../services/Cluster');
var errToNext = require('../../util/errToNext');

module.exports = function(app, args){
  app.get('/clusters/:id', getClusterById);
  app.get('/clusters', getClustersByNameOrAll);
  app.post('/clusters', postCluster);
};

function getClusterById(req, res, next){
  Cluster.read(req.params.id, errToNext(next, function(cluster){
    res.json(cluster ? 200 : 404, cluster);
  }));
}

function getClustersByNameOrAll(req, res, next){
  var name = req.query.name;
  var args = [];

  if(name)args.push(name);
  args.push(errToNext(next, function(cluster){
    res.json(
      (Array.isArray(cluster) ? !!cluster.length : !!cluster)
      ? 200
      : 404,
      cluster
    );
  }));
  Cluster.read.apply(Cluster, args);
}


function postCluster(req, res, next){
  Cluster.create(req.body, errToNext(next, function(cluster){
    res.json(cluster);
  }));
}

