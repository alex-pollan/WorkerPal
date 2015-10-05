/**
 * Created by Alex on 10/5/2015.
 */

var cqrs = require('./cqrs');
var projectDomain = require('./projects/domain');
var projectCommands = require('./projects/commands');
var projectDenormalizers = require('./../readModels/projects/denormalizers');

module.exports = function() {
    var bus = new cqrs.Bus();
    var eventStore = new cqrs.EventStore(bus);
    var projectRepository = new cqrs.Repository(projectDomain.Project, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));
    bus.registerHandlers(new projectDenormalizers.EventHandlers());

    bus.send({
        commandName: 'CreateProject',
        id: 'guid1',
        name: 'Project 1'
    });

    bus.send({
        commandName: 'AssignProject',
        id: 'guid1',
        userId: 'userId1',
        expectedVersion: 0
    });
};