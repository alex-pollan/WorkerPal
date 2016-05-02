var UserData = require("./user-data");

var seed = function(db, done){
    userData = UserData(db);
    
    //TODO: set of users
    var user = {}; 
    
    userData.create(user, function(err){
        cb(err);
    });  
};

module.exports = seed; 
