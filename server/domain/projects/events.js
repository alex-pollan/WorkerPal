/**
 * Created by Alex on 10/5/2015.
 */

var Fiber = require('fiber');

var ProjectCreated = Fiber.extend(function () {
    return {
        init: function (id, name, description, userId, timestamp) {            
            this.eventName = ProjectCreated.prototype.eventName;
            this.id = id;
            this.name = name;
            this.description = description;
            this.userId = userId;
            this.timestamp = timestamp;
        }
    };
});
ProjectCreated.prototype.eventName = 'ProjectCreated';

var ProjectNameChanged = Fiber.extend(function () {
    return {
        init: function (id, name, timestamp) {
            this.eventName = ProjectNameChanged.prototype.eventName;
            this.id = id;
            this.name = name;
            this.timestamp = timestamp;
        }
    };
});
ProjectNameChanged.prototype.eventName = 'ProjectNameChanged';

module.exports = {
    ProjectCreated: ProjectCreated,
    ProjectNameChanged: ProjectNameChanged
};