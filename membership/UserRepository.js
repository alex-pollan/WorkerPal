var User = require("./models/User");
var bcrypt = require('bcrypt');
var _ = require("lodash");

var UserRepository = function(db) {
    
    var Model = User.Model;
    
    var create = function(user, cb) {
        hashPassword(user.password, function(err, hash){
            if (err) {
                cb(err);
                return;
            }

            var plainPassword = user.password;
            user.password = hash;
            
            var userModel = new Model(user);
            
            userModel.save(function (err, createdUser) {
                //reset plain password
                user.password = plainPassword;
                cb(err, createdUser);
            });
        });
    };
    
    var hashPassword = function(password, cb){
        bcrypt.genSalt(10, function(err, salt) {
            if (err) {
                cb(err);
                return;
            }

            bcrypt.hash(password, salt, function(err, hash) {
                if (err) {
                    cb(err);
                    return;
                }

                cb(null, hash);
            });
        });
    };
   
    var verifyPassword = function(password, hash, cb) { 
        bcrypt.compare(password, hash, function(err, res) {
            cb(err, res);
        });
    };
    
    var read = function(id, cb){
        Model.findOne({id: id}, function(err, user){
            cb(err, user);
        });
    };
    
    var readByUserName = function(userName, cb){
        Model.findOne({name: userName}, function(err, user){
            cb(err, user);
        });
    };

    var update = function(user, cb){
        var doc = {};
        _.assign(doc, user);
        delete doc.password;
        Model.findOneAndUpdate({id: user.id}, {$set: doc}, function(err, updatedUser){
            cb(err, updatedUser);
        });
    };
    
    var removeAll = function(cb){
        Model.remove({}, function(err){
            cb(err);
        });
    };
    
    return {
        create: create,
        read: read,
        readByUserName: readByUserName,
        update: update,
        removeAll: removeAll,
        hashPassword: hashPassword,
        verifyPassword: verifyPassword
    };
};

module.exports = UserRepository;
