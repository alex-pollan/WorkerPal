
var cqrs = require('./core');
var config = require('../config/config');
var Datastore = require('nedb');

var NedbEventStore = function (eventPublisher) {
	this.publisher = eventPublisher;
};

cqrs.EventStore.prototype.setup = function () {
	this.db = new Datastore({ filename: config.nedb.path, autoload: true });
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
//	//TODO: db
//	return eventsSource;
//};

//NedbEventStore.prototype.addEvent = function (aggregateId, eventDescriptor) {
//	//TODO: db
//	//eventsSource.eventDescriptors.push(eventDescriptor);
//};

module.exports = {
	EventStore: NedbEventStore
};
