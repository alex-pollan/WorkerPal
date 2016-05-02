module.exports = {
    CommandHandlers: require('./command-handlers'),
    Commands: {
        CreateProject: require('./create'),
        ChangeName: require('./change-name')
    }
};
