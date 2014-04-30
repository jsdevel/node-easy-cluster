'use strict';

describe('Cluster Model', function(){
  var assert = require('assert');
  var sinon = require('sinon');
  var Cluster = require('../../../lib/models/Cluster');
  var model;
  var process;

  beforeEach(function(){
    model = {
      id: 5,
      workerPath: '/asdfasdf'
    };
    process = {
      pid: 143,
      kill: sinon.stub()
    };
  });

  it('is a function', function(){
    Cluster.should.be.type('function');
  });

  it('is instantiable', function(){
    new Cluster(model, process);
  });

  describe('model arg', function(){
    it('must be an object', function(){
      assert.throws(function(){
        new Cluster(null, process);
      }, /^Error:\smodel\swasn't\san\sObject/);
    });

    it('.id must be a number', function(){
      model.id = null;
      assert.throws(function(){
        new Cluster(model, process);
      }, /^Error:\smodel.id\swasn't\sa\snumber/);
    });

    it('.workerPath must be a string', function(){
      model.workerPath = null;
      assert.throws(function(){
        new Cluster(model, process);
      }, /Error:\smodel.workerPath\swasn't\sa\sstring/);
    });
  });

  describe('process arg', function(){
    it('must be an object', function(){
      assert.throws(function(){
        new Cluster(model, null);
      }, /Error:\sprocess\swasn't\san\sObject/);
    });

    it('.pid must be a number', function(){
      process.pid = null;
      assert.throws(function(){
        new Cluster(model, process);
      }, /Error:\sprocess.pid\swasn't\sa\snumber/);
    });

  });

  describe('instance', function(){
    var cluster;
    beforeEach(function(){
      cluster = new Cluster(model, process);
    });

    it('proxies #kill to process#kill', function(){
      cluster.kill();
      sinon.assert.called(process.kill);
    });

    it('can be converted to JSON', function(){
      JSON.stringify(cluster);
    });
  });
});
