var mocha  = require('mocha');
var chai = require('chai');
var expect = chai.expect;


describe('verify', function(){
    var subject;
    beforeEach(function () {
        subject = require('../lib/verify');
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    it('should return true if everything is OK', function () {
        expect(subject({
            thisCheck: true
        })).to.be.true;
    });

    it('should throw if more than one key is an error', function () {
        var obj = {
            acheck: new Error('failed')
        };

        expect(function() {subject(obj)}).to.throw(Error);
    });

    it('should throw if more than one key is fales', function () {
        var obj = {
            acheck: false
        };

        expect(function() {subject(obj)}).to.throw(Error);
    });
});
