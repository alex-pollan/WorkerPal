var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var commands = require('../domain/commands');
var events  = require('../domain/events');
var eventStoreInMemoryRepository = require('../../lib/cqrs-event-store-in-memory-repository');

var app = {
        put: function() {},
        post: function() {}
    },
    authorize = function() {},
    eventHandlers = {
        handleProjectCreated: spy()
    };
    
describe('Project aggregate root', function() {

    var bus,
        eventStoreRepository,
        id = 'id', 
        name = 'name', 
        description = 'description', 
        userId = 'userId',
        timestamp = new Date();

    before(function(){
        eventStoreRepository = new eventStoreInMemoryRepository.EventStoreRepository();
        bus = require('../index')(app, authorize, eventStoreRepository);
        bus.registerHandlers(eventHandlers);
    });
    
    describe('create project', function(){

        before(function(done){
            //given
            //some events in eventStoreRepository
            
            //when
            bus.send(new commands.Commands.CreateProject(id, name, description, userId), function (err) {
                expect(err).to.be.null;
                done();
            });
        });
        
        it('triggers event', function(){
            assert(eventHandlers.handleProjectCreated.calledOnce);
            var event = eventHandlers.handleProjectCreated.firstCall.args[0];
            expect(event.id).to.equal(id);
            expect(event.name).to.equal(name);
            expect(event.description).to.equal(description);
            expect(event.userId).to.equal(userId);
            expect(event.version).to.equal(0);
        });
        
    });
    
    describe('create project twice', function() {

        before(function(done){
            //given
            //some events in eventStoreRepository
            eventStoreRepository.addEvent(id, {
                            aggregateId: id,
                            eventData: new events.ProjectCreated(id, name, description, userId, timestamp),
                            version: 1
                        }, function(){
                done();
            });
        });
        
        it('return error', function(done){
            //when
            bus.send(new commands.Commands.CreateProject(id, name, description, userId), function (err) {
                expect(err).to.not.be.null;
                expect(err.message).to.equal('ConcurrencyException');
                done();
            });
        });
        
    });

});
