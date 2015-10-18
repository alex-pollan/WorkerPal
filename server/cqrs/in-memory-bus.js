var cqrs = require('./core');
var async = require('async');

var InMemoryBus = cqrs.Bus.extend(function (base) {
    return {
        init: function () {
            base.init.call(this);
            this.eventHandlerQueue = async.queue(function (task, callback) {
                console.log('Processing enqueued handler for event ' + task.event.eventName);
                
                task.handler(task.event, function (err) {
                    callback(err);
                });
            }, 1);
        },
        handleEvent: function (handler, event) {
            this.eventHandlerQueue.push({ handler: handler, event: event }, function (err) {
                if (err) {
                    console.error('Event ' + task.event.eventName + ' threw an error: ' + err);
                    return;
                }
                //TODO: keep track of last event processed to reprocess at restart aggregate's events in case of error? 
            });
        }
    };
});

module.exports = {
    Bus: InMemoryBus
};


