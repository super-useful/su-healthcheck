module.exports = function verify (check) {
    if (typeof check !== 'object') {
        throw new Error('check is not an object');
    }

    var errors = [];
    Object.keys(check).forEach(function (key, i, obj) {
        if (check[key] === false || check[key] instanceof Error) {
            errors.push(key);
        }
    });

    if (errors.length > 0) {
        throw new Error('Health checks failed: '+ errors.join(', '));
    }

    return true;
}
