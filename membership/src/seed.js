var UserRepository = require("./user-data");
//var async = require('async');

var seed = function(db, done){
    var userRepo = UserRepository(db);
  
    var user = [
        {
            id: '1',
            name: 'alex',
            email: 'alexpollan@yahoo.com',
            password: 'alex'
        }
    ]; 
    
    userRepo.create(user, function(err){
        done(err);
    });
};

module.exports = seed; 
