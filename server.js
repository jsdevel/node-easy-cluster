'use strict';

require('express-namespace');
require('express-crud');
var express = require('express');
var http = require('http');
var enforceKey = require('./lib/util/middleware/enforceKey');

module.exports = function(args){
  var app = express();
  var server = http.createServer(app);

  app.use(express.json());
  app.use(express.urlencoded());

  if(args.key){
    app.use(enforceKey(args.key));
  }
  server.listen(args.port, function(){
    if(args.port === 0 || !args.silent){
      console.log('Listening on port '+server.address().port);
    }
  });

  app.namespace('/app', function(){
    require('./lib/controllers/app')(app, args);
    require('./lib/controllers/app/clusters')(app, args);
  });
};