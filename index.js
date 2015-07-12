'use strict';
var util = require('util');
var ReplicatorCommon = require('replicate-common');

var LocalStorageReplicator = function(name, signalUrl, rtcOptions, storage) {
  ReplicatorCommon.call(this, name, signalUrl, rtcOptions);
  
  // LocalStorageReplicator
  this.localStorage = storage;
  this.replData = [];
  this.marker = '__end__';
};

util.inherits(LocalStorageReplicator, ReplicatorCommon);
module.exports = LocalStorageReplicator;

LocalStorageReplicator.prototype.receiveData = function(chunk) {
  var self = this;
  
  // note double-equals to coerce arraybuffer to string
  if (chunk == self.marker) {
    self._getAndClearData();
  } else {
    self.replData.push(chunk);
  }
  
};

LocalStorageReplicator.prototype._getAndClearData = function() {
  var self = this;
  
  var data = self.replData.join('');
  self.replData = [];
  
  var msg = JSON.parse(data);
  var key = msg.key;
  
  var dataJson = JSON.stringify(msg.data);  
  self.localStorage.setItem(key, dataJson);
  self.emit('endpeerreplicate', key, dataJson);
};

LocalStorageReplicator.prototype.replicate = function(key) {
  var self = this;
  var store = JSON.parse(self.localStorage.getItem(key));
  var msg = {
    'data': store,
    'key': key
  };
  
  self.streams.forEach(function(s) {
    s.write(JSON.stringify(msg));
    s.write(self.marker);
  });
  
  return Promise.resolve();
};

