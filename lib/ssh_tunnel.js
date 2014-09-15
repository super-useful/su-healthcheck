var exec = require('child_process').execSync;

module.exports = function ssh_tunnel(host, host_port, bind_host, bind_port, user) {
    if (!bind_port) {
        bind_port = host_port;
    }

    bind_host = bind_host || '127.0.0.1';

    user = user ? user + '@' : '';

    try {
        return exec('ps aux | grep -E "ssh.*?"' + bind_port + ':' + bind_host + ':' + host_port + '.*?' + user + host + '').toString().split('\n').slice(0, -1).filter(function (line) {
            return line.indexOf('grep -E') < 0;
        }).length > 0;
    } catch (e) {
        return false;
    }
};
