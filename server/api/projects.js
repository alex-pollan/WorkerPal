var authorize = require('../authorize');
var commands = require('../domain/projects/commands');
var Datastore = require('nedb');

module.exports = function ProjectsApi(app, bus, readModelDb) {
    //TODO: abstract the data access with a repository pattern

    app.get('/api/projects/:projectId', function (req, res) {
        readModelDb.findOne({ $and : [{ type: 'project', userId: req.user.id, id: req.params.projectId }] }, function (err, doc) {
            if (err) {
                console.log('ProjectsApi: Error: ' + err);
                res.sendStatus(500);
                return;
            };
            
            res.send(doc);
        });   
    });
    
    app.get('/api/projects', authorize, function (req, res) {
        readModelDb.find({ $and : [{ type: 'project', userId: req.user.id }] }, function (err, docs) {
            if (err) {
                console.log('ProjectsApi: Error: ' + err);
                res.sendStatus(500);
                return;
            };
            
            res.send(docs);
        });        
    });
	
    app.put('/api/projects', authorize, function(req, res, next) {
        bus.send(new commands.Commands.CreateProject(req.body.id, req.body.name, req.body.description, req.user.id), function (err) {
            if (err) {
                console.error(err);
                res.status(500).send(err.message);
            }
            res.end();

            next();
        });
    });

    app.post('/api/projects/changename', authorize, function (req, res, next) {
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