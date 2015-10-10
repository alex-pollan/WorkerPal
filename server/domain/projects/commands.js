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
CreateProject.prototype.commandName = 'CreateProject';

var ChangeName = function (id, name, expectedVersion) {
    if (!id) throw new Error('Id expected');
    
    return {
        commandName: ChangeName.prototype.commandName,
        id: id,
        name: name,
        expectedVersion: expectedVersion
    };
};
ChangeName.prototype.commandName = 'ProjectChangeName';

var CommandHandlers = function(repository) {
    return  {
        handleCreateProject: function(command, callback) {
            var project = new domain.Project();
            project.construct(command.id, command.name, command.description, command.userId);
            repository.save(project, -1, function (err) { 
                callback(err);
            });
        },
        handleProjectChangeName: function (command, callback) {
            console.log('handleProjectChangeName called...');
            var project = repository.getById(command.id, function (err, project) {
                if (err) {
                    callback(err);
                    return;
                }
                project.changeName(command.name);
                repository.save(project, command.expectedVersion, function (err) {
                    callback(err);
                });
            });
        }
    };
};
module.exports = {
    CommandHandlers: CommandHandlers,
    Commands: {
        CreateProject: CreateProject,
        ChangeName: ChangeName
    }
};
