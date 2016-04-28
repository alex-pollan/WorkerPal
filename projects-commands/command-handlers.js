/**
 * Created by Alex on 10/5/2015.
 */

var domain = require('../../projects-domain');

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
            repository.getById(command.id, function (err, project) {
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

module.exports = CommandHandlers;
