var Fiber = require('fiber');
var mongoose = require('mongoose');

var EventStoreMongoDbRepository = Fiber.extend(function (base) {
    return {
        init: function (db) {
            this.db = db;
        },       
        loadEventSource: function(aggregateId, callback) {
            this.db.findOne({ aggregateId: aggregateId }, function (err, doc) {
                if (err) {
                    console.error('EventStoreMongoDbRepository:loadEventSource. Error: ' + err);
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
                    console.error('EventStoreMongoDbRepository:createEventSource. Error: ' + err);
                };
                
                callback(err, eventsSource);
            });
        },
        addEvent: function (aggregateId, eventDescriptor, callback) {
            this.db.update({ aggregateId: aggregateId }, { $push: { eventDescriptors: eventDescriptor } }, {}, function (err, numReplaced, upsert) {
                if (err) {
                    console.error('EventStoreMongoDbRepository:createEventSource. Error: ' + err);
                };
                
                callback(err);
            });
        }
    };
});

module.exports = {
	EventStoreRepository: EventStoreMongoDbRepository
};
