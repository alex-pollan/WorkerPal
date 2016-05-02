var bodyParser = require('body-parser');
var assert = require("assert");
var jwt = require('jsonwebtoken');

module.exports = function UsersApi(args) {
    var app = args.app;
    var auth = args.auth;
    
    assert(app);
    assert(auth);
    
    app.use(bodyParser.json());
    
    var tokenExpiration = args.tokenExpiration || 3600;
    var tokenSecret = args.tokenSecret || 'sdf3d345ty4507kresax';

    app.post('/api/auth/login', function(req, res) {
        var userName = req.body.username,
            password = req.body.password;

        auth.authenticate(userName, password, function(err, user){
            if (err) {
                return res.sendStatus(401);
            }

            if (!user) {
                return res.sendStatus(401);
            }
            
            var token = jwt.sign(user, tokenSecret, { expiresIn: tokenExpiration });

            return res.json({token:token, user: user, authType: 'app'});
        });
    });

    
    // app.get('/api/loggedin', function(req, res) {
    //     res.send(req.isAuthenticated() ? req.user : '0');
    // });

    // app.post('/api/login', function(req, res) {
    //     var userName = req.body.username,
    //         password = req.body.password;

    //     var membership = require("../membership")({db: db});
        
    //     membership.authenticate(userName, password, function(err, authInfo){
    //         if (err) {
    //             return res.sendStatus(401);
    //         }
            
    //         return res.json({token:authInfo.token, user: authInfo.user, authType: 'app'});
    //     });
    // });
    
    // // app.post('/api/loginFb', function (req, res) {
    // // });

    // app.post('/api/logout', function(req, res){
    //     if (req.user) {
    //         //membership should do this tokenManager.expireToken(req.headers);
    //         delete req.user;
    //         res.sendStatus(200);
    //     }
    //     else
    //     {
    //         return res.sendStatus(401);
    //     }
    // });
};