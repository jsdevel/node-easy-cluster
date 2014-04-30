'use strict';

var express = require('express');
var http = require('http');
var enforceKey = require('./lib/middleware/enforceKey');
var jsonErrors = require('./lib/middleware/jsonErrors');

require('express-crud');

module.exports = function(args){
  var app = express();
  var server;

  app.use(express.json());
  app.use(express.urlencoded());

  if(args.key){
    app.use(enforceKey(args.key));
  }


  require('./lib/controllers')(app, args);
  require('./lib/controllers/clusters')(app, args);

  app.use(jsonErrors);

  server = http.createServer(app);
  server.listen(args.port, function(){
    if(args.port === 0 || !args.silent){
      console.log('Listening on port '+server.address().port);
    }
  });

};
