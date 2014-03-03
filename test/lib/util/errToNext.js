'use strict';

describe('errToNext handler', function(){
  var sinon = require('sinon');
  var next = sinon.stub();
  var cb = sinon.stub();
  var module = require('../../../lib/util/errToNext');

  beforeEach(function() {
    next.reset();
    cb.reset();
  });

  it('calls next when an error occurs', function() {
    module(next, cb)(5);
    sinon.assert.calledWith(next, 5);
    sinon.assert.notCalled(cb);
  });
});