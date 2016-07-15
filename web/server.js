var Promise = require('bluebird');
var config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var _ = require('lodash');
var mongoose = require("mongoose");
var membership = require('../membership');

var app = express();
console.log(__dirname);
app.use(express.static(__dirname + '/../public'));
app.use(bodyParser.json());
app.use(jwt({
    secret: config.jwtSecretToken,
    credentialsRequired: false,
    getToken: function fromHeader (req) {
        if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
            return req.headers.authorization.split(' ')[1];
        } else if (req.query && req.query.token) {
            return req.query.token;
        }
        return null;
    }
}));

if (process.env.deployPath) {
    app.all('*', function (req, res, next) {
        if (_.startsWith(req.url, process.env.deployPath + '/api/query')
            || _.startsWith(req.url, process.env.deployPath + '/api/cmd')) {
            req.url = req.url.replace(process.env.deployPath, '');
        }

        next();
    });
}

var openDbPromise = Promise.promisify(openDb);

openDbPromise().then(function(db){
     setupCqrs(db);
    
    membership.init(app, db);
    seedMembership(db);
}, function(err){
    console.log(err);
});

function openDb(cb){
    mongoose.connect("mongodb://localhost/test");
        
    var db = mongoose.connection;
            
    db.on('error', function(err){
        console.log('Couldn\'t open db connection...' + err);
        cb(err);
    });
    
    db.once('open', function() {
        cb(null, db);
    });
}

function setupCqrs(db) { 
    var authorize = require('./authorize');
    var eventStoreMongoDbRepository = require('@tapmiapp/cqrs-event-store-mongodb-repository');
    
    var bus = require('../projects-cmd')(app, authorize, new eventStoreMongoDbRepository.EventStoreRepository(db));
    require('../projects-query')(app, authorize, db, bus); 
}

function seedMembership(db){
    membership.seed(db, function(err){
        if (err) {
            console.error('Membership seed error ' + err);
            return;
        }
        
        startApp();
    });
}

function startApp(){
    var port = process.env.PORT || 3000;
    
    app.listen(port, function () {
        console.log('App listening at http port ' + port + '...');
    });
}   
    