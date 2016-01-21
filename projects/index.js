/**
 * Created by Alex on 10/5/2015.
 */

var cqrs = require('../lib/cqrs');
var config = require('../config/config');
var inMemoryBus = require('../lib/cqrs-in-memory-bus');
var eventStoreNeDbRepository = require('../lib/cqrs-event-store-nedb-repository');
var projectDomain = require('./domain/domain');
var projectCommands = require('./domain/commands');
var projectDenormalizers = require('./readModels/denormalizers');
var projectsReadModelRepository = require('./readModels/repository')(config); 

module.exports = function(app) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, new eventStoreNeDbRepository.EventStoreRepository(config.nedb.eventsSource));
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));
    bus.registerHandlers(new projectDenormalizers.EventHandlers(projectsReadModelRepository));
    
    require('./api')(app, projectsReadModelRepository);
    require('./capi')(app, bus);
};
