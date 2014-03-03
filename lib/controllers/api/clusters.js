'use strict';

var Cluster = require('../../services/Cluster');
var errToNext = require('../../util/errToNext');

module.exports = function(app, args){
  app.post('/clusters', postCluster);
};

function postCluster(req, res, next){
  Cluster.create(req.body, errToNext(next, function(cluster){
    res.json(cluster);
  }));
}

