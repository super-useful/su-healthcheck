var comongo = require('co-mongo');

module.exports = function* mongo(host, port, db) {
    var connectionStr = 'mongodb://' + (host || '127.0.0.1') + ':' + (port || 27017),
        ignoredCollections = ['system.indexes'];

    if (typeof db === 'string') {
        connectionStr += '/' + db;
    }

    try {
        var conn = yield comongo.connect(connectionStr),
            collections = [];
        if (typeof db === 'string') {
            var db_collections = yield conn.collections();
            collections = db_collections.reduce(function (buf, col) {
                var name = col._collection.collectionName;
                if (ignoredCollections.indexOf(name) === -1) {
                    buf.push(name);
                }
                return buf;
            }, []);
        }
        yield conn.close();
        return collections.length === 0 ? false : collections;
    } catch (e) {
        console.log('Mongodb: error connecting to '+ connectionStr, e.stack);
        return false;
    }
};
