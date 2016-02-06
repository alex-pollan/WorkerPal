var config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var _ = require('lodash');
var mongoose = require("mongoose");

var app = express();
app.use(express.static('public'));
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
        if (_.startsWith(req.url, process.env.deployPath + '/api')
            || _.startsWith(req.url, process.env.deployPath + '/capi')) {
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
    require('../projects')(app, db); 
    require('../membership')(app, db);
    
    app.listen(process.env.PORT, function () {    
        console.log('App listening at http...');
    });
});

