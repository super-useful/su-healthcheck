var mocha  = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var expect = chai.expect;
chai.use(sinonChai);

describe('ssh-tunnel check', function(){
    var subject, stub;

    beforeEach(function () {
        stub = sinon.stub().returns("\n\n");

        subject = mockuire('../lib/ssh_tunnel', {
            'child_process': {
                execSync: stub
            }
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    describe('should accept an options object', function () {
        it('should throw an error if options are missing', function () {
            expect(subject).to.throw();
        });

        it('should call exec with passed options', function () {
            subject({
                host: '127.0.0.1',
                hostPort: '8080'
            });
            expect(stub).to.have.been.calledWith('ps aux | grep -E "ssh.*?"8080:127.0.0.1:8080.*?127.0.0.1');
        });
    });

    describe('results', function () {
        it('should return true if a tunnel is found', function () {
            var res = subject({
                host: '127.0.0.1',
                hostPort: '8080'
            });
            expect(res).to.be.true;
        });

        it('should return false if no tunnel is found', function () {
            stub = sinon.stub().returns("");

            subject = mockuire('../lib/ssh_tunnel', {
                'child_process': {
                    execSync: stub
                }
            });
            var res = subject({
                host: '127.0.0.1',
                hostPort: '8080'
            });
            expect(res).to.be.false;
        });
    });
});
