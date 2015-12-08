var projectDenormalizers = require('../../../server/readModels/projects/denormalizers');

describe("Project denormalizers", function () {
    it("should handle project created", function (done) {
        //arrange
        var projectsReadModelRepository = {
            upsert: function (id, project, callback) {
                callback(null);
            }
        };
        var sut = new projectDenormalizers.EventHandlers(projectsReadModelRepository)
        var event = {
            id: 'id',
            name : 'name',
            description: 'description',
            userId: 'userId',
            timestamp: new Date()
        };

        //act
        sut.handleProjectCreated(event, function (err) {            
            done();
        });
    });

    it("should handle project name changed", function (done) {
        
    });
});