var exec = require('child_process').execSync;

module.exports = function mongodb(host, port, db, collections) {
    var res, show = 'show dbs';

    host = ' --host ' + (host || '127.0.0.1');
    port = ' --port ' + (port || 27017);

    if (db && typeof db === 'string') {
        db =  ' ' + db;
        show = 'show collections';

        if (collections) {
            if (!Array.isArray(collections)) {
                collections = [collections];
            }
        }
        else {
            collections = null;
        }
    }
    else {
        db = '';
    }

    try {
        res = exec('echo "' + show + '" | mongo' + host + port + db).toString().trim().split('\n').slice(2, -1);

        if (Array.isArray(collections)) {
            return collections.reduce(function(acc, collection) {
                acc[collection] = res.indexOf(collection) > -1;

                return acc;
            }, {});
        }

        return res.length > 0;
    } catch (e) {
        return false;
    }
};
