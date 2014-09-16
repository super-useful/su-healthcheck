var copg = require('co-pg')(require('pg'));
var queries = require('./queries/postgres');

module.exports = function* postgres(host, port, user, db, schema, tables) {
    var connectionStr = 'postgres://' + user + '@' + (host || '127.0.0.1') + ':' + (port || 5432) + '/' + db;

    try {
        var client = new copg.Client(connectionStr);
        yield client.connect_();

        var res = yield client.query_(queries.getSchema(schema));

        var things = res.rows.reduce(function (buf, row) {
            var key = row.type.toLowerCase();
            buf[key] = buf[key] || [];
            buf[key].push(row.name)

            return buf;
        }, {});

        return things;
    } catch(e) {
        //console.log('Postgres: error connecting to '+ connectionStr, e.stack);
        return false;
    } finally {
        client.end();
    }
};
