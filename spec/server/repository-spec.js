var cqrs = require('../../server/cqrs/core');

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
            expect(err.message).toEqual('AggregateNotFoundException');
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
        
        var aggregate = jasmine.createSpyObj('aggregate', ['loadsFromHistory']);

        var repository = new cqrs.Repository(function () {
            return aggregate;
        }, eventStore);

        //act
        repository.getById('anyid', function (err, obj) { 
            expect(aggregate.loadsFromHistory).toHaveBeenCalledWith(aggregateEvents);
            done();
        });
    });

    //TODO: save
});