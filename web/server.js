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

mongoose.connect("mongodb://localhost/test");
        
var db = mongoose.connection;
        
db.on('error', function(err){
    console.log('Couldn\'t open db connection...' + err);
});

db.once('open', function() {
    var authorize = require('./authorize');
    var eventStoreMongoDbRepository = require('@tapmiapp/cqrs-event-store-mongodb-repository');
    
    var bus = require('../projects-cmd')(app, authorize, new eventStoreMongoDbRepository.EventStoreRepository(db));
    require('../projects-query')(app, authorize, db, bus); 
    membership.init(app, db);
    
    membership.seed(db, function(err){
        
    });
    
    var port = process.env.PORT || 3000;
    
    app.listen(port, function () {
        console.log('App listening at http port ' + port + '...');
    });
});
