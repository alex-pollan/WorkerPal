var chai = require("chai");
var expect = chai.expect;
var assert = chai.assert;
var spy = require("sinon").spy;
var helper = require("./helper");
var User = require("../models/User");

describe("Authentication module", function(){
    
    describe("null db connection", function(){
        it("throws exception", function(){

            var badConstruction = function() {
                require("../index")({db: null});    
            };
            
            expect(badConstruction).to.throw();
        });
    });
    
    describe("valid db connection", function() {
        
        var user = new User({id: "id", name: "user@mail.com", password: "pswd"});
        var AuthenticationModule;
        
        before(function(done){
            helper.connect(function(err, db) {
                if (err){
                    return;
                }
                
                AuthenticationModule = require("../index")({db: db});
                
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
            var authenticationInfo;
            
            it("returns auth info", function(done){
                AuthenticationModule.authenticate(user.name, user.password, function(err, authInfo){
                    expect(err).to.be.null;
                    expect(authInfo).to.not.be.undefined;
                    expect(authInfo).to.not.be.null;
                    
                    authenticationInfo = authInfo;
                    
                    done();
                });
            });
            
            it("the auth info contains an user", function(){
                expect(authenticationInfo.user.id).to.be.equal("id");
                expect(authenticationInfo.user.name).to.be.equal("user@mail.com");
            });
    
            it("the auth info contains an auth token", function(){
                expect(authenticationInfo.token).to.not.be.undefined;
                expect(authenticationInfo.token).to.not.be.null;
            });
        });
        
        describe("empty user name", function(){
            
            it("returns error", function(done) {
                AuthenticationModule.authenticate("", user.password, function(err, authInfo){
                    expect(err).to.not.be.null;
                    expect(authInfo).to.not.be.defined;

                    done();
                });
            });
            
        });
    
        describe("non existing user name", function(){
            
            it("returns error", function(done) {
                AuthenticationModule.authenticate("nonexsting@mail.com", user.password, function(err, authInfo){
                    expect(err).to.not.be.null;
                    expect(authInfo).to.not.be.defined;

                    done();
                });
            });
            
        });
    
        describe("invalid password", function(){
            
            it("returns error", function(done) {
                AuthenticationModule.authenticate(user.name, "invalidpassword", function(err, authInfo){
                    expect(err).to.not.be.null;
                    expect(authInfo).to.not.be.defined;

                    done();
                });
            });
            
        });
    });
});
