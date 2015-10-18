var InMemoryBus = require('../../server/cqrs/in-memory-bus');

describe("In memory bus", function () {
    it("should invoke command handler", function (done) {
        //arrange
        var bus = new InMemoryBus.Bus();
        var commandHandler = {
            handleCommand1: function (command, callback) {  
                callback();              
            }
        };
        spyOn(commandHandler, 'handleCommand1').andCallThrough();       
        var command = { commandName: 'Command1' };                
        bus.registerHandlers(commandHandler);
        
        //act
        bus.send(command, function (err) {
            //assert
            expect(err).toBe(undefined);
            expect(commandHandler.handleCommand1.calls.length).toEqual(1); 
            done();
        });
    });

    it("should receive error from command handler", function (done) {
        //arrange
        var bus = new InMemoryBus.Bus();
        var commandHandler = {
            handleCommand1: function (command, callback) {
                callback(new Error('Error1'));
            }
        };
        spyOn(commandHandler, 'handleCommand1').andCallThrough();
        var command = { commandName: 'Command1' };
        bus.registerHandlers(commandHandler);
        
        //act
        bus.send(command, function (err) {
            //assert
            expect(err).not.toBe(undefined);
            expect(err).not.toBe(null);
            expect(err.message).toBe('Error1');
            expect(commandHandler.handleCommand1.calls.length).toEqual(1);
            done();
        });
    });
});