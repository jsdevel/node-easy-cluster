'use strict';

describe('DefaultCluster', function(){
  var DefaultCluster = require('../../../lib/models/DefaultCluster');

  it('is a function', function(){
    DefaultCluster.should.be.type('function');
  });

  describe('properties', function(){
    var instance;

    beforeEach(function(){
      instance = new DefaultCluster();
    });

    it('has property "id"', function(){
      instance.should.have.property('id', null);
    });

    it('has property "name"', function(){
      instance.should.have.property('name', null);
    });

    it('has property "strategy"', function(){
      instance.should.have.property('strategy', 'simple');
    });

    it('has property "workerPath"', function(){
      instance.should.have.property('workerPath', null);
    });
  });
});
