# su-healthcheck

super useful API health check plug-in for su-apiserver

```
var HC = require('su-healthcheck');
var co = require('co');

co(function* () {

    // Setup and run your checks
    var res = {
        available_diskspace : HC.df(),
        free_memory : HC.memory(),
        node : HC.version(),
        redis : yield HC.redis(),
        mongo : yield HC.mongo({db: 'crunchgoat'}),
        postgres : yield HC.postgres({user: 'ubuntu', db: 'ubuntu', schema: 'me'}),
        sshTunnel : HC.sshTunnel({host: '54.195.60.13', hostPort: 5432, bindHost: '127.0.0.1', bindPort: 5432, user: 'ubuntu'})
    };

    // Verify throws an error if any of the checks fail
    HC.verify(res);

})();
```

### Run the example

```
$ node --nolazy --harmony example.js
```

### Tests

```
$ npm test
```
