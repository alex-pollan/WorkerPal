/**
 * Created by Alex on 10/5/2015.
 */

var ProjectCreated = function(id, name) {
    return {
        eventName: ProjectCreated.prototype.eventName,
        id: id,
        name: name
    };
};

ProjectCreated.prototype.eventName = 'ProjectCreated';

var ProjectAssigned = function(id, userId) {
    return {
        eventName: ProjectAssigned.prototype.eventName,
        id: id,
        userId: userId
    };
};

ProjectAssigned.prototype.eventName = 'ProjectAssigned';

module.exports = {
    ProjectCreated: ProjectCreated,
    ProjectAssigned: ProjectAssigned
};