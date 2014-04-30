'use strict';

describe('ClusterService', function() {
  var assert = require('assert');

  var ClusterService = require('../../../lib/services/ClusterService');
  var Cluster = require('../../../lib/models/Cluster');
  var getFixture = require('../../fixtures/getFixture');
  var helloWorldCluster;

  beforeEach(function(){
    helloWorldCluster = {
      workerPath: getFixture('hello-world-worker')
    };
  });

  afterEach(function(done){
    ClusterService.read(function(err, clusters){
      if(err)return done(err);
      clusters.forEach(function(cluster){
        ClusterService.delete(cluster.id, function(){});
      });
      setTimeout(done, 100);
    });
  });

  it('has crud methods', function(){
    ClusterService.create.should.be.type('function');
    ClusterService.delete.should.be.type('function');
    ClusterService.read.should.be.type('function');
    ClusterService.update.should.be.type('function');
  });

  describe('.create()', function(){
    it('creates clusters', function(done){
      ClusterService.create(helloWorldCluster, function(err, cluster){
        cluster.should.be.an.instanceOf(Cluster);
        ClusterService.delete(cluster.id, function(){
          done();
        });
      });
    });
  });

  describe('.delete()', function(){
    it('deletes clusters', function(done){
      ClusterService.create(helloWorldCluster, function(err, cluster){
        var id;
        cluster.should.be.an.instanceOf(Cluster);

        id = cluster.id;
        ClusterService.delete(id, function(){
          ClusterService.read(id, null, function(err, cluster){
            assert(!err);
            assert(!cluster);
            done();
          });
        });
      });
    });

    it('may be called when no cluster exists', function(done){
      ClusterService.delete(1, function(){
        done();
      });
    });
  });

  describe('.read()', function(){
    it('returns nothing for id query when no cluster exists', function(done){
      ClusterService.read(4, null, function(err, cluster){
        assert(!err);
        assert(!cluster);
        done();
      });
    });

    it('returns nothing for name query when no cluster exists', function(done){
      ClusterService.read({name:'foo'}, function(err, cluster){
        assert(!err);
        cluster.length.should.equal(0);
        done();
      });
    });

    it('returns nothing for all query when no cluster exists', function(done){
      ClusterService.read(function(err, cluster){
        assert(!err);
        cluster.length.should.equal(0);
        done();
      });
    });

    it('returns clusters byId', function(done){
      ClusterService.create(helloWorldCluster, function(err, cluster){
        var id = cluster.id;
        ClusterService.read(id, null, function(err, cluster){
          cluster.id.should.equal(id);
          done();
        });
      });
    });

    it('returns clusters byName', function(done){
      helloWorldCluster.name = 'foo';
      ClusterService.create(helloWorldCluster, function(err, cluster){
        ClusterService.read({name:'foo'}, function(err, cluster){
          cluster[0].name.should.equal('foo');
          done();
        });
      });
    });

    it('returns clusters byAll', function(done){
      ClusterService.create(helloWorldCluster, function(err, cluster){
        ClusterService.read(function(err, cluster){
          cluster[0].id.should.equal(0);
          done();
        });
      });
    });
  });

  describe('.update()', function(){
    it('returns error if no existing cluster exists', function(done){
      ClusterService.update(5, {}, function(err, cluster){
        err.message.match('cluster 5 not found');
        done();
      });
    });

    it('succeeds if the cluster exists', function(done){
      ClusterService.create(helloWorldCluster, function(err, cluster){
        cluster.id.should.equal(0);
        ClusterService.update(0, {name:'gaga'}, function(err, updated){
          updated.name.should.equal('gaga');
          updated.id.should.equal(0);
          done();
        });
      });
    });
  });
});
