/**
 * Created by Alex on 9/27/2015.
 */

var cqrs = require('../cqrs');

var Project = function() {
    this.id = '';
    this.name = '';
};

Project.inheritsFrom(cqrs.AggregateRoot);

Project.prototype.construct = function(id, name) {
    this.initialize();

    this.applyChange({
        eventName: 'ProjectCreated',
        id: id,
        name: name
    });
};

Project.prototype.assignTo = function(userId) {
    this.applyChange({
        eventName: 'ProjectAssigned',
        id: this.id,
        userId: userId
    });
};

Project.prototype.applyProjectCreated = function(evnt) {
    this.id = evnt.id;
    this.name = evnt.name;
};

Project.prototype.applyProjectAssigned = function(evnt) {
    this.id = evnt.id;
    this.userId = evnt.userId;
};

module.exports = {
    Project: Project
};
