/**
 * Created by Alex on 9/26/2015.
 */
var _ = require('lodash');
//var config = require('./config/config');
//var tokenManager = require('./config/tokenManager');

module.exports = function UsersApi(app, db) {
    
    app.get('/api/loggedin', function(req, res) {
        res.send(req.isAuthenticated() ? req.user : '0');
    });

    app.post('/api/login', function(req, res) {
        var userName = req.body.username,
            password = req.body.password;

        var membership = require("../membership")({db: db});
        
        membership.authenticate(userName, password, function(err, authInfo){
            if (err) {
                return res.sendStatus(401);
            }
            
            return res.json({token:authInfo.token, user: authInfo.user, authType: 'app'});
        });
    });
    
    // app.post('/api/loginFb', function (req, res) {
    // });

    app.post('/api/logout', function(req, res){
        if (req.user) {
            //membership should do this tokenManager.expireToken(req.headers);
            delete req.user;
            res.sendStatus(200);
        }
        else
        {
            return res.sendStatus(401);
        }
    });
};