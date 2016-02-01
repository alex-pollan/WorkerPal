var Authentication = require("./Authentication");
var Logger = require("./Logger");
var UserRepository = require("./UserRepository");

var AuthenticationModule = function(args) {
    var db = args.db;
    
    if (!db) {
        throw new Error('Db connection expected');
    }
    
    var tokenExpiration = args.tokenExpiration || 3600;
    var tokenSecret = args.tokenSecret || 'sdf3d345ty4507kresax';
    
    var api = {
        authenticate: null
    };
    
    api.authenticate = function(userName, password, cb) {
        var logger = new Logger(db);
        var userRepository = UserRepository(db);
        
        var auth = new Authentication(userRepository, logger);
        
        auth.authenticate(userName, password, function(err, user) {
            if (err) {
                cb(err);
                return;
            }
            
            var jwt = require('jsonwebtoken');
            var token = jwt.sign(user, tokenSecret, { expiresIn: tokenExpiration });

            cb(null, {user: user, token: token}); 
        });
    };
    
    return api;
};

module.exports = AuthenticationModule;
