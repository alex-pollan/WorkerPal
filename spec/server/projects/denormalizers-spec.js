var projectDenormalizers = require('../../../server/readModels/projects/denormalizers');

describe("Projects denormalizers", function () {    
    it("should handle project created", function (done) {
        //arrange
        var projectsReadModelRepository = {
            upsert: function (id, project, callback) {
                callback(null);
            }
        };        
        spyOn(projectsReadModelRepository, 'upsert').andCallThrough();

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
            expect(projectsReadModelRepository.upsert).toHaveBeenCalled();
            expect(projectsReadModelRepository.upsert.mostRecentCall.args[0]).toEqual(projectCreatedEvent.id);
            var project = projectsReadModelRepository.upsert.mostRecentCall.args[1];
            expect(project.id).toEqual(projectCreatedEvent.id);
            expect(project.name).toEqual(projectCreatedEvent.name);
            expect(project.description).toEqual(projectCreatedEvent.description);
            expect(project.userId).toEqual(projectCreatedEvent.userId);
            expect(project.created).toBe(projectCreatedEvent.timestamp);
            expect(project.modified).toBe(projectCreatedEvent.timestamp);
            expect(project.version).toEqual(projectCreatedEvent.version);
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
        
        spyOn(projectsReadModelRepository, 'update').andCallThrough();

        var sut = new projectDenormalizers.EventHandlers(projectsReadModelRepository)
        var projectNameChangedEvent = {
            id: 'id',
            name : 'name',            
            timestamp: new Date()
        };
        
        //act
        sut.handleProjectNameChanged(projectNameChangedEvent, function (err) {
            //assert
            expect(projectsReadModelRepository.update).toHaveBeenCalled();
            expect(projectsReadModelRepository.update.mostRecentCall.args[0]).toEqual(projectNameChangedEvent.id);
            var dataToSet = projectsReadModelRepository.update.mostRecentCall.args[1];
            expect(dataToSet.name).toEqual(projectNameChangedEvent.name);
            expect(dataToSet.modified).toBe(projectNameChangedEvent.timestamp);
            expect(dataToSet.version).toEqual(projectNameChangedEvent.version);
            done();
        });
    });
});