var thunkify = require('thunkify');
var ping = require('ping');

module.exports = thunkify(function pingHost(port, host, done) {
    ping.sys.probe(host, function(isAlive){
        return done(null, isAlive);
    });
});
