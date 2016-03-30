var mongoose = require("mongoose");
var UserData = require("../user-data");
var Logger = require("../logger");

var Helper = function() {
    var db,
        userData,
        logger;
    
    return {
        connect: connect,
        disconnect: disconnect,
        seed: seed
    };
    
    function connect(cb){
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
    
    function disconnect(cb){
        db.close(function(err){
            cb(err);
        });
    };
    
    function seed(cb) {
        var user = {id: "id", name: "user@mail.com", password: "pswd", email: "user@mail.com"};
        userData.create(user, function(err){
            cb(err);
        });
    };
};

module.exports = new Helper();
