/**
 * Created by Alex on 10/5/2015.
 */

var cqrs = require('./cqrs/core');
var config = require('./config/config');
var inMemoryBus = require('./cqrs/in-memory-bus.js');
var nedbEventStore = require('./cqrs/nedb-event-store');
var projectDomain = require('./domain/projects/domain');
var projectCommands = require('./domain/projects/commands');
var projectDenormalizers = require('./readModels/projects/denormalizers');

module.exports = function(readModelDb) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new nedbEventStore.EventStore(bus);
    var projectRepository = new cqrs.Repository(projectDomain.Project, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));
    bus.registerHandlers(new projectDenormalizers.EventHandlers(readModelDb));
    
    eventStore.loadDb(config.nedb.eventsSource);
    
    return {
        bus: bus
    };
};