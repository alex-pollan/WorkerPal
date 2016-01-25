var mongoose = require("mongoose");

var UserRepository = require("../UserRepository");
var User = require("../models/User");

var expect = require("chai").expect;
var assert = require("chai").assert;

describe("User repository", function(){

    var db;
    var userRepository;
    var user = new User();

    before(function(done){
        mongoose.connect("mongodb://localhost/test");
    
        db = mongoose.connection;
        
        db.on('error', function(err){
            console.error('connection error:' + err);
        });
        
        db.once('open', function() {
            userRepository = UserRepository(db);
            userRepository.removeAll(function(err){
                if (err) {
                    assert(false);
                    return;
                }
                done();                
            });
        });
    });
    
    after(function(done){
       db.close(function(){
           done();
       });
    });

    describe("user", function(){
        
        it("is created", function(done){
            user.id = "1";
            user.name = "name";
            user.password = "password";
            
            userRepository.create(user, function(err){
               expect(err).to.be.null;
               done();
            });
        });
        
        it("now exists", function(done){
            userRepository.read(user.id, function(err, readUser){
               expect(err).to.be.null;
               expect(readUser).not.to.be.null;
               expect(readUser.id).to.be.equal(user.id);
               expect(readUser.name).to.be.equal(user.name);
               done();
            });
        });
        
        it("is updated", function(done){
            user.name = "updated name";

            userRepository.update(user, function(err){
               expect(err).to.be.null;
               done();
            });
        });
        
        it("looks up to date", function(done){
            userRepository.read(user.id, function(err, readUser){
               expect(err).to.be.null;
               expect(readUser).not.to.be.null;
               expect(readUser.id).to.be.equal(user.id);
               expect(readUser.name).to.be.equal(user.name);
               done();
            });
        });

    });


    describe("update user", function(){
        

    });
    
    describe("update unexisting user", function() {
        
        it("returns err");

    });

    describe("read existing user", function(){
        
        describe("DB action is successful", function(){
            
            it("returns the user");
    
        });

        describe("there is a DB problem", function(){
            
            it("returns error");
    
        });

    });
    
    describe("read non existing user", function(){
        
        describe("DB action is successful", function(){
            
            it("returns null");
    
        });

        describe("there is a DB problem", function(){
            
            it("returns error");
    
        });

    });

    describe("list users", function(){
        
        describe("DB action is successful", function(){
            
            it("returns list of users");
    
        });

        describe("there is a DB problem", function(){
            
            it("returns error");
    
        });

    });
    
    describe("delete user", function(){

        describe("DB action is successful", function(){
            
            it("returns ok");
    
        });

        describe("there is a DB problem", function(){
            
            it("returns error");
    
        });

    });

});
