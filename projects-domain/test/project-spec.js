var expect = require('chai').expect;
var assert = require('chai').assert;
var spy = require('sinon').spy;
var Project = require('../index').Project;

describe('project aggregate root', function(){
    
    before(function(){
        project = new Project();
    });
    
    it('has the functions', function(){
    
        expect(project.construct).is.a('function');             
        expect(project.changeName).is.a('function');
        expect(project.applyProjectCreated).is.a('function');
        expect(project.applyProjectNameChanged).is.a('function');
        
    });

    describe('construct', function(){
        var id, 
            name, 
            description, 
            userId;

        before(function(){
            id = 'id';
            name = 'name';
            description = 'description';
            userId = 'userId'    

            spy(project, 'construct');
            spy(project, 'applyProjectCreated');
        });
        
        describe('succeed', function(){

            before(function(){
                project.construct(id, name, description, userId);
            });
            
            it('apply project created event', function(){
                assert(project.applyProjectCreated.calledOnce);

                var evnt = project.applyProjectCreated.firstCall.args[0];
                expect(evnt.id).to.equal(id);
                expect(evnt.name).to.equal(name);
                expect(evnt.description).to.equal(description);
                expect(evnt.userId).to.equal(userId);
            });
            
        });
        
        describe('fails', function() {

            describe('id is not defined', function() {

                before(function(){
                    try {
                        project.construct(undefined, name, description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
            
            describe('id is null', function() {

                before(function(){
                    try {
                        project.construct(null, name, description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
                        
            describe('id is empty', function(){

                before(function(){
                    try {
                        project.construct('', name, description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {                   
                    assert(project.construct.threw());                    
                });
                
            });
            
            
            describe('name is not defined', function(){

                before(function(){
                    try {
                        project.construct(id, undefined, description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
            
            describe('name is null', function(){

                before(function(){
                    try {
                        project.construct(id, null, description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
                        
            describe('name is empty', function(){

                before(function(){
                    try {
                        project.construct(id, '', description, userId);
                    } catch (e) { }
                });

                it('throw error', function() {                   
                    assert(project.construct.threw());                    
                });
                
            });
            
            describe('userId is not defined', function(){

                before(function(){
                    try {
                        project.construct(id, name, description, undefined);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
            
            describe('userId is null', function(){

                before(function(){
                    try {
                        project.construct(id, name, description, null);
                    } catch (e) { }
                });

                it('throw error', function() {
                    assert(project.construct.threw());                    
                });
                
            });
                        
            describe('userId is empty', function(){

                before(function(){
                    try {
                        project.construct(id, name, description, '');
                    } catch (e) { }
                });

                it('throw error', function() {                   
                    assert(project.construct.threw());                    
                });
                
            });            
            
        });
    });
});
