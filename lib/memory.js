var os = require('os');

module.exports = function memory() {
    return Math.round((os.freemem() / os.totalmem()) * 100) + '%';
};
