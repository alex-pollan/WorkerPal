var Fiber = require('fiber');

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

module.exports = ProjectNameChanged;
