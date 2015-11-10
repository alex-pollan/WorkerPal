/**
 * Created by Alex on 9/21/2015.
 */

var config = require('./server/config/config');
var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('express-jwt');
var authorize = require('./server/authorize');
var _ = require('lodash');

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

var Datastore = require('nedb');
var readModelDb = new Datastore({ filename: config.nedb.readModel, autoload: true });

var cqrsRuntime = require('./server/bootstrap')(readModelDb); 

if (process.env.deployPath) {
    app.all('*', function (req, res, next) {
        if (_.startsWith(req.url, process.env.deployPath + '/api')
            || _.startsWith(req.url, process.env.deployPath + '/capi')) {
            req.url = req.url.replace(process.env.deployPath, '');
        }

        next();
    });
}

require('./server/api/login')(app);
require('./server/api/projects')(app, readModelDb); //TODO: use repo instead
require('./server/capi/projects')(app, cqrsRuntime.bus);

var server = app.listen(process.env.PORT, function () {    
    console.log('App listening at http...');
});
