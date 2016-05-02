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


module.exports = ProjectCreated;
