#  localstorage-replicate-webrtc

Replicate localStorage data over a WebRTC DataChannel, for NodeJS and the Browser.

## About

By using a WebRTC DataChannel, we can share data between browsers without storing
the data on a centralized server.

## Usage

Example using [rtc-quickconnect](https://github.com/rtc-io/rtc-quickconnect):

```
var LocalStorageReplicator = require('localstorage-replicate-webrtc');
var quickconnect = require('rtc-quickconnect');

var replicator = new LocalStorageReplicator('my-replicator', window.localStorage);

quickconnect('https://switchboard.rtc.io/', { room: 'qc-simple-demo' })
  .createDataChannel('replication')
  .on('channel:opened:replication', function(id, dc) {
    replicator.addPeer(id, dc);
    replicator.replicate();
  });
```

## License

MIT © [Scott Dietrich](http://minutestopost.com)
