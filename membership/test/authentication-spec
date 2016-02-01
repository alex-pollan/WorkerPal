var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var User = require("../models/User");
var Authentication = require("../Authentication");
var helper = require("./helper");

describe("Authentication", function(){

    var authentication;
    var user = new User({id: "id", name: "user@mail.com", password: "pswd"});
    var testStartedAt = new Date();
    
    before(function(done){
        helper.connect(function(err, db) {
            if (err){
                return;
            }
            
            authentication = new Authentication(helper.userRepository, helper.logger);

            spy(helper.logger, "log");

            done();
        });
    });
    
    before(function(done){
        helper.createTestUser(user, function(err, createdUser) {
            if (err) {
                assert(false);
                return;
            }
            done();
        });
    });
    
    after(function(done){
        helper.disconnect(function(){
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
            expect(authenticatedUser).to.not.be.null;
            expect(authenticatedUser.id).to.be.equal(user.id);
            expect(authenticatedUser.name).to.be.equal(user.name);
        });
        
        it("creates a log entry", function() {
            assert(helper.logger.log.calledOnce);
        });
        
        it("update the user stats", function() {
            expect(authenticatedUser.loginCount).to.not.be.undefined;
            expect(authenticatedUser.loginCount).to.be.equal(1);
        });
        
        it("update the signon dates", function(){
            expect(authenticatedUser.lastLoginDateTime).to.not.be.undefined;    
            expect(authenticatedUser.lastLoginDateTime.getTime()).to.be.above(testStartedAt.getTime());
            expect(authenticatedUser.lastLoginDateTime.getTime()).to.be.below(new Date().getTime());
        });
        
    });

    describe("empty email", function(){
        var authError;
        
        it("is not successful", function(done){
            authentication.authenticate("", "pswd", function(err, authUser){
                expect(err).to.not.be.null;
                expect(authUser).to.be.undefined;
                
                authError = err;

                done();    
            });
       });
       
       it("returns a message saying 'Invalid login'", function(){
           expect(authError.message).to.be.equal("Invalid login");
       });

    });

    describe("empty password", function(){
        
       var authError;
        
        it("is not successful", function(done){
            authentication.authenticate("user@mail.com", "", function(err, authUser){
                expect(err).to.not.be.null;
                expect(authUser).to.be.undefined;
                
                authError = err;

                done();    
            });
       });
       
       it("returns a message saying 'Invalid login'", function(){
           expect(authError.message).to.be.equal("Invalid login");
       });

    });

    describe("password doesn't match", function(){
        
       var authError;
        
        it("is not successful", function(done){
            authentication.authenticate("user@mail.com", "anotherpswd", function(err, authUser){
                expect(err).to.not.be.null;
                expect(authUser).to.be.undefined;
                
                authError = err;

                done();    
            });
       });
       
       it("returns a message saying 'Invalid login'", function(){
           expect(authError.message).to.be.equal("Invalid login");
       });

    });

    describe("email not found", function() {
       
       var authError;
        
        it("is not successful", function(done){
            authentication.authenticate("unexisting@mail.com", "anotherpswd", function(err, authUser){
                expect(err).to.not.be.null;
                expect(authUser).to.be.undefined;
                
                authError = err;

                done();    
            });
       });
       
       it("returns a message saying 'Invalid login'", function(){
           expect(authError.message).to.be.equal("Invalid login");
       });

    });
});
