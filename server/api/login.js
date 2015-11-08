/**
 * Created by Alex on 9/26/2015.
 */
var _ = require('lodash');
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var tokenManager = require('../config/tokenManager');

module.exports = function UsersApi(app) {
    
    var users = [
        {id: '2e4adbbc-3942-4083-8e4e-84bf6cdf32c7', userName: 'alex', password: 'alex', Name:'Alex', email: 'alexpollan@yahoo.com'},
        {id: '2e4adbbc-3942-4083-8e4e-84bf6cdf32c8', userName: 'ro', password: 'ro', Name: 'Rocio', email: 'rocio372@hotmail.com'}
    ];

    app.get('/api/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/api/login', function(req, res) {
        var userName = req.body.username,
            password = req.body.password;

        var loggingUser = _.find(users, function(user){
           return user.userName === userName && user.password === password;  
        });

        if (!loggingUser) return res.sendStatus(401);

        var user = {
            id: loggingUser.id, 
            name: loggingUser.Name,
            userName: loggingUser.userName,
            email: loggingUser.email
        };
        var token = jwt.sign(user, config.jwtSecretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION });
        return res.json({token:token, user: user, authType: 'app'});
    });
    
    app.post('/api/loginFb', function (req, res) {
        var email = req.body.email;
        
        var loggingUser = _.find(users, function (user) {
            return user.email === email;
        });
        
        if (!loggingUser) return res.sendStatus(401);
        
        var user = {
            id: loggingUser.id, 
            name: loggingUser.Name,
            userName: loggingUser.userName,
            email: loggingUser.email            
        };
        var token = jwt.sign(user, config.jwtSecretToken, { expiresIn: tokenManager.TOKEN_EXPIRATION });
        return res.json({ token: token, user: user, authType: 'fb' });
    });

    app.post('/api/logout', function(req, res){
        if (req.user) {
            tokenManager.expireToken(req.headers);
            delete req.user;
            res.sendStatus(200);
        }
        else
        {
            return res.sendStatus(401);
        }
    });
};