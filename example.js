var df = require('./lib/df');
var memory = require('./lib/memory');
var redis = require('./lib/redis');
var mongo = require('./lib/mongodb');
var postgres = require('./lib/postgres');
var ssh_tunnel = require('./lib/ssh_tunnel');

console.log({
    available_diskspace : df(),
    free_memory : memory(),
    node : process.version,
    redis : redis('127.0.0.1', 6379),
    mongodb : mongo('127.0.0.1', 27017, 'crunchgoat', ['reads']),
    postgres : postgres('127.0.0.1', 5432, 'ubuntu', 'ubuntu', 'me', ['contract', 'data_range', 'reads']),
    postgres_tunnel : ssh_tunnel('54.195.60.13', 5432, '127.0.0.1', 5432, 'ubuntu')
});
