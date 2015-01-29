var pingHost = require('./helpers/pingHost');

function HostDownException (value) {
    this.value = value;
    this.message = 'cant be reached';
    this.toString = function() {
        return this.value + ' ' + this.message
    };
}

module.exports = function* host(options) {
    try {
        var isAlive = yield pingHost(options.port, options.host || '127.0.0.1');

        if (!isAlive) {
            throw new HostDownException(options.host);
        }

        return;
    } catch (e) {
        throw new Error(e);
    }
};
