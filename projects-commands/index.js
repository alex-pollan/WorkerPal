module.exports = {
    CommandHandlers: require('command-handlers'),
    Commands: {
        CreateProject: require('commands/create'),
        ChangeName: require('commands/change-name')
    }
};
