var expect = require("chai").expect;
var request = require("supertest");
var express = require("express");
var service = require("../src/service");

describe("Authentication service", function(){
    var response;
    var app = express();
    var authMock = {};
    service({app: app, auth: authMock});
    
    describe("valid login", function(){
        before(function(done){
            authMock.authenticate = function(userName, password, cb) {
                cb(null, {id: "1", name: "user", });
            };

            request(app)
                .post("/api/auth/login")
                .send({username: "user", password: "pswd"})
                .end(function(err, res) {
                    response = res;
                    done();
                });
        });

        it("set user in the response", function(){
            expect(response.body.user).to.defined;
            expect(response.body.user.id).to.equal("1");
            expect(response.body.user.name).to.equal("user");
        });

        it("set token in the response", function(){
            expect(response.body.token).to.not.empty;
        });

    });
    
    describe("invalid login", function(){
        before(function(done){
            authMock.authenticate = function(userName, password, cb) {
                cb(null, null);
            };

            request(app)
                .post("/api/auth/login")
                .send({username: "user", password: "pswd"})
                .end(function(err, res) {
                    response = res;
                    done();
                });
        });
        
        it("respond with 401", function(){
            expect(response.statusCode).to.equal(401);
        });    
    });

    describe("error on login", function(){
        before(function(done){
            authMock.authenticate = function(userName, password, cb) {
                cb(new Error('Unexpected error'), null);
            };

            request(app)
                .post("/api/auth/login")
                .send({username: "user", password: "pswd"})
                .end(function(err, res) {
                    response = res;
                    done();
                });
        });
        
        it("respond with 401", function(){
            expect(response.statusCode).to.equal(401);
        });    
    });

    describe("Logout", function(){
        
    });

});