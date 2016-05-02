var ChangeName = function (id, name, expectedVersion) {
    if (!id) throw new Error('Id expected');
    
    this.id = id;
    this.name = name;
    this.expectedVersion = expectedVersion;
};

ChangeName.prototype.commandName = 'ProjectChangeName';

module.exports = ChangeName;
