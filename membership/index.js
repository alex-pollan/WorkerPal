var Authentication = require("./Authentication");
var Logger = require("./Logger");
var UserRepository = require("./UserRepository");

var AuthenticationModule = function(db) {
    var api = {
        authenticate: null
    };
    
    api.authenticate = function(userName, password, cb) {
        var logger = new Logger(db);
        var userRepository = UserRepository(db);
        
        var auth = new Authentication(userRepository, logger);
        
        auth.authenticate(userName, password, function(err, user) {
            cb(err, user); 
        });
    };
    
    return api;
};

module.exports = AuthenticationModule;
