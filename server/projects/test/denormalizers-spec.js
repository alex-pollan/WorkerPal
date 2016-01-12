var projectDenormalizers = require('../readModels/denormalizers');
var expect = require('chai').expect;
var spy = require('sinon').spy;

describe("Projects denormalizers", function () {    
    it("should handle project created", function (done) {
        //arrange
        var projectsReadModelRepository = {
            upsert: function (id, project, callback) {
                callback(null);
            }
        };        
        spy(projectsReadModelRepository, 'upsert');

        var sut = new projectDenormalizers.EventHandlers(projectsReadModelRepository)
        var projectCreatedEvent = {
            id: 'id',
            name : 'name',
            description: 'description',
            userId: 'userId',
            timestamp: new Date(),
            version: 1
        };
        
        //act
        sut.handleProjectCreated(projectCreatedEvent, function (err) {
            //assert
            expect(projectsReadModelRepository.upsert.called);
            expect(projectsReadModelRepository.upsert.lastCall.calledWith(projectCreatedEvent.id));
            var project = projectsReadModelRepository.upsert.lastCall.args[1];
            expect(project.id).to.be.equal(projectCreatedEvent.id);
            expect(project.name).to.be.equal(projectCreatedEvent.name);
            expect(project.description).to.be.equal(projectCreatedEvent.description);
            expect(project.userId).to.be.equal(projectCreatedEvent.userId);
            expect(project.created).to.be.equal(projectCreatedEvent.timestamp);
            expect(project.modified).to.be.equal(projectCreatedEvent.timestamp);
            expect(project.version).to.be.equal(projectCreatedEvent.version);
            done();
        });
    });
    
    it("should handle project name changed", function (done) {
        //arrange
        var projectsReadModelRepository = {
            update: function (id, dataToSet, callback) {
                callback(null);
            }
        };
        
        spy(projectsReadModelRepository, 'update');

        var sut = new projectDenormalizers.EventHandlers(projectsReadModelRepository)
        var projectNameChangedEvent = {
            id: 'id',
            name : 'name',            
            timestamp: new Date()
        };
        
        //act
        sut.handleProjectNameChanged(projectNameChangedEvent, function (err) {
            //assert
            expect(projectsReadModelRepository.update.called);
            expect(projectsReadModelRepository.update.lastCall.calledWith(projectNameChangedEvent.id));
            var dataToSet = projectsReadModelRepository.update.lastCall.args[1];
            expect(dataToSet.name).to.be.equal(projectNameChangedEvent.name);
            expect(dataToSet.modified).to.be.equal(projectNameChangedEvent.timestamp);
            expect(dataToSet.version).to.be.equal(projectNameChangedEvent.version);
            done();
        });
    });
});