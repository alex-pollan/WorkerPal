var cqrs = require('../../cqrs');
var expect = require('chai').expect;
var assert = require('chai').assert;
var spy = require('sinon').spy;

describe("Aggregates repository", function () {
    it("should return AggregateNotFoundException error if aggregate doesnt exist", function (done) {
        //arrange
        var eventStoreRepository = {
            loadEventSource: function (aggregateId, callback) {
                callback(null, null);
            }
        };
        var eventStore = new cqrs.EventStore(null, eventStoreRepository);
                      
        var repository = new cqrs.Repository(function () {
            return {};
        }, eventStore);
        
        //act
        repository.getById('anyid', function (err, obj) {
            expect(err.message).to.be.equal('AggregateNotFoundException');
            done();
        });
    });

    it("should get aggregate by id if exists", function (done) {
        //arrange
        var aggregateEvents = [{ eventName: 'event1' }];
        var eventStore = {
            getEventsForAggregate: function (id, callback) {
                var events = aggregateEvents;
                callback(null, events);
            }
        };
        
        var aggregate = {
            loadsFromHistory: function() {}
        };
        
        spy(aggregate, 'loadsFromHistory');

        var repository = new cqrs.Repository(function () {
            return aggregate;
        }, eventStore);

        //act
        repository.getById('anyid', function (err, obj) { 
            assert(aggregate.loadsFromHistory.calledWith(aggregateEvents));
            done();
        });
    });

    //TODO: save
});