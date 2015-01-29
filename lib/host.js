var pingHost = require('./helpers/pingHost');

function HostDownException (options) {
    this.value = options.host;
    this.hostname = options.hostname || 'host';
    this.message = 'cant be reached';
    this.toString = function() {
        return this.hostname + ' ' + this.message
    };
}

module.exports = function* host(options) {
    try {
        var isAlive = yield pingHost(options.port, options.host || '127.0.0.1');

        if (!isAlive) {
            throw new HostDownException(options);
        }

        return;
    } catch (e) {
        throw new Error(e);
    }
};
