var UserData = require("../src/user-data");
var helper = require("./helper");

var expect = require("chai").expect;
var assert = require("chai").assert;

describe("User data", function(){

    var userData;
    var user = {};

    before(function(done){
        helper.connect(function(err, db){
            assert(!err);
            
            userData = UserData(db);
            
            done(); 
        });
    });
    
    after(function(done){
       helper.disconnect(function(){
           done();
       });
    });

    describe("user", function(){
        var storedUser;
        
        it("is created", function(done){
            user.id = "1";
            user.name = "name";
            user.password = "password";
            user.email = "user@email.com";
            
            userData.create(user, function(err){
               expect(err).to.be.null;
               done();
            });
        });
        
        it("now exists", function(done){
            userData.readByUserName(user.name, function(err, readUser){
               expect(err).to.be.null;
               expect(readUser).not.to.be.null;
               expect(readUser.id).to.be.equal(user.id);
               expect(readUser.name).to.be.equal(user.name);
               expect(readUser.email).to.be.equal(user.email);
               storedUser = readUser;
               done();
            });
        });
        
        it("is updated", function(done){
            user.email = "user2@email.com";

            userData.update(user, function(err){
               expect(err).to.be.null;
               done();
            });
        });
        
        it("looks up to date", function(done){
            userData.readByUserName(user.name, function(err, readUser){
               expect(err).to.be.null;
               expect(readUser).not.to.be.null;
               expect(readUser.id).to.be.equal(user.id);
               expect(readUser.name).to.be.equal(user.name);
               expect(readUser.email).to.be.equal(user.email);
               done();
            });
        });
        
        it("verifies valid password", function(done){
            userData.verifyPassword("password", storedUser.password, function(err, res){
                expect(err).to.not.be.defined;
                expect(res).to.be.true;
                done();
            });
        });

        it("verifies wrong password", function(done){
            userData.verifyPassword("invalid", storedUser.password, function(err, res){
                expect(err).to.not.be.defined;
                expect(res).to.be.false;
                done();
            });
        });
    });

});
