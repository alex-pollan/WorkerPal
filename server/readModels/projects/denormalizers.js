/**
 * Created by Alex on 10/5/2015.
 */

var domain = require('./../../domain/projects/domain');
var q = require('q');

var EventHandlers = function (db) {
    return {
        handleProjectCreated: function (event, callback) {
            console.log('handleProjectCreated called...');
            
            db.update({ $and : [{ type: 'project', id: event.id }] }, 
            {
                type: 'project',
                id: event.id,
                name: event.name,
                description: event.description,
                userId: event.userId,
                created: event.timestamp,
                modified: event.timestamp,
                version: event.version
            }, 
            { upsert: true }, 
            function (err, numReplaced, upsert) {
                callback(err);
            });
        },
        handleProjectNameChanged: function (event, callback) {
            console.log('handleProjectNameChanged called...');
            
            db.update({ $and : [{ type: 'project', id: event.id }] }, 
            { $set: { name: event.name, modified: event.timestamp, version: event.version } }, 
            {}, 
            function (err, numReplaced, upsert) {
                callback(err);
            });
        }
    };
};

module.exports = {
    EventHandlers: EventHandlers
};
