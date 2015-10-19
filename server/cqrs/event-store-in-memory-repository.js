var Fiber = require('fiber');

var EventStoreInMemoryRepository = Fiber.extend(function (base) {
    return {
        init: function () {
            this.current = [];
        },       
        loadEventSource: function (aggregateId, callback) {
            var eventSource = _.find(this.current, function (item) {
                return item.aggregateId === aggregateId;
            });
            callback(null, eventSource);
        },
        createEventSource: function (aggregateId, callback) {
            var eventsSource = {
                aggregateId: aggregateId,
                eventDescriptors: []
            };
            this.current.push(eventsSource);
            
            callback(null, eventsSource);
        },
        addEvent: function (aggregateId, eventDescriptor, callback) {
            this.loadEventSource(aggregateId, function (err, eventsSource) {
                eventsSource.eventDescriptors.push(eventDescriptor);
                callback(null);
            });
        }
    };
});

module.exports = {
    EventStoreRepository: EventStoreInMemoryRepository
};
