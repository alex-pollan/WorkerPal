var cqrs = require('../../../lib/cqrs');
var events = require('../events');

var Project = cqrs.AggregateRoot.extend(function (base) {
    return {       
        construct: function (id, name, description, userId) {               
            if (!id) throw new Error('Id expected');
            if (!name) throw new Error('Name expected');
            if (!userId) throw new Error('UserId expected');
            
            this.applyChange(new events.ProjectCreated(id, name, description, userId, this.clock.getDate()));
        },
        changeName : function (name) {
            if (!name) throw new Error('Name expected');
            this.applyChange(new events.ProjectNameChanged(this.id, name, this.clock.getDate()));
        },
        applyProjectCreated : function (event) {
            this.id = event.id;
            this.name = event.name;
            this.description = event.description;
            this.userId = event.userId;
        },
        applyProjectNameChanged: function (event) {
            this.id = event.id;
            this.name = event.name;
        }
    };
});

module.exports = Project;
