var expect = require('chai').expect;
var spy = require('sinon').spy;
var InMemoryBus = require('../index');

describe("In memory bus", function () {
    it("should invoke command handler", function (done) {
        //arrange
        var bus = new InMemoryBus.Bus();
        var commandHandler = {
            handleCommand1: function (command, callback) {  
                callback();              
            }
        };
        spy(commandHandler, 'handleCommand1');       
        var command = { commandName: 'Command1' };                
        bus.registerHandlers(commandHandler);
        
        //act
        bus.send(command, function (err) {
            //assert
            expect(err).to.be.undefined;
            expect(commandHandler.handleCommand1.callCount).to.be.equal(1); 
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
        spy(commandHandler, 'handleCommand1');
        var command = { commandName: 'Command1' };
        bus.registerHandlers(commandHandler);
        
        //act
        bus.send(command, function (err) {
            //assert
            expect(err).not.to.be.undefined;
            expect(err).not.to.be.null;
            expect(err.message).to.be.equal('Error1');
            expect(commandHandler.handleCommand1.callCount).to.be.equal(1);
            done();
        });
    });
});