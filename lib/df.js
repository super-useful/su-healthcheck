var exec = require('child_process').execSync;

module.exports = function df() {
    try {
        return 100 - parseFloat(exec("df | grep / | awk '{ print $8 }'").toString().trim().split('\n')[0]) + '%';
    } catch (e) {
        return false;
    }
};
