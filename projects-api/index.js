var cqrs = require('../lib/cqrs');
var inMemoryBus = require('../lib/cqrs-in-memory-bus');
var projectDomain = require('../projects-domain');
var projectCommands = require('../projects-commands');

module.exports = function(app, authorize, eventStoreRepository) {
    var bus = new inMemoryBus.Bus();
	var eventStore = new cqrs.EventStore(bus, eventStoreRepository);
    var projectRepository = new cqrs.Repository(function () { return new projectDomain.Project(); }, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));

    require('./api')(app, authorize, bus);
    
    return bus;
};
