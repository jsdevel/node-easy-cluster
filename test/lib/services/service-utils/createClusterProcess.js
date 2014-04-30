'use strict';

describe('createClusterProcess', function(){
  var assert = require('assert');
  var getFixture = require('../../../fixtures/getFixture.js');
  var sut = require('../../../../lib/services/service-utils/createClusterProcess.js');

  sut.should.be.type('function');

  it('should expect workerPath', function(done){
    sut({workerPath:null}, function(err){
      err.message.should.match('File not found: null');
      done();
    });
  });

  it('should expect a given strategy to exist', function(done){
    sut({workerPath:__filename, strategy: 'foo'}, function(err){
      err.message.should.match('unknown strategy foo');
      done();
    });
  });

  it('should expect a given startupTime to be an integer', function(done){
    sut({workerPath: __filename, startupTime: 'asdf'}, function(err){
      err.message.should.match('startupTime not truthy');
      done();
    });
  });

  it('should respond with error code if worker excessively dies during startup phase', function(done){
    sut({workerPath: getFixture('exit-immediately-with-14'), startupTime: 3000}, function(err, process){
      err.message.should.match('code was 42');
      done();
    });
  });

  it('should return a successful process', function(done){
    sut(
      {workerPath: getFixture('hello-world-worker')},
      function(err, process){
        process.kill();
        done();
      }
    );
  });


});
