var exec = require('child_process').execSync;

var copg = require('co-pg')(require('pg'));

var iter = require('super-iter');

var pluck = iter.pluck;

var re_whitespace = /\s+/gm;

// list dbs              => echo "\a \t \l" | psql --d ubuntu -h 127.0.0.1 -p 5432 -U ubuntu
// list schemas          => echo "\a \t \dn" | psql --d ubuntu -h 127.0.0.1 -p 5432 -U ubuntu
// list tables in schema => echo "\a \t \dt me.*" | psql --d ubuntu -h 127.0.0.1 -p 5432 -U ubuntu

function get(cmd) {
    return exec(cmd).toString().trim().split('\n').slice(3, -1).map(function(row) {
        return row.replace(re_whitespace, '').split('|');
    });
}

module.exports = function* postgres(host, port, user, db, schema, tables) {
    var client = new copg.Client('postgres://' + user + '@' + (host || '127.0.0.1') + ':' + (port || 5432) + '/' + db);

    yield client.connect_();

    try {
        var q = yield client.query_("SELECT routine_type, routine_name FROM information_schema.routines WHERE specific_schema NOT IN"
            + "\n('pg_catalog', 'information_schema') AND type_udt_name != 'trigger'"
            + "\nUNION"
            + "\nselect table_type, table_name from information_schema.tables where table_schema='" + (schema || 'public') + "'");

        console.log(q);
    } catch(e) {
        console.log(e.stack);
    }

    var res;

    host = ' -h ' + (host || '127.0.0.1');
    port = ' -p ' + (port || 5432);

    if (user && typeof user === 'string') {
        user = ' -U ' + user;
    }
    else {
        user = '';
    }

    if (db && typeof db === 'string') {
        if (tables) {
            if (!Array.isArray(tables)) {
                tables = [tables];
            }
        }
        else {
            tables = null;
        }
    }
    else {
        db = '';
    }

    try {
        res = get('echo "\\l ' + db + '" | psql --d ' + db + host + port + user);

        if (res.length < 1) {
            return false;
        }

        if (schema) {
            res = pluck(get('echo "\\dt ' + schema + '.*" | psql --d ' + db + host + port + user), '1');

            if (Array.isArray(tables)) {
                return tables.reduce(function(acc, table) {
                    acc[table] = res.indexOf(table) > -1;

                    return acc;
                }, {});
            }
        }

        return res.some(function(item) {
            return item[0] === db;
        });
    } catch (e) {
        return false;
    }
};
