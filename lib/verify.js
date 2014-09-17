module.exports = function verify (check) {
    var errors = [];
    Object.keys(check).forEach(function (key, i, obj) {
        if (check[key] === false) {
            errors.push(key);
        }
    });

    if (errors.length > 0) {
        throw new Error('Health checks failed: '+ errors.join(', '));
    }
}
