var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var User = require("../models/User");
var UserRepository = require("../UserRepository");
var Authentication = require("../Authentication");
var mongoose = require("mongoose");
var Logger = require("../Logger");

describe("Authentication", function(){

    var db;
    var logger;
    var userRepository;
    var authentication;
    var user = new User({id: "id", name: "user@mail.com", password: "pswd"});
    var testStartedAt = new Date();
    
    before(function(done){
        mongoose.connect("mongodb://localhost/test");
    
        db = mongoose.connection;
        
        db.on('error', function(err){
            console.error('connection error:' + err);
        });
        
        db.once('open', function() {
            userRepository = UserRepository(db);
            logger = new Logger(db);
            authentication = new Authentication(userRepository, logger);

            spy(logger, "log");
            
            done();
        });
    });
    
    before(function(done){
        userRepository.removeAll(function(err){
            if (err) {
                assert(false);
                return;
            }
            done();                
        });
    });
    
    before(function(done){
        logger.removeAll(function(err){
            if (err) {
                assert(false);
                return;
            }
            done();                
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
            expect(authenticatedUser).to.not.be.null;
            expect(authenticatedUser.id).to.be.equal(user.id);
            expect(authenticatedUser.name).to.be.equal(user.name);
        });
        
        it("creates a log entry", function() {
            assert(logger.log.calledOnce);
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
