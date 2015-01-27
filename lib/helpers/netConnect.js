var net = require('net');
var thunkify = require('thunkify');

module.exports = thunkify(function netConnect(port, host, done) {
    var n = net.connect(port, host, function() {
        done(null, this);
    });

    // listen for any errors
    n.on('error', function (err) {
        done(err);
    });
});
