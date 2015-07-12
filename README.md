#  localstorage-replicate-webrtc

Replicate localStorage data over a WebRTC DataChannel.

## About

By using a WebRTC DataChannel, we can share data between browsers without storing 
the data on a centralized server.

## Usage

```
var replicator = new LocalStorageReplicator('https://switchboard.rtc.io/', {room: 'localstorage-replicate-test'}, window.localStorage);

replicator.on('endpeerreplicate', function() {
  console.log('received data from replication');
});

replicator.join()
  .then(function() {
    replicator.replicate();
  });

```

## License

MIT © [Scott Dietrich](http://minutestopost.com)
