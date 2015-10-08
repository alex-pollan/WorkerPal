/**
 * Created by Alex on 10/5/2015.
 */

var domain = require('./domain');

var CreateProject = function(id, name, description, userId) {
    if (!id) throw new Error('Id expected');

    return {
        commandName: CreateProject.prototype.commandName,
        id: id,
        name: name,
        description: description, 
        userId: userId        
    };
};
CreateProject.prototype.commandName = 'ProjectCreated';



var CommandHandlers = function(repository) {
    return  {
        handleCreateProject: function(command) {
            var project = new domain.Project();
            project.construct(command.id, command.name, command.description, command.userId);
            repository.save(project, -1);
        },
        handleAssignProject: function(command) {
            var project = repository.getById(command.id);
            project.assignTo(command.userId);
            repository.save(project, command.expectedVersion);
            console.log('handleAssignProject called...');
        }
    };
};
module.exports = {
    CommandHandlers: CommandHandlers,
    Commands: {
        CreateProject
    }
};
