var df = require('./lib/df');
var memory = require('./lib/memory');
var redis = require('./lib/redis');
var mongo = require('./lib/mongodb');
var postgres = require('./lib/postgres');
var sshTunnel = require('./lib/ssh_tunnel');
var verify = require('./lib/verify');


module.exports = {
    df: df,
    version: function () {return process.version},
    memory: memory,
    redis: redis,
    mongo: mongo,
    postgres: postgres,
    sshTunnel: sshTunnel,
    verify: verify
};
