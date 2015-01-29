var pingHost = require('./helpers/pingHost');

module.exports = function* host(options) {
    try {
        var isAlive = yield pingHost(options.port, options.host || '127.0.0.1');

        if (!isAlive) {
            throw new Error('Host is down');
        }

        return;
    } catch (e) {
        throw new Error(e);
    }
};
