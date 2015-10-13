/**
 * Created by Alex on 9/27/2015.
 */

var _ = require('lodash');
var async = require('async');
var Fiber = require('fiber');

var Clock = Fiber.extend(function () {
    return {
        getDate: function () {
            return new Date().getUTCDate();
        }
    };
});

//region Bus

var Bus = Fiber.extend(function () {
    return {
        init: function () {
            this._handlePrefix = 'handle';
            this._routes = [];
        },
        registerHandlers: function (handlers) {
            var _this = this;
            
            var _getMessageName = function (fnName) {
                return fnName.substr(_this._handlePrefix.length);
            };
            
            var _addMessageHandler = function (messageName, fn) {
                var route = _getRoute(messageName);
                route.handlers.push(fn);
            };
            
            var _getRoute = function (messageName) {
                var entry = _.find(_this._routes, function (item) {
                    return item.messageName === messageName;
                });
                
                if (!entry) {
                    entry = {
                        messageName: messageName,
                        handlers: []
                    };
                    _this._routes.push(entry);
                }
                
                return entry;
            };
            
            for (var member in handlers) {
                if (handlers.hasOwnProperty(member)) {
                    if (_.isFunction(handlers[member]) && _.startsWith(member, _this._handlePrefix)) {
                        console.log('Found the handler: ' + member);
                        _addMessageHandler(_getMessageName(member), handlers[member]);
                    }
                }
            }
        },
        send: function (command, callback) {
            var _this = this;
            
            if (!command) {
                throw new Error('Command expected');
            }
            
            callback = callback || function () { };
            
            var route = _.find(_this._routes, function (route) {
                return route.messageName === command.commandName;
            });
            
            if (!route)
                throw new Error('no handler registered');
            
            if (route.handlers.length != 1)
                throw new Error('cannot send to more than one handler');
            
            route.handlers[0](command, callback);
        },
        handleEvent: function (handler, evnt) {
            throw new Error('Not implemented');
        },
        publish : function (evnt, callback) {
            var _this = this;
            
            if (!evnt) {
                throw new Error('Event expected');
            }
            
            var route = _.find(_this._routes, function (route) {
                return route.messageName === evnt.eventName;
            });
            
            if (route) {
                for (var i = 0; l = route.handlers.length, i < l; i++) {
                    _this.handleEvent(route.handlers[i], evnt);
                }
            }
            
            callback(null);
        },

    };
});

var InMemoryBus = Bus.extend(function (base) {
    return {
        init: function () {
            base.init.call(this);
            this.eventHandlersQueue = new EventHandlersQueue();
            this.eventHandlersQueue.start();
        },
        handleEvent: function (handler, event) {
            this.eventHandlersQueue.enqueue(handler, event);
        }
    };
});

//endregion

//region EventHandlersQueue
//REFACTOR: use 'async' module instead
var EventHandlersQueue = Fiber.extend(function () {
    return {
        init: function () {
            this.queue = [];
            this.started = false;
            this.interval = 500;
        },
        enqueue: function (handler, event) {
            this.queue.push({ handler : handler, event : event });
        },
        start: function () {
            var _this = this;
            
            if (this.started) return;
            
            this.processNext();
            
            this.started = true;
        },
        process : function () {
            var _this = this;
            
            if (this.queue.length == 0) {
                this.processNext();
                return;
            }
            
            var handlerEntry = this.queue[0];
            try {
                handlerEntry.handler(handlerEntry.event, function (err) {
                    if (err) {
                        console.error('Event ' + handlerEntry.event.eventName + ' threw an error: ' + err);
                        //TODO: should stop?
                    }
                    
                    //TODO: keep track of last event processed?
                    _.pullAt(_this.queue, 0);
                    _this.processNext();
                });
            }
            catch (err) {
                console.error('Event ' + handlerEntry.event.eventName + ' could not be processed: ' + err);
            }
        },
        processNext : function () {
            var _this = this;
            
            setTimeout(function () {
                _this.process();
            }, this.interval);
        }
    };
});

//endregion

//region AggregateRoot

var AggregateRoot = Fiber.extend(function () {
    return {
        init: function () {
            this.clock = new Clock();
            this._changes = [];
            this.id = '';
        },
        _applyChange : function (evnt, isNew) {
            // push atomic aggregate changes to local history for further processing (EventStore.SaveEvents)
            this['apply' + evnt.eventName](evnt);
            if (isNew) this._changes.push(evnt);
        }, getUncommittedChanges: function () {
            return this._changes;
        },
        markChangesAsCommitted: function () {
            this._changes = [];
        },
        loadsFromHistory : function (history) {
            var _this = this;
            _.each(history, function (item) {
                _this._applyChange(item, false);
            });
        },
        applyChange: function (evnt) {
            this._applyChange(evnt, true);
        }
    }; 
});

//endregion

//region Event Store

var EventStore = Fiber.extend(function () {
    return {
        init: function (eventPublisher) {
            this.publisher = eventPublisher;
            this.current = [];
        },
        setup: function () { },
        //overridable
        loadEventSource: function (aggregateId, callback) {
            var eventSource = _.find(this.current, function (item) {
                return item.aggregateId === aggregateId;
            });
            callback(null, eventSource);
        },
        //overridable
        createEventSource: function (aggregateId, callback) {
            var eventsSource = {
                aggregateId: aggregateId,
                eventDescriptors: []
            };
            this.current.push(eventsSource);
            
            callback(null, eventsSource);
        },
        //overridable
        addEvent: function (aggregateId, eventDescriptor, callback) {
            this.loadEventSource(aggregateId, function (err, eventsSource) {
                eventsSource.eventDescriptors.push(eventDescriptor);
                callback(null);
            });
        },
        saveEvents : function (aggregateId, events, expectedVersion, saveEventsCallback) {
            var _this = this;
            
            var loadEventSource = function (processEventsCallback) {
                _this.loadEventSource(aggregateId, function (err, eventsSource) {
                    if (!eventsSource) {
                        _this.createEventSource(aggregateId, function (err, eventsSource) {
                            processEventsCallback(err, eventsSource);
                        });
                    }
            // check whether latest event version matches current aggregate version
            // otherwise -> throw exception
                    else if (eventsSource.eventDescriptors[eventsSource.eventDescriptors.length - 1].version != expectedVersion 
                        && expectedVersion != -1) {
                        processEventsCallback(new Error('ConcurrencyException'), null);
                    }
                    else {
                        processEventsCallback(null, eventsSource);
                    }
                });
            };
            
            var processEvents = function (eventsSource, finishCallback) {
                var version = expectedVersion;
                var i = 0;
                
                // iterate through current aggregate events increasing version with each processed event
                async.whilst(
                    function () {
                        return i < events.length;
                    },
                    function (whilstCallback) {
                        var event = events[i];
                        i++;
                        
                        version++;
                        event.version = version;
                        
                        // push event to the event descriptors list for current aggregate
                        _this.addEvent(aggregateId, {
                            aggregateId: aggregateId,
                            eventData: event,
                            version: version
                        }, function (err) {
                            // publish current event to the bus for further processing by subscribers
                            _this.publisher.publish(event, function (err) {
                                whilstCallback(err);
                            });
                        });
                    },
                    function (err) {
                        finishCallback(err);
                    }
                );
            };
            
            async.waterfall([
                loadEventSource,
                processEvents
            ],
            function (err, result) {
                if (err) {
                    console.log(err);
                }
                saveEventsCallback(err);
            });
            
            //// try to get event descriptors list for given aggregate id
            //// otherwise -> create empty dictionary
            //var eventsSource = this.loadEventSource(aggregateId);

            //if (!eventsSource) {
            //    eventsSource = this.createEventSource(aggregateId);
            //}
            //// check whether latest event version matches current aggregate version
            //// otherwise -> throw exception
            //else if (eventsSource.eventDescriptors[eventsSource.eventDescriptors.length - 1].version != expectedVersion
            //        && expectedVersion != -1) {
            //    throw new Error('ConcurrencyException');
            //}

            //var i = expectedVersion;

            //// iterate through current aggregate events increasing version with each processed event
            //_.each(events, function(event) {
            //    i++;
            //    event.version = i;

            //    // push event to the event descriptors list for current aggregate
            //    _this.addEvent(aggregateId, {
            //        aggregateId: aggregateId,
            //        eventData: event,
            //        version: i
            //    });

            //    // publish current event to the bus for further processing by subscribers
            //    _this.publisher.publish(event);
            //});
        },
        getEventsForAggregate: function (aggregateId, callback) {
            this.loadEventSource(aggregateId, function (err, eventSource) {
                if (!eventSource) {
                    callback(new Error('AggregateNotFoundException'), null);
                }
                
                callback(null, _.map(eventSource.eventDescriptors, function (item) {
                    return item.eventData;
                }));
            });
        }
    };
});

//endregion

//region Repository

var Repository = Fiber.extend(function () {
    return {
        init: function (constructorFunction, eventStore) {
            this.constructorFunction = constructorFunction;
            this.storage = eventStore;
        },
        save : function (aggregate, expectedVersion, callback) {
            callback = callback || function () { };
            this.storage.saveEvents(aggregate.id, aggregate.getUncommittedChanges(), expectedVersion, function (err) {
                callback(err);
            });
        },
        getById: function (id, callback) {
            var obj = new this.constructorFunction;
            this.storage.getEventsForAggregate(id, function (err, e) {
                if (err) {
                    callback(err, null);
                }
                
                obj.loadsFromHistory(e);
                
                callback(null, obj);
            });
        }
    };
});

//endregion

module.exports = {
    Bus: InMemoryBus,
    EventStore: EventStore,
    Repository: Repository,
    AggregateRoot: AggregateRoot,
    Clock: Clock
};


