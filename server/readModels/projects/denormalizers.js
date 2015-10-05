/**
 * Created by Alex on 10/5/2015.
 */

var domain = require('./../../domain/projects/domain');
var q = require('q');

var EventHandlers = function() {
    return  {
        handleProjectCreated: function(event) {
            console.log('handleProjectCreated called...');
            return q.delay(50);
        },
        handleProjectAssigned: function(event) {
            console.log('handleProjectAssigned called...');
            return q.delay(50);
        }
    };
};
module.exports = {
    EventHandlers: EventHandlers
};
