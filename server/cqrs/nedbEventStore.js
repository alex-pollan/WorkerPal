
var cqrs = require('./core');
var Datastore = require('nedb');

var NedbEventStore = function (eventPublisher) {
	this.publisher = eventPublisher;
	this.lastDbPath = '';
};

//TODO: segment database per users?
cqrs.EventStore.prototype.loadDb = function (dbPath) {
	if (dbPath !== this.lastDbPath) {
		console.log('NedbEventStore:: Loading DB "' + dbPath + '"...');
		this.db = new Datastore({ filename: dbPath, autoload: true });
	}
};

NedbEventStore.inheritsFrom(cqrs.EventStore);

//NedbEventStore.prototype.loadEventSource = function (aggregateId) {
//	//TODO: db
//};

//NedbEventStore.prototype.createEventSource = function (aggregateId) {
//	var eventsSource = {
//		aggregateId: aggregateId,
//		eventDescriptors: []
//	};
    
    

//	return eventsSource;
//};

//NedbEventStore.prototype.addEvent = function (aggregateId, eventDescriptor) {
//	//TODO: db
//	//eventsSource.eventDescriptors.push(eventDescriptor);
//};

module.exports = {
	EventStore: NedbEventStore
};
