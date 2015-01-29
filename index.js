module.exports = {
    df : require('./lib/df'),
    memory : require('./lib/memory'),
    redis : require('./lib/redis'),
    mongo : require('./lib/mongodb'),
    postgres : require('./lib/postgres'),
    sshTunnel : require('./lib/ssh_tunnel'),
    verify : require('./lib/verify'),
    host: require('./lib/host'),
    version : function() {
        return process.version;
    }
};
