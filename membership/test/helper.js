var mongoose = require("mongoose");
var UserRepository = require("../UserRepository");
var Logger = require("../Logger");

var Helper = function() {
    var db;
    
    var api = {
        userRepository: null,
        logger: null,
        connect: null,
        createTestUser: null,
        disconnect: null
    };
    
    api.connect = function(cb){
        mongoose.connect("mongodb://localhost/test");
        
        db = mongoose.connection;
        
        db.on('error', function(err){
            console.error('connection error:' + err);
            cb(err);
        });
        
        db.once('open', function() {
            api.logger = new Logger(db);
            api.userRepository = UserRepository(db);
            
            api.logger.removeAll(function(err){
                if (err) {
                    cb(err);
                    return;
                }
                
                cb(null, db);
            });
        });
    };
    
    api.createTestUser = function(user, cb) {
        api.userRepository.removeAll(function(err){
            if (err) {
                cb(err);
                return;
            }
            
            api.userRepository.create(user, function(err, createdUser){
                cb(err, createdUser);
            });
        });
    };
    
    api.disconnect = function(cb){
        db.close(function(err){
            cb(err);
        });
    };
    
    return api;
};

module.exports = new Helper();