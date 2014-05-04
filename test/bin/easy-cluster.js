'use strict';

describe('easy-cluster', function() {
  var sinon = require('sinon');
  var prequire = require('proxyquire');
  var server = sinon.stub();
  var module;

  beforeEach(function() {
    server.reset();
    process.argv = [1,2,
      '--key', 'foo',
      '--port', '80',
      '--silent'
    ];
  });

  describe('all options', function(){
    beforeEach(setModule);
    it('handles options', function() {
      sinon.assert.calledWith(server, sinon.match({
        'key':'foo',
        'port':80,
        'silent':true
      }));
    });
  });

  describe('when no port is given', function() {
    it('defaults port to 18675', function(){
      process.argv.splice(4, 2);
      setModule();
      server.args[0][0].port.should.equal(18675);
    });
  });

  function setModule(){
    module = prequire('../../bin/easy-cluster', {
      '../lib/server':server
    });
  }
});
