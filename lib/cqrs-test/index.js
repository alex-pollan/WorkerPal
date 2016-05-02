var spy = require("sinon").spy;
var cqrs = require('../cqrs');
var inMemoryBus = require('../cqrs-in-memory-bus');
var eventStoreInMemoryRepository = require('../cqrs-event-store-in-memory-repository');


var CqrsTests = function () {

    var bus,
        eventStore,
        eventStoreRepository,
        eventHandlers = {},
        api = {
            init: init,
            getEventHandlers: getEventHandlers,
            exception: null,
            error: null,
            events: null,
            given: given,
            when: when
        };

    internalInit();

    return api;

    function internalInit() {
        bus = new inMemoryBus.Bus();
        eventStoreRepository = new eventStoreInMemoryRepository.EventStoreRepository();
        eventStore = new cqrs.EventStore(bus, eventStoreRepository);
    }

    function init(aggregateRootConstructorFn, commandHandlersRegisterFn, events) {
        var aggregateRootRepository = new cqrs.Repository(aggregateRootConstructorFn, eventStore);
        var commandHandlers = commandHandlersRegisterFn(aggregateRootRepository);
        bus.registerHandlers(commandHandlers);
        registerEventHandlers(events);
    }
    
    function getEventHandlers(){
        return eventHandlers;
    }

    function registerEventHandlers(events) {
        for (var evntProp in eventHandlers) {
            delete eventHandlers.evntProp;
        }

        for (var evntObjName in events) {
            eventHandlers['handle' + evntObjName] = spy();
        }
        
        bus.registerHandlers(eventHandlers);
    }

    function given(events, done) {
        done = done || function () { };

        events.forEach(function (evnt) {
            eventStoreRepository.addEvent(evnt.aggregateId, evnt, function () { });
        });

        done();
    }

    function when(cmd, done) {
        bus.send(cmd, function (err) {
            done(err);
        });
    }
};

module.exports = CqrsTests();
