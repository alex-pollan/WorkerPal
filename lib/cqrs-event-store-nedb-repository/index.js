var Fiber = require('fiber');
var Datastore = require('nedb');

var EventStoreNedbRepository = Fiber.extend(function (base) {
    return {
        init: function (dbPath) {
            this.db = new Datastore({ filename: dbPath, autoload: true });
        },       
        loadEventSource: function(aggregateId, callback) {
            this.db.findOne({ aggregateId: aggregateId }, function (err, doc) {
                if (err) {
                    console.error('NedbEventStore:loadEventSource. Error: ' + err);
                };
  
                callback(err, doc);
            });
        },
        createEventSource: function (aggregateId, callback) {
            var eventsSource = {
        		aggregateId: aggregateId,
        		eventDescriptors: []
            };

            this.db.insert(eventsSource, function (err, newDoc) {
                if (err) {
                    console.error('NedbEventStore:createEventSource. Error: ' + err);
                };
                
                callback(err, eventsSource);
            });
        },
        addEvent: function (aggregateId, eventDescriptor, callback) {
            this.db.update({ aggregateId: aggregateId }, { $push: { eventDescriptors: eventDescriptor } }, {}, function (err, numReplaced, upsert) {
                if (err) {
                    console.error('NedbEventStore:createEventSource. Error: ' + err);
                };
                
                callback(err);
            });
        }
    };
});

module.exports = {
	EventStoreRepository: EventStoreNedbRepository
};
