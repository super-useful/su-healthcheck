var net = require('net');
var thunkify = require('thunkify');

module.exports = thunkify(function netConnect(port, host, done) {
    net.connect(port, host, function() {
        done(null, this);
    });
});
