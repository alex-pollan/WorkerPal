var cqrs = require('../lib/cqrs');
var inMemoryBus = require('../lib/cqrs-in-memory-bus');
var projectDomain = require('./domain/domain');
var projectCommands = require('./domain/commands');

module.exports = function(app, authorize, eventStoreRepository) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, eventStoreRepository);
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));

    require('./capi')(app, authorize, bus);
    
    return bus;
};
