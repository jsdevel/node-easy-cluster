#!/usr/bin/env node
var argv = require('minimist')(process.argv.slice(2), {
  boolean:['--silent']
});
var server = require('../lib/server');

if(!argv.port)argv.port = 18675;

server(argv);
