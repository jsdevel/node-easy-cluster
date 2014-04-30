'use strict';

var path = require('path');


module.exports = function(fixture){
  return path.resolve(__dirname, fixture.replace(/\.js$/, '') + '.js');
};
