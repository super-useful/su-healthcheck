var mocha  = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var co  = require('co');
var expect = chai.expect;
chai.use(sinonChai);

describe('postgres check', function(){
    var subject, clientStub;

    beforeEach(function () {
        clientStub = sinon.stub().returns({
            connect_: function* () {return},
            query_: function* () {
                return {rows: [
                    {type: 'function', name: 'fn1'},
                    {type: 'function', name: 'fn2'},
                    {type: 'base tables', name: 'tbl1'}
                ]};
            },
            end: sinon.stub()
        });

        subject = mockuire('../lib/postgres', {
            'pg': {},
            'co-pg': function () {
                return {
                    Client: clientStub
                }
            }
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    describe('should accept an options object', function () {
        it('should call Client with defaults', co(function* () {
            yield subject();
            expect(clientStub).to.have.been.calledWith('postgres://postgres@127.0.0.1:5432/postgres');
        }));

        it('should call Client with passed host, port, user and db options', co(function* () {
            yield subject({
                host: 'notlocal',
                user: 'test',
                port: 1,
                db: 'testdb'
            });
            expect(clientStub).to.have.been.calledWith('postgres://test@notlocal:1/testdb');
        }));

    });

    describe('results', function () {
        it('should return a list of tables and functions', co(function* () {
            var res = yield subject();
            expect(res).to.deep.equal({'function': ['fn1', 'fn2'], 'base tables': ['tbl1']});
        }));

        it('should return an error object when an execption is thrown', co(function* () {
            subject = mockuire('../lib/postgres', {
                'pg': {},
                'co-pg': function () {
                    return {
                        Client: function () {
                            throw new Error('A bad thing happened');
                        }
                    }
                }
            });

            var res = yield subject();
            expect(res).to.be.an.instanceof(Error);
        }));
    });
});
