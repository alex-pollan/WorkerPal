var authorize = require('../authorize');
var commands = require('../domain/projects/commands');

module.exports = function ProjectsApi(app, bus) {

    app.get('/api/projects', authorize, function(req, res) {
        res.send([
			{id: '1', name: 'Project 1', description: 'Description for the project 1'},
			{id: '2', name: 'Project 2', description: 'Description for the project 2'}
		]);
    });
	
    app.put('/api/projects', authorize, function(req, res) {
		bus.send(new commands.Commands.CreateProject(req.body.id, req.body.name, req.body.description, req.user.id));
        res.end();
    });

    app.post('/api/projects/changename', authorize, function (req, res) {
        bus.send(new commands.Commands.ChangeName(req.body.id, req.body.name, req.body.expectedVersion));
        res.end();
    });
};