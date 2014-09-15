var exec = require('child_process').execSync;

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

module.exports = function postgres(host, port, user, db, schema, tables) {
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
