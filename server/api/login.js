/**
 * Created by Alex on 9/26/2015.
 */
var jwt = require('jsonwebtoken');
var config = require('../config/config');
var tokenManager = require('../config/tokenManager');

module.exports = function UsersApi(app) {

    // route to test if the user is logged in or not
    app.get('/api/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    // route to log in
    app.post('/api/login', function(req, res) {
        var username = req.body.username,
            password = req.body.password;

        if (username !== 'alex') return res.send(401);
        if (password !== 'alex') return res.send(401);

        var user = {
            name: 'Alex',
            username: 'alex'
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