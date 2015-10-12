
var cqrs = require('./core');
var Datastore = require('nedb');

var NedbEventStore = cqrs.EventStore.extend(function (base) {
    return {
        init: function (eventPublisher) {
            base.init.call(this);
            this.publisher = eventPublisher;
        },
        loadDb : function (dbPath) {
            this.db = new Datastore({ filename: dbPath, autoload: true });
        },
        loadEventSource: function(aggregateId, callback) {
            this.db.findOne({ aggregateId: aggregateId }, function (err, doc) {
                if (err) {
                    console.log('NedbEventStore:loadEventSource. Error: ' + err);
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
                    console.log('NedbEventStore:createEventSource. Error: ' + err);
                };
                
                callback(err, eventsSource);
            });
        },
        addEvent: function (aggregateId, eventDescriptor, callback) {
            this.db.update({ aggregateId: aggregateId }, { $push: { eventDescriptors: eventDescriptor } }, {}, function (err, numReplaced, upsert) {
                if (err) {
                    console.log('NedbEventStore:createEventSource. Error: ' + err);
                };
                
                callback(err);
            });
        }
    };
});

module.exports = {
	EventStore: NedbEventStore
};
