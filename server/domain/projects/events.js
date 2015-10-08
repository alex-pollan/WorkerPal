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

var ProjectAssigned = function(id, memberId, timestamp) {
    return {
        eventName: ProjectAssigned.prototype.eventName,
        id: id,
        memberId: memberId,
        timestamp: timestamp
    };
};
ProjectAssigned.prototype.eventName = 'ProjectAssigned';

module.exports = {
    ProjectCreated: ProjectCreated,
    ProjectAssigned: ProjectAssigned
};