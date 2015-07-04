'use strict';
var chai = require('chai')
var assert = chai.assert;
var expect = chai.expect;
var cuid = require('cuid');

var Promise = require('promise');
var LocalStorageReplicator = require('../');
var LocalStorage = require('node-localstorage').LocalStorage;

describe('localstorage-replicate-webrtc node module', function () {
  var store1, store2, store3, replicator1, replicator2, replicator3;
  var signalUrl = 'http://localhost:3000/';
  
  beforeEach(function(done) {
    var rtcOpts = {
      room: cuid(),
      nick: 'foo',
      plugins: [ require('rtc-plugin-node') ]
    };
    
    store1 = new LocalStorage('./store1');
    store2 = new LocalStorage('./store2');
    store3 = new LocalStorage('./store3');
    
    replicator1 = new LocalStorageReplicator('replicator1', signalUrl, rtcOpts, store1);
    replicator2 = new LocalStorageReplicator('replicator2', signalUrl, rtcOpts, store2);
    replicator3 = new LocalStorageReplicator('replicator3', signalUrl, rtcOpts, store3);

    Promise.all([replicator1.join(2), replicator2.join(2), replicator3.join(2)])
      .then(function() {
        done();
      });
      
  });
  
  afterEach(function() {
    store1._deleteLocation();
    store2._deleteLocation();
    store3._deleteLocation();
  });
  
  it('should replicate an object', function (done) {
    
    var namespace = 'localstore-replicate';
    var data = {
      a: 'a',
      b: 'b'
    };
    
    replicator2.on('endreplicate', function(ns, store) {
      var storeObj = JSON.parse(store);
      var storeObj2 = JSON.parse(store2.getItem(ns));
      
      // verify namespace
      assert.equal(namespace, ns);
      
      // verify emitted data
      assert.equal(data.a, storeObj.a);
      assert.equal(data.b, storeObj.b);
      
      // verify localstorage data
      assert.equal(data.a, storeObj2.a);
      assert.equal(data.b, storeObj2.b);
      
      done();
    });
    
    store1.setItem(namespace, JSON.stringify(data));
    replicator1.replicate(namespace);
  });
  
  it('should replicate an array', function (done) {
    
    var namespace = 'localstore-replicate';
    var data = [
      {a: '1'},
      {a: '2'}
      ];
    
    replicator2.on('endreplicate', function(ns, store) {
      var storeObj = JSON.parse(store);
      var storeObj2 = JSON.parse(store2.getItem(ns));
      
      // verify namespace
      assert.equal(namespace, ns);
      
      // verify emitted data
      assert.equal(data[0].a, storeObj[0].a);
      assert.equal(data[1].a, storeObj[1].a);
      
      // verify localstorage data
      assert.equal(data[0].a, storeObj2[0].a);
      assert.equal(data[1].a, storeObj2[1].a);
      
      done();
    });
    
    store1.setItem(namespace, JSON.stringify(data));
    replicator1.replicate(namespace);
  });
});