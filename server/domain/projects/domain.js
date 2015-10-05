/**
 * Created by Alex on 9/27/2015.
 */

var cqrs = require('../cqrs');
var events = require('./events');

var Project = function() {
    this.id = '';
    this.name = '';
};

Project.inheritsFrom(cqrs.AggregateRoot);

Project.prototype.construct = function(id, name) {
    this.initialize();

    this.applyChange(new events.ProjectCreated(id, name));
};

Project.prototype.assignTo = function(userId) {
    this.applyChange(new events.ProjectAssigned(this.id, userId));
};

Project.prototype.applyProjectCreated = function(event) {
    this.id = event.id;
    this.name = event.name;
};

Project.prototype.applyProjectAssigned = function(event) {
    this.id = event.id;
    this.userId = event.userId;
};

module.exports = {
    Project: Project
};
