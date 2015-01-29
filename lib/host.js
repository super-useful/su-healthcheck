var pingHost = require('./helpers/pingHost');

module.exports = function* host(options) {
    //if (typeof options !== 'object') {
    //    options = {};
    //}

    try {
        var connection = yield pingHost(options.port, options.host || '127.0.0.1');

        return res === 'PONG';
    } catch (e) {
        throw new Error(e);
    }
};
