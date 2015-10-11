
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
        }
    };
});

//NedbEventStore.prototype.loadEventSource = function (aggregateId, callback) {
//    this.db.findOne({ aggregateId: aggregateId }, function (err, doc) {
//        if (err) console.log(err);
  
//        //i (doc) { }
//    });

//};

//NedbEventStore.prototype.createEventSource = function (aggregateId, callback) {
//	var eventsSource = {
//		aggregateId: aggregateId,
//		eventDescriptors: []
//	};
    
    

//	return eventsSource;
//};

//NedbEventStore.prototype.addEvent = function (aggregateId, eventDescriptor, callback) {
//	//TODO: db
//	//eventsSource.eventDescriptors.push(eventDescriptor);
//};

module.exports = {
	EventStore: NedbEventStore
};
