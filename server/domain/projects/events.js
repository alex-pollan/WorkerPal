/**
 * Created by Alex on 10/5/2015.
 */

var ProjectCreated = function(id, name, description, userId, timestamp) {
    return {
        eventName: ProjectCreated.prototype.eventName,
        id: id,
        name: name,
        description: description, 
        userId: userId,
        timestamp: timestamp
    };
};
ProjectCreated.prototype.eventName = 'ProjectCreated';

var ProjectNameChanged = function(id, name, timestamp) {
    return {
        eventName: ProjectNameChanged.prototype.eventName,
        id: id,
        name: name,
        timestamp: timestamp
    };
};
ProjectNameChanged.prototype.eventName = 'ProjectNameChanged';

module.exports = {
    ProjectCreated: ProjectCreated,
    ProjectNameChanged: ProjectNameChanged
};