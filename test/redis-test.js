var mocha  = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var co  = require('co');
var expect = chai.expect;
chai.use(sinonChai);

describe('redis check', function(){
    var subject, connectStub, sendStub;
    beforeEach(function () {
        connectStub = sinon.spy(function* () {
            return 'connectStub';
        });
        sendStub = {
            execAndDestroy: sinon.spy(function* () {
                return 'PONG';
            })
        };

        subject = mockuire('../lib/redis', {
            './helpers/netConnect': connectStub,
            './helpers/send': sendStub
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    describe('should call connect', function () {
        it('should call connect with redis defaults', co(function* () {
            yield subject();
            expect(connectStub).to.have.been.calledWith(6379, '127.0.0.1');
        }));

        it('should call connect with host and port options', co(function* () {
            yield subject({
                port: 8080,
                host: 'only'
            });
            expect(connectStub).to.have.been.calledWith(8080, 'only');
        }));

    });

    describe('should call execAndDestroy', function () {
        it('should call execAndDestroy with PING', co(function* () {
            yield subject({
                port: 8080,
                host: 'only'
            });
            expect(sendStub.execAndDestroy).to.have.been.calledWith('connectStub', '*1\r\n$4\r\nPING\r\n');
        }));
    });

    describe('results', function () {
        it('should return true when ping is successful', co(function* () {
            var res = yield subject({
                port: 8080,
                host: 'only'
            });
            expect(res).to.be.true;
        }));

        it('should return false when an error is thrown', co(function* () {
            subject = mockuire('../lib/redis', {
                './helpers/netConnect': function* () {
                    throw new Error('A bad thing happened');
                }
            });

            var res = yield subject();
            expect(res).to.be.false;
        }));
    });
});
