module.exports = function verify(check) {
    if (typeof check !== 'object') {
        throw new Error('check is not an object');
    }

    var errors = [];

    Object.keys(check).forEach(_verify, check);

    if (errors.length > 0) {
        throw new Error('Health checks failed: '+ errors.join(', '));
    }

    return true;

    function _verify(key, i) {
        if (this[key] === false || this[key] instanceof Error) {
            errors.push(key);
        }
        else if (this[key] && typeof this[key] === 'object' && !Array.isArray(this[key])) {
            Object.keys(this[key]).forEach(_verify, this[key]);
        }
    }
};

