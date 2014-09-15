var exec = require('child_process').execSync;

module.exports = function redis(host, port) {
    try {
        return exec('echo "ping" | redis-cli -h ' + (host || '127.0.0.1') + ' -p ' + (port || 6379)).toString().trim().toUpperCase() === 'PONG';
    } catch (e) {
        return false;
    }
};
