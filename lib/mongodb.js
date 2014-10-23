var url = require('url');
var comongo = require('co-mongo');

module.exports = function* mongo(options) {
    if (typeof options !== 'object') {
        options = {};
    }

    var ignoredCollections = ['system.indexes'];
    var connectionStr = url.format({
        protocol: 'mongodb',
        slashes: true,
        hostname: options.host || '127.0.0.1',
        port: options.port || 27017,
        pathname: options.db
    });

    try {
        var conn = yield comongo.connect(connectionStr),
            collections = [];

        if (typeof options.db === 'string') {
            var collectionList = yield conn.collections();
            collections = collectionList.reduce(function (buf, col) {
                var name = col._collection.collectionName;
                if (ignoredCollections.indexOf(name) === -1) {
                    buf.push(name);
                }
                return buf;
            }, []);

            return collections.length === 0 ? false : collections;
        } else {
            return true;
        }
    } catch (e) {
        return e;
    } finally {
        if (conn) {
            yield conn.close();
        }
    }
};
