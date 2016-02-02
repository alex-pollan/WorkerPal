var cqrs = require('../lib/cqrs');
var inMemoryBus = require('../lib/cqrs-in-memory-bus');
var eventStoreMongoDbRepository = require('../lib/cqrs-event-store-mongodb-repository');
var projectDomain = require('./domain/domain');
var projectCommands = require('./domain/commands');
var projectDenormalizers = require('./readModels/denormalizers');

module.exports = function(app, db) {
    var projectsReadModelRepository = require('./readModels/repository-mongoDb')(db); 
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, new eventStoreMongoDbRepository.EventStoreRepository(db));
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));
    bus.registerHandlers(new projectDenormalizers.EventHandlers(projectsReadModelRepository));
    
    require('./api')(app, projectsReadModelRepository);
    require('./capi')(app, bus);
};
