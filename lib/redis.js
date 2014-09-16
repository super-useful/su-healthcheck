var connect = require('./helpers/netConnect');
var send = require('./helpers/send');

var re_nonalpha = /[^A-Za-z]/g;

module.exports = function* redis(host, port) {
    try {
        var connection = yield connect(port || 6379, host || '127.0.0.1');

        var res = (yield send.execAndDestroy(connection, '*1\r\n$4\r\nPING\r\n')).replace(re_nonalpha, '').toUpperCase();

       return res === 'PONG';
    } catch (e) {
        return false;
    }
};
