var commands = require('./commands');

module.exports = function ProjectsCommandsApi(app, authorize, bus) {
    app.put('/api/cmd/projects', authorize, function (req, res, next) {
        bus.send(new commands.Commands.CreateProject(req.body.id, req.body.name, req.body.description, req.user.id), function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
            res.end();
            
            next();
        });
    });
    
    app.post('/api/cmd/projects/changename', authorize, function (req, res, next) {
        bus.send(new commands.Commands.ChangeName(req.body.id, req.body.name, req.body.expectedVersion), function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err.message);
                res.appErrorCode = err.message;
            }
            res.end();
            
            next();
        });
    });
};
