/**
 * Created by Alex on 9/26/2015.
 */
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var tokenManager = require('../config/tokenManager');

module.exports = function UsersApi(app) {
    
    var users = [
        {id: '2e4adbbc-3942-4083-8e4e-84bf6cdf32c7', userName: 'alex', password: 'alex', Name:'Alex'},
        {id: '2e4adbbc-3942-4083-8e4e-84bf6cdf32c8', userName: 'ro', password: 'ro', Name: 'Rocio'}
    ];

    // route to test if the user is logged in or not
    app.get('/api/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/api/login', function(req, res) {
        var userName = req.body.username,
            password = req.body.password;

        var loggingUser = _.find(users, function(user){
           return user.userName === userName && user.password === password;  
        });

        if (!loggingUser) return res.send(401);

        var user = {
            id: loggingUser.id, 
            name: loggingUser.Name,
            userName: loggingUser.userName
        };
        var token = jwt.sign(user, config.jwtSecretToken, { expiresInMinutes: tokenManager.TOKEN_EXPIRATION });
        return res.json({token:token});
    });

    // route to log out
    app.post('/api/logout', function(req, res){
        if (req.user) {
            tokenManager.expireToken(req.headers);
            delete req.user;
            res.send(200);
        }
        else
        {
            return res.send(401);
        }
    });
};