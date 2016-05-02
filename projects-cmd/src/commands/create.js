var CreateProject = function(id, name, description, userId) {
    if (!id) throw new Error('Id expected');

    this.id = id;
    this.name = name;
    this.description = description; 
    this.userId = userId;
};

CreateProject.prototype.commandName = 'CreateProject';

module.exports = CreateProject;
