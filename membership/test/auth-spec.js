var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var User = require("../models/User");
var UserRepository = require("../UserRepository");
var Authentication = require("../Authentication");
var mongoose = require("mongoose");

describe("Authentication", function(){

    var db;
    var userRepository;
    var authentication;
    var user = new User({id: "id", name: "user@mail.com", password: "pswd"});
    
    before(function(done){
        mongoose.connect("mongodb://localhost/test");
    
        db = mongoose.connection;
        
        db.on('error', function(err){
            console.error('connection error:' + err);
        });
        
        db.once('open', function() {
            userRepository = UserRepository(db);
            authentication = new Authentication(userRepository);
            
            userRepository.removeAll(function(err){
                if (err) {
                    assert(false);
                    return;
                }
                done();                
            });
        });
    });
    
    before(function(done){
        userRepository.create(user, function(err, createdUser){
            if (err) {
                assert(false);
                return;
            }
            
            done();                
        });
    });

    after(function(done){
       db.close(function(){
           done();
       });
    });

    describe("a valid login", function(){
        var authenticatedUser = null;
        
        it("is successful", function(done){
            authentication.authenticate("user@mail.com", "pswd", function(err, authUser){
                expect(err).to.be.null;

                authenticatedUser = authUser;
                
                done();    
            });
        });
        
        it("returns a user", function(){
            expect(authenticatedUser).not.to.be.null;
            expect(authenticatedUser.id).to.be.equal(user.id);
            expect(authenticatedUser.name).to.be.equal(user.name);
        });
        
        it("creates a log entry");
        it("update the user stats");
        it("update the signon dates");
        
    });

    describe("empty email", function(){
        
       it("is not successful");
       it("returns a message saying 'Invalid login'");

    });

    describe("empty password", function(){
        
       it("is not successful");
       it("returns a message saying 'Invalid login'");

    });

    describe("password doesn't match", function(){
        
       it("is not successful");
       it("returns a message saying 'Invalid login'");

    });

    describe("email not found", function(){
        
       it("is not successful");
       it("returns a message saying 'Invalid login'");

    });

    
});
