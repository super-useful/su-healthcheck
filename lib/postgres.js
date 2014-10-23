var url = require('url');
var copg = require('co-pg')(require('pg'));
var queries = require('./queries/postgres');

module.exports = function* postgres(options) {
    if (typeof options !== 'object') {
        options = {};
    }
    options.schema = options.schema || 'public';

    var connectionStr = url.format({
        protocol: 'postgres',
        slashes: true,
        auth: options.user || 'postgres',
        hostname: options.host || '127.0.0.1',
        port: options.port || 5432,
        pathname: options.db || 'postgres'
    });

    try {
        var client = new copg.Client(connectionStr);
        yield client.connect_();

        var res = yield client.query_(queries.getSchema(options.schema));

        var things = res.rows.reduce(function (buf, row) {
            var key = row.type.toLowerCase();
            buf[key] = buf[key] || [];
            buf[key].push(row.name)

            return buf;
        }, {});

        return things;
    } catch(e) {
        return e;
    } finally {
        if (client) {
            client.end();
        }
    }
};
