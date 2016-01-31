var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var helper = require("./helper");
var User = require("../models/User");

describe("Authentication module", function(){
    var user = new User({id: "id", name: "user@mail.com", password: "pswd"});
    var AuthenticationModule;
    
    before(function(done){
        helper.connect(function(err, db) {
            if (err){
                return;
            }
            
            AuthenticationModule = require("../index")(db);
            
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
    
    
    describe("valid credentials", function(){

        it("returns a user", function(done){
            AuthenticationModule.authenticate("user@mail.com", "pswd", function(err, user){
                expect(err).to.be.null;
                expect(user).to.not.be.undefined;
                expect(user).to.not.be.null;
                
                expect(user.id).to.be.equal("id");
                expect(user.name).to.be.equal("user@mail.com");
                
                done();
            });
        });
        
        it("the user contains an auth token");
        
    });
    
    describe("empty user name", function(){
        
        it("returns error");
        
    });

    describe("non existing user name", function(){
        
        it("returns error");
        
    });

    describe("invalid password", function(){
        
        it("returns error");
        
    });
    
});
