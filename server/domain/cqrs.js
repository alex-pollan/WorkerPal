/**
 * Created by Alex on 9/27/2015.
 */

var _ = require('lodash');

if (!Function.prototype.inheritsFrom) {
    Function.prototype.inheritsFrom = function(parentClassOrObject) {
        if (parentClassOrObject.constructor == Function) {
            //Normal Inheritance
            this.prototype = new parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject.prototype;
        } else {
            //Pure Virtual Inheritance
            this.prototype = parentClassOrObject;
            this.prototype.constructor = this;
            this.prototype.parent = parentClassOrObject;
        }
        return this;
    };
}

//region Bus

var Bus = function() {
    this._handlePrefix = 'handle';
    this._routes = [];
};

Bus.prototype.registerHandlers = function(handlers) {
    var _this = this;

    var _getMessageName = function(fnName) {
        return fnName.substr(_this._handlePrefix.length);
    };

    var _addMessageHandler = function(messageName, fn) {
        var route = _getRoute(messageName);
        route.handlers.push(fn);
    };

    var _getRoute = function(messageName) {
        var entry = _.find(_this._routes, function(item) {
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
};

Bus.prototype.send = function(command) {
    var _this = this;

    if (!command) {
        throw new Error('Command expected');
    }

    var route = _.find(_this._routes, function(route) {
        return route.messageName === command.commandName;
    });

    if (!route)
        throw new Error('no handler registered');

    if (route.handlers.length != 1)
        throw new Error('cannot send to more than one handler');

    route.handlers[0](command);
};

Bus.prototype.handleEvent = function(handler, evnt) {
    throw new Error('Not implemented');
};

Bus.prototype.publish = function(evnt) {
    var _this = this;

    if (!evnt) {
        throw new Error('Event expected');
    }

    var route = _.find(_this._routes, function(route) {
        return route.messageName === evnt.eventName;
    });

    if (route) {
        for (var i = 0; l = route.handlers.length, i < l; i++) {
            _this.handleEvent(route.handlers[i], evnt);
        }
    }
};

var InMemoryBus = function() {
    this.eventHandlersQueue = new EventHandlersQueue();
    this.eventHandlersQueue.start();
};

InMemoryBus.inheritsFrom(Bus);

InMemoryBus.prototype.handleEvent = function(handler, event) {
    this.eventHandlersQueue.enqueue(handler, event);
};

//endregion

//region WIP: EventHandlersQueue

var EventHandlersQueue = function() {
    this.queue = [];
    this.started = false;
    this.interval = 500;
};

EventHandlersQueue.prototype.enqueue = function(handler, event) {
    this.queue.push({handler : handler, event : event});
};

EventHandlersQueue.prototype.start = function() {
    var _this = this;

    if (this.started) return;

    this.processNext();

    this.started = true;
};

EventHandlersQueue.prototype.process = function() {
    var _this = this;

    if (this.queue.length == 0) {
        this.processNext();
        return;
    }

    var handlerEntry = this.queue[0];
    try {
        var promise = handlerEntry.handler(handlerEntry.event);

        if (!promise || !promise.then) {
            throw new Error('Expected a promise from handler of event ' + handlerEntry.event.eventName);
        }

        promise.then(function(){
            _.pullAt(_this.queue, 0);
            _this.processNext();
            console.info('Event ' + handlerEntry.event.eventName + ' processed...');
        }, function(e){
            console.error('Event ' + handlerEntry.event.eventName + ' threw an error: ' + e);
        });
    }
    catch(e) {
        console.error('Event ' + handlerEntry.event.eventName + ' could not be processed: ' + e);
    }
};

EventHandlersQueue.prototype.processNext = function() {
    var _this = this;

    setTimeout(function(){
        _this.process();
    }, this.interval);
};

//endregion

//region AggregateRoot

var AggregateRoot = function() {
    // push atomic aggregate changes to local history for further processing (EventStore.SaveEvents)
    this._applyChange = function(evnt, isNew) {
        this['apply' + evnt.eventName](evnt);
        if (isNew) this._changes.push(evnt);
    };

    this.initialize = function(){
        this._changes = [];
        this.id = '';
        this.version = 0;
    };

    this.initialize();
};

AggregateRoot.prototype.getUncommittedChanges = function() {
    return this._changes;
};

AggregateRoot.prototype.markChangesAsCommitted = function() {
    this._changes = [];
};

AggregateRoot.prototype.loadsFromHistory = function(history) {
    var _this = this;
    _.each(history, function(item) {
        _this._applyChange(item, false);
    });
};

AggregateRoot.prototype.applyChange = function(evnt) {
    this._applyChange(evnt, true);
};

//endregion

//region Event Store

var EventStore = function(eventPublisher) {
    this.publisher = eventPublisher;
    this.current = [];
};
EventStore.prototype.loadEventSource = function(aggregateId) {
    //TODO: db
    return _.find(this.current, function(item) {
        return item.aggregateId === aggregateId;
    });
};

EventStore.prototype.createEventSource = function(aggregateId) {
    //TODO: db
    var eventsSource = {
        aggregateId: aggregateId,
        eventDescriptors: []
    };
    this.current.push(eventsSource);
    return eventsSource;
};

EventStore.prototype.addEvent = function(eventsSource, eventDescriptor){
    //TODO: db
    eventsSource.eventDescriptors.push(eventDescriptor);
};

EventStore.prototype.saveEvents = function(aggregateId, events, expectedVersion) {
    var _this = this;

    // try to get event descriptors list for given aggregate id
    // otherwise -> create empty dictionary
    var eventsSource = this.loadEventSource(aggregateId);

    if (!eventsSource) {
        eventsSource = this.createEventSource(aggregateId);
    }
    // check whether latest event version matches current aggregate version
    // otherwise -> throw exception
    else if (eventsSource.eventDescriptors[eventsSource.eventDescriptors.length - 1].version != expectedVersion
            && expectedVersion != -1) {
        throw new Error('ConcurrencyException');
    }

    var i = expectedVersion;

    // iterate through current aggregate events increasing version with each processed event
    _.each(events, function(event) {
        i++;
        event.version = i;

        // push event to the event descriptors list for current aggregate
        _this.addEvent(eventsSource, {
            aggregateId: aggregateId,
            eventData: event,
            version: i
        });

        // publish current event to the bus for further processing by subscribers
        _this.publisher.publish(event);
    });
};

EventStore.prototype.getEventsForAggregate = function(aggregateId) {
    var eventSource = _.find(this.current, function(item) {
        return item.aggregateId === aggregateId;
    });

    if (!eventSource) {
        throw new Error('AggregateNotFoundException');
    }

    return _.map(eventSource.eventDescriptors, function(item) {
        return item.eventData;
    });
};

//endregion

//region Repository

var Repository = function(constructorFunction, eventStore) {
    this.constructorFunction = constructorFunction;
    this.storage = eventStore;
};

Repository.prototype.save = function(aggregate, expectedVersion) {
    this.storage.saveEvents(aggregate.id, aggregate.getUncommittedChanges(), expectedVersion);
};

Repository.prototype.getById = function(id) {
    var obj = new this.constructorFunction;
    var e = this.storage.getEventsForAggregate(id);
    obj.loadsFromHistory(e);
    return obj;
};

//endregion

module.exports = {
    Bus: InMemoryBus,
    EventStore: EventStore,
    Repository: Repository,
    AggregateRoot: AggregateRoot
};


