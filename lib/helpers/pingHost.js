var thunkify = require('thunkify');

module.exports = thunkify(function pingHost(port, host, done) {
    ping.promise.probe(host, {
        timeout: 10,
        extra: ["-i 2"]
    }).then(function (res) {
        console.log(res);
    });
});
