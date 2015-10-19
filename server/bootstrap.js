/**
 * Created by Alex on 10/5/2015.
 */

var cqrs = require('./cqrs/core');
var config = require('./config/config');
var inMemoryBus = require('./cqrs/in-memory-bus.js');
var eventStoreNeDbRepository = require('./cqrs/event-store-nedb-repository');
var projectDomain = require('./domain/projects/domain');
var projectCommands = require('./domain/projects/commands');
var projectDenormalizers = require('./readModels/projects/denormalizers');

module.exports = function(readModelDb) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, new eventStoreNeDbRepository.EventStoreRepository(config.nedb.eventsSource));
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));
    bus.registerHandlers(new projectDenormalizers.EventHandlers(readModelDb));
    
    return {
        bus: bus
    };
};