/**
 * Created by Alex on 9/27/2015.
 */

var cqrs = require('../../cqrs/core');
var events = require('./events');

var Project = function() {
    this.id = '';
    this.name = '';
    this.description = '';
    this.userId = '';
};

Project.inheritsFrom(cqrs.AggregateRoot);

Project.prototype.construct = function(id, name, description, userId) {
    if (!id) throw new Error('Id expected');
    if (!name) throw new Error('Name expected');
    if (!userId) throw new Error('UserId expected');
    
    this.initialize();

    this.applyChange(new events.ProjectCreated(id, name, description, userId, clock.getDate()));
};

Project.prototype.assignTo = function(memberId) {
    this.applyChange(new events.ProjectAssigned(this.id, memberId, clock.getDate()));
};

Project.prototype.applyProjectCreated = function(event) {
    this.id = event.id;
    this.name = event.name;
    this.description = event.description;
    this.userId = event.userId;
};

Project.prototype.applyProjectAssigned = function(event) {
    this.id = event.id;
    this.memberId = event.memberId;
};

module.exports = {
    Project: Project
};
