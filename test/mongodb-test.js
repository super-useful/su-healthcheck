var mocha  = require('mocha');
var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require("sinon-chai");
var mockuire = require("mockuire")(module);
var co  = require('co');
var expect = chai.expect;
chai.use(sinonChai);

describe('mongodb check', function(){
    var subject, clientStub;

    beforeEach(function () {
        clientStub = {
            connect: sinon.spy(function* () {
                return {
                    collections: function* () {
                        return [{
                            _collection: {collectionName: 'nameOfCollection'}
                        }];
                    },
                    close: function* () { return }
                };
            })
        };

        subject = mockuire('../lib/mongodb', {
            'co-mongo': clientStub
        });
    });

    it('should export a function', function () {
        expect(subject).to.be.a('function');
    });

    describe('should accept an options object', function () {
        it('should call connect with defaults', co(function* () {
            yield subject();
            expect(clientStub.connect).to.have.been.calledWith('mongodb://127.0.0.1:27017');
        }));

        it('should call connect with passed host, port and db options', co(function* () {
            yield subject({
                host: 'notlocal',
                user: 'test',
                db: 'testdb'
            });
            expect(clientStub.connect).to.have.been.calledWith('mongodb://notlocal:27017/testdb');
        }));
    });

    describe('results', function () {
        it('should return true if no db is supplied', co(function* () {
            var res = yield subject();
            expect(res).to.be.true;
        }));

        it('should return false if db is supplied but no collections are found', co(function* () {
            subject = mockuire('../lib/mongodb', {
                'co-mongo': {
                    connect: function* () {
                        return {
                            collections: function* () {
                                return [];
                            },
                            close: function* () { return }
                        };
                    }
                }
            });

            var res = yield subject({db: 'testdb'});
            expect(res).to.be.false;
        }));


        it('should return a list of collections if db is supplied', co(function* () {
            var res = yield subject({db: 'testdb'});
            expect(res).to.deep.equal(['nameOfCollection']);
        }));

        it('should return an error object when an execption is thrown', co(function* () {
            subject = mockuire('../lib/mongodb', {
                'co-mongo': {
                    connect: function* () {
                        throw new Error('A bad thing happened');
                    }
                }
            });

            var res = yield subject();
            expect(res).to.be.an.instanceof(Error);
        }));
    });
});
