/**
 * Created by Alex on 10/5/2015.
 */
var EventHandlers = function (repository) {
    return {
        handleProjectCreated: function (event, callback) {
            console.log('handleProjectCreated called...');
            
            repository.upsert(event.id, {
                id: event.id,
                name: event.name,
                description: event.description,
                userId: event.userId,
                created: event.timestamp,
                modified: event.timestamp,
                version: event.version
            }, 
            function (err) {
                callback(err);
            });            
        },
        handleProjectNameChanged: function (event, callback) {
            console.log('handleProjectNameChanged called...');
            
            repository.update(event.id, {
                name: event.name,
                modified: event.timestamp, 
                version: event.version
            }, 
            function (err) {
                callback(err);
            });
        }
    };
};

module.exports = {
    EventHandlers: EventHandlers
};
