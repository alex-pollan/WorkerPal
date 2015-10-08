/**
 * Created by Alex on 9/21/2015.
 */

var config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var authorize = require('./authorize');
var _ = require('lodash');

var Context = function() {
    var _callbacks = [];
    
    var onUserAuthenticated = function (callback) {
        _callbacks.push(callback);
    };
    
    var setAuthenticatedUser = function (user) {
        _.each(_callbacks, function (callback) {
            callback(user);
        });
    }

    return {
        onUserAuthenticated: onUserAuthenticated,
        setAuthenticatedUser: setAuthenticatedUser
    };
};

var context = Context();

var cqrsRuntime = require('./bootstrap')(context);

var app = express();
app.use(express.static('public'));
app.use('/vendor', express.static('bower_components'));
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

app.use(function (req, res, next) {
    if (_.startsWith(req.url, '/api/') && req.user) {
        context.setAuthenticatedUser(req.user);
    }
    next();
});

require('./api/login')(app);
require('./api/projects')(app, cqrsRuntime.bus);

var server = app.listen(8080, function () {    
    console.log('App listening at http...');
});
