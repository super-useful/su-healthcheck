var HC = require('su-healthcheck');
var co = require('co');

co(function* () {

    // Setup and run your checks
    var res = {
        available_diskspace : HC.df(),
        free_memory : HC.memory(),
        node : HC.version(),
        redis : yield HC.redis('127.0.0.1', 6379),
        mongo : yield HC.mongo('127.0.0.1', 27017, 'crunchgoat'),
        postgres : yield HC.postgres('127.0.0.1', 5432, 'ubuntu', 'ubuntu', 'me'),
        sshTunnel : HC.sshTunnel('54.195.60.13', 5432, '127.0.0.1', 5432, 'ubuntu')
    };

    console.log(res);

    // Verify throws an error if any of the checks fail
    HC.verify(res);
})();
