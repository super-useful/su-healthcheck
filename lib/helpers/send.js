var read = require('co-read');

function* exec(connection, command) {
     connection.write(command, 'utf-8');

    var res = (yield read(connection)).toString().trim();

    connection.end();

    return res;
}

function* execAndDestroy(connection, command) {
    var res = yield exec.apply(null, arguments);

    connection.destroy();

    return res;
}

module.exports = {
    exec : exec,
    execAndDestroy : execAndDestroy
};
