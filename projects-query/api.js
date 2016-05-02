module.exports = function ProjectsApi(app, authorize, repository) {

    app.get('/api/query/projects/:projectId', authorize, function (req, res) {
        repository.get(req.params.projectId, req.user.id, function (err, doc) {
            if (err) {
                console.log('ProjectsApi: Error: ' + err);
                res.sendStatus(500);
                return;
            }
            
            res.send(doc);
        });   
    });
    
    app.get('/api/query/projects', authorize, function (req, res) {
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
