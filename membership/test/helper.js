var mongoose = require("mongoose");
var UserData = require("../user-data");
var Logger = require("../logger");

var Helper = function() {
    var db,
        userData,
        logger;
    
    var api = {
        connect: null,
        disconnect: null,
        seed: null
    };
    
    api.connect = function(cb){
        mongoose.connect("mongodb://localhost/test");
        
        db = mongoose.connection;
        
        db.on('error', function(err){
            console.error('connection error:' + err);
            cb(err);
        });
        
        db.once('open', function() {
            userData = UserData(db);
            logger = Logger(db);

            userData.removeAll(function(err){
                if (err) {
                    cb(err);
                    return;
                }
                
                logger.removeAll(function(err){
                    if (err) {
                        cb(err);
                        return;
                    }
                    
                    cb(null, db);
                });
            });
        });
    };
    
    api.disconnect = function(cb){
        db.close(function(err){
            cb(err);
        });
    };
    
    api.seed = function(cb) {
        var user = {id: "id", name: "user@mail.com", password: "pswd", email: "user@mail.com"};
        userData.create(user, function(err){
            cb(err);
        });
    };
    
    return api;
};

module.exports = new Helper();