var cqrs = require('@tapmiapp/cqrs');
var inMemoryBus = require('@tapmiapp/cqrs-in-memory-bus');
var projectDomain = require('./src/domain');
var projectCommands = require('./src/commands');

module.exports = function(app, authorize, eventStoreRepository) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, eventStoreRepository);
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));

    require('./src/api')(app, authorize, bus);
    
    return bus;
};
