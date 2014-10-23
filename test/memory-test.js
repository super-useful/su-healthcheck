var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var expect = chai.expect;
chai.use(sinonChai);

describe('memory', function(){
    var subject;

    beforeEach(function () {
        subject = mockuire('../lib/memory', {
            'os': {
                freemem: function () { return 10 },
                totalmem: function () { return 20 }
            }
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    it('should return memory usage as a percentage', function () {
        expect(subject()).to.be.equal('50%');
    });
});
