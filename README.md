#  localstorage-replicate-webrtc

Replicate localStorage data over a WebRTC DataChannel.

## Usage

```
var replicator = new LocalStorageReplicator('https://switchboard.rtc.io/', {room: 'localstorage-replicate-test'}, window.localStorage);

replicator.on('endreplicate', function() {
  console.log('received data from replication');
});

replicator.join()
  .then(function() {
    replicator.replicate();
  });

```

## License

MIT © [Scott Dietrich](http://minutestopost.com)
