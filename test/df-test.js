var mocha = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var expect = chai.expect;
chai.use(sinonChai);

describe('df', function(){
    var subject;

    beforeEach(function () {
        subject = mockuire('../lib/df', {
            'child_process': {
                execSync: function () {
                    return "25%\n100%\n0\n0";
                }
            }
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    it('should return free disk space as a percentage', function () {
        expect(subject()).to.be.equal('75%');
    });

    it('should return false if an error is thrown', function () {
        subject = mockuire('../lib/df', {
            'child_process': {
                execSync: function () {
                    throw new Error('boom');
                }
            }
        });
        expect(subject()).to.be.false;
    });
});
