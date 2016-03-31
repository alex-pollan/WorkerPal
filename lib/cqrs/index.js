/**
 * Created by Alex on 9/27/2015.
 */

var _ = require('lodash');
var async = require('async');
var Fiber = require('fiber');

var Clock = Fiber.extend(function () {
    return {
        getDate: function () {
            return new Date();
        }
    };
});

//region Bus

var Bus = Fiber.extend(function () {
    return {
        init: function () {
            this._handlePrefix = 'handle';
            this._routes = [];
            this.commandHandlerQueue = async.queue(function (task, callback) {
                task.handler(function (err) {
                    callback(err);
                });                
            }, 1);
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
                        _addMessageHandler(_getMessageName(member), handlers[member]);
                    }
                }
            }
        },
        send: function (command, commandHandledCallback) {
            var _this = this;
            
            if (!command) {
                throw new Error('Command expected');
            }
            
            commandHandledCallback = commandHandledCallback || function () { };
            
            var route = _.find(_this._routes, function (route) {
                return route.messageName === command.commandName;
            });
            
            if (!route)
                throw new Error('no handler registered');
            
            if (route.handlers.length != 1)
                throw new Error('cannot send to more than one handler');
            
            this.commandHandlerQueue.push({
                name: command.commandName, 
                handler: function (queueCallback) {
                    try {
                        route.handlers[0](command, queueCallback);
                    }
                    catch(e) {
                        queueCallback(e);
                    }
                }
            }, function (err) {
                commandHandledCallback(err);
            });
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
                _.each(route.handlers, function (handler) {
                    _this.handleEvent(handler, evnt);
                });
            }
            
            callback(null);
        }
    };
});

//endregion

//region AggregateRoot

var AggregateRoot = Fiber.extend(function () {
    return {
        init: function () {
            this.clock = new Clock(); //TODO: inject
            this._changes = [];
            this.id = '';
        },
        _applyChange : function (evnt, isNew) {
            // push atomic aggregate changes to local history for further processing (EventStore.SaveEvents)
            this['apply' + evnt.eventName](evnt);
            if (isNew) this._changes.push(evnt);
        }, 
        getUncommittedChanges: function () {
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
        init: function (eventPublisher, repository) {
            this.publisher = eventPublisher;
            this.repository = repository;
        },        
        saveEvents : function (aggregateId, events, expectedVersion, saveEventsCallback) {
            var _this = this;
            
            var loadEventSource = function (processEventsCallback) {
                _this.repository.loadEventSource(aggregateId, function (err, eventsSource) {
                    if (!eventsSource) {
                        _this.repository.createEventSource(aggregateId, function (err, eventsSource) {
                            processEventsCallback(err, eventsSource);
                        });
                    }
                    // check whether latest event version matches current aggregate version
                    // otherwise -> throw exception
                    else if (eventsSource.eventDescriptors[eventsSource.eventDescriptors.length - 1].version != expectedVersion) {
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
                        _this.repository.addEvent(aggregateId, {
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
        },
        getEventsForAggregate: function (aggregateId, callback) {
            this.repository.loadEventSource(aggregateId, function (err, eventSource) {
                if (!eventSource) {
                    callback(new Error('AggregateNotFoundException'), null);
                    return;
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
            var _this = this;

            this.storage.getEventsForAggregate(id, function (err, e) {
                if (err) {
                    callback(err, null);
                    return;
                }

                var obj = _this.constructorFunction();
                obj.loadsFromHistory(e);
                
                callback(null, obj);
            });
        }
    };
});

//endregion

module.exports = {
    Bus: Bus,
    EventStore: EventStore,
    Repository: Repository,
    AggregateRoot: AggregateRoot,
    Clock: Clock
};


