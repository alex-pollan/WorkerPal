var authorize = require('../authorize');
var Datastore = require('nedb');

module.exports = function ProjectsApi(app, readModelDb) {
    //TODO: abstract the data access with a repository pattern

    app.get('/api/projects/:projectId', authorize, function (req, res) {
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
};