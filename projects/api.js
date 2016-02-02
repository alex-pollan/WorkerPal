var authorize = require('../authorize');

module.exports = function ProjectsApi(app, repository) {

    app.get('/api/projects/:projectId', authorize, function (req, res) {
        repository.get(req.params.projectId, req.user.id, function (err, doc) {
            if (err) {
                console.log('ProjectsApi: Error: ' + err);
                res.sendStatus(500);
                return;
            }
            
            res.send(doc);
        });   
    });
    
    app.get('/api/projects', authorize, function (req, res) {
        repository.query({ userId: req.user.id }, function (err, docs) {
            if (err) {
                console.log('ProjectsApi: Error: ' + err);
                res.sendStatus(500);
                return;
            }
            
            res.send(docs);
        });        
    });
};