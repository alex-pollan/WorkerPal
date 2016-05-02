var ProjectCreated = require('../../src/events').ProjectCreated;
var expect = require('chai').expect;

describe('project created event', function(){
    var evnt, 
        id, 
        name,
        description,
        userId,
        timestamp;
    
    before(function(){
        id = 'id';
        name = 'name';
        description = 'description';
        userId = 'userId';
        timestamp = new Date();
        
        evnt = new ProjectCreated(id, name, description, userId, timestamp); 
    });

    it('has the data', function(){
        expect(evnt.eventName).to.equal(ProjectCreated.prototype.eventName);
        expect(evnt.id).to.equal(id);
        expect(evnt.name).to.equal(name);
        expect(evnt.description).to.equal(description);
        expect(evnt.userId).to.equal(userId);
        expect(evnt.timestamp).to.equal(timestamp);       
    });
    
});
