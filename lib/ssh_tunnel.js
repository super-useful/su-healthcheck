var exec = require('child_process').execSync;

module.exports = function ssh_tunnel(options) {
    if (typeof options !== 'object') {
        options = {};
    }
    options.bindPort = options.bindPort || options.hostPort;
    options.bindHost = options.bindHost || '127.0.0.1';
    options.user = options.user ? options.user + '@' : '';

    if (!options.hostPort || !options.host) {
        throw new Error('host and hostPort must be supplied');
    }

    try {
        return exec('ps aux | grep -E "ssh.*?"' + options.bindPort + ':' + options.bindHost + ':' + options.hostPort + '.*?' + options.user + options.host + '').toString().split('\n').slice(0, -1).filter(function (line) {
            return line.indexOf('grep -E') < 0;
        }).length > 0;
    } catch (e) {
        return false;
    }
};
