/**
 * Created by Alex on 10/5/2015.
 */

var domain = require('./domain');

var CommandHandlers = function(repository) {
    return  {
        //Commands
        handleCreateProject: function(command) {
            var project = new domain.Project();
            project.construct(command.id, command.name);
            repository.save(project, -1);
        },
        handleAssignProject: function(command) {
            var project = repository.getById(command.id);
            project.assignTo(command.userId);
            repository.save(project, command.expectedVersion);
            console.log('handleAssignProject called...');
        },
        //Events
        handleProjectCreated: function(evnt) {
            console.log('handleProjectCreated called...');
        },
        handleProjectAssigned: function(evnt) {
            console.log('handleProjectAssigned called...');
        }
    };
};
module.exports = {
    CommandHandlers: CommandHandlers
};