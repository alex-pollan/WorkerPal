/**
 * Created by Alex on 9/21/2015.
 */

var config = require('./config/config');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var authorize = require('./authorize');

var bootstrap = require('./domain/bootstrap')();

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

require('./api/login')(app, jwt, config);

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http...');
});
