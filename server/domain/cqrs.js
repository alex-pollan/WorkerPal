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
        if (_.isFunction(handlers[member]) && _.startsWith(member, _this._handlePrefix)) {
            console.log('Found the handler: ' + member);
            _addMessageHandler(_getMessageName(member), handlers[member]);
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

var FakeBus = function() {};
FakeBus.inheritsFrom(Bus);
FakeBus.prototype.handleEvent = function(handler, evnt) {
    //TODO:
    console.log('fake processHandler');
};

//endregion

//region WIP: EventHandlersQueue

var EventHandlersQueue = function() {
    this.queue = [];
    this.stopped = false;
    this.interval = 100;
};

EventHandlersQueue.prototype.enqueue = function(handler) {
    this.queue.push(handler);
};

EventHandlersQueue.prototype.start = function() {
    if (this.intervalId) return;

    var _this = this;
    this.intervalId = setInterval(function() {
        //TODO:
    }, this.interval);
};

EventHandlersQueue.prototype.dispose = function() {
    if (!this.intervalId) return;

    clearInterval(this.intervalId);
    delete this.intervalId;
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
        debugger;
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

EventStore.prototype.saveEvents = function(aggregateId, events, expectedVersion) {
    var _this = this;

    // try to get event descriptors list for given aggregate id
    // otherwise -> create empty dictionary
    var eventsSource = _.find(this.current, function(item) {
        return item.aggregateId === aggregateId;
    });

    if (!eventsSource) {
        eventsSource = {
            aggregateId: aggregateId,
            eventDescriptors: []
        }
        this.current.push(eventsSource);
    }
    // check whether latest event version matches current aggregate version
    // otherwise -> throw exception
    else if (eventsSource.eventDescriptors[eventsSource.eventDescriptors.length - 1].version != expectedVersion
        && expectedVersion != -1) {
        throw new Error('ConcurrencyException');
    }

    var i = expectedVersion;

    // iterate through current aggregate events increasing version with each processed event
    _.each(events, function(evnt) {
        i++;
        evnt.version = i;

        // push event to the event descriptors list for current aggregate
        eventsSource.eventDescriptors.push({
            aggregateId: aggregateId,
            eventData: evnt,
            version: i
        });

        // publish current event to the bus for further processing by subscribers
        _this.publisher.publish(evnt);
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
    Bus: FakeBus,
    EventStore: EventStore,
    Repository: Repository,
    AggregateRoot: AggregateRoot
};

