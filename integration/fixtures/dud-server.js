'use strict';
var http = require('http');


http.createServer(function(req, res){
  res.end('foo');
}).listen(18676);