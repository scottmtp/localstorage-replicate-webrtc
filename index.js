'use strict';
var util = require('util');
var ReplicatorCommon = require('replicate-common');

var LocalStorageReplicator = function(name, signalUrl, rtcOptions, storage) {
  ReplicatorCommon.call(this, name, signalUrl, rtcOptions);
  
  // LocalStorageReplicator
  this.localStorage = storage;
  this.replData = [];
  this.marker = '__end__';
  this.namespaceAttribute = '__namespace__';
};

util.inherits(LocalStorageReplicator, ReplicatorCommon);
module.exports = LocalStorageReplicator;

LocalStorageReplicator.prototype.receiveData = function(chunk) {
  var self = this;
  
  // note double-equals to coerce arraybuffer to string
  if (chunk == self.marker) {
    self.emit('enddata', self._getAndClearData());
  } else {
    self.replData.push(chunk);
  }
  
};

LocalStorageReplicator.prototype._getAndClearData = function() {
  var self = this;
  
  var data = self.replData.join('');
  self.replData = [];
  
  var store = JSON.parse(data);
  var namespace = store[self.namespaceAttribute];
  delete store[self.namespaceAttribute];
  
  var storeJson = JSON.stringify(store);  
  self.localStorage.setItem(namespace, storeJson);
  self.emit('localstorageupdate', namespace, storeJson);
};

LocalStorageReplicator.prototype.replicate = function(namespace) {
  var self = this;
  var store = JSON.parse(self.localStorage.getItem(namespace));
  store[self.namespaceAttribute] = namespace;

  self.streams.forEach(function(s) {
    s.write(JSON.stringify(store));
    s.write(self.marker);
  });
};
