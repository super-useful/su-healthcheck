var co = require('co');

var df = require('./lib/df');
var memory = require('./lib/memory');
var redis = require('./lib/redis');
var mongo = require('./lib/mongodb');
var postgres = require('./lib/postgres');
var ssh_tunnel = require('./lib/ssh_tunnel');

co(function* () {
    console.log({
        available_diskspace : df(),
        free_memory : memory(),
        node : process.version,
        redis : yield redis('127.0.0.1', 6379),
        crunchgoat : yield mongo('127.0.0.1', 27017, 'crunchgoat', ['reads']),
        goatheist : yield mongo('127.0.0.1', 27017, 'goatheist', ['users', 'breakdown', 'comparison']),
        postgres : yield postgres('127.0.0.1', 5432, 'ubuntu', 'ubuntu', 'me'),
        postgres_tunnel : ssh_tunnel('54.195.60.13', 5432, '127.0.0.1', 5432, 'ubuntu')
    });
})();
