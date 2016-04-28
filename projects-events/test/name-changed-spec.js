var ProjectNameChanged = require('../index').ProjectNameChanged;
var expect = require('chai').expect;

describe('project name changed event', function(){
    var evnt, 
        id, 
        name,
        timestamp;
    
    before(function(){
        id = 'id';
        name = 'name';
        timestamp = new Date();
        
        evnt = new ProjectNameChanged(id, name, timestamp); 
    });

    it('has the data', function(){
        expect(evnt.eventName).to.equal(ProjectNameChanged.prototype.eventName);
        expect(evnt.id).to.equal(id);
        expect(evnt.name).to.equal(name);
        expect(evnt.timestamp).to.equal(timestamp);       
    });
    
});
