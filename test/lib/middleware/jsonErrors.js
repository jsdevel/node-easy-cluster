'use strict';

describe('jsonErrors', function(){
  var sinon = require('sinon');
  var sut = require('../../../lib/middleware/jsonErrors.js');
  var res = {
    json: sinon.stub()
  };

  beforeEach(function(){
    res.json.reset();
  });

  it('is middleware', function(){
    sut.should.be.type('function');
  });

  it('sends Error details to the response', function(){
    sut(new Error('dogs'), null, res, null);
    sinon.assert.calledWith(res.json, 500, sinon.match({
      'message':'dogs'
    }));
  });

  it('handles non Errors', function(){
    sut('asdf', null, res, null);
    sinon.assert.calledWith(res.json, 500, sinon.match({
      'message': 'asdf'
    }));
  });
});
