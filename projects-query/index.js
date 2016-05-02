var projectDenormalizers = require('./readModels/denormalizers');

module.exports = function(app, authorize, db, bus) {
    var projectsReadModelRepository = require('./readModels/repository-mongoDb')(db); 
    bus.registerHandlers(new projectDenormalizers.EventHandlers(projectsReadModelRepository));
    
    require('./api')(app, authorize, projectsReadModelRepository);
};
