/**
 * Created by Alex on 10/5/2015.
 */

var cqrs = require('./cqrs');
var projectDomain = require('./projects/domain');
var projectCommands = require('./projects/commands');

module.exports = function() {
    var bus = new cqrs.Bus();
    var eventStore = new cqrs.EventStore(bus);
    var projectRepository = new cqrs.Repository(projectDomain.Project, eventStore);
    bus.registerHandlers(new projectCommands.CommandHandlers(projectRepository));

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

    console.log(bus);
    console.log(eventStore);
};