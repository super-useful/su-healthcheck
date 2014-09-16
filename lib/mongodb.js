var exec = require('child_process').execSync;
var iter = require('super-iter');

var comongo = require('co-mongo');

var findIndex = iter.findIndex;

module.exports = function* mongodb(host, port, db, collections) {
    var connection = 'mongodb://' + (host || '127.0.0.1') + ':' + (port || 27017);

    if (db && typeof db === 'string') {
        connection += '/' + db;

        if (collections) {
            if (!Array.isArray(collections)) {
                collections = [collections];
            }
        }
        else {
            collections = null;
        }
    }

    var db = yield comongo.connect(connection);

    if (Array.isArray(collections)) {
        var db_collections = yield db.collections();

        return collections.reduce(function(acc, name) {
            var index = findIndex(db_collections, function(col) {
                return col._collection.collectionName === name;
            });

            acc[name] = index > -1;

            return acc;
        }, {});
    }

    return !(db instanceof Error);
};
