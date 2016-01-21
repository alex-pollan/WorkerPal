const EventEmitter = require('events');
var assert = require("assert");
const util = require('util');

var Authentication = function(userRepository) {
    assert(userRepository != null);

    var _this = this;

    var continueWith = null;
    
    EventEmitter.call(this);

    //find user
    //check password
    //save login information (lastTime, count, etc)
    //log
    //return user

    var authenticate = function(userName, password, cb) {
        continueWith = cb;
        _this.emit('authentication-start', userName, password);
    };
    
    var findUser = function(userName, password) {
        userRepository.readByUserName(userName, function(err, user){
            if (err) {
                _this.emit('username-ko');
                return;
            }
            
            _this.emit('username-ok', user, password);
        });
    };
    
    var notifyUserNotFound = function() {
        _this.emit('authentication-failed', 'User name not found');
        continueWith(new Error('User name not found'));
    };
    
    var verifyPassword = function(user, password) {
        userRepository.verifyPassword(password, user.password, function(err, verified){
            if (err) {
                _this.emit('password-ko');
                return;
            }

            if (verified) {
                _this.emit('password-ok', user);
            }
            else {
                _this.emit('password-ko');
            }
        });
    };
    
    var setUser = function(user) {
        _this.emit('authenticated', user);
        continueWith(null, user);
    };
    
    var notifyInvalidPassword = function() {
        _this.emit('not-authenticated');
        continueWith(new Error('Invalid password'));
    };

    _this.on('authentication-start', findUser)
    _this.on('username-ko', notifyUserNotFound);
    _this.on('username-ok', verifyPassword);
    _this.on('password-ok', setUser);
    _this.on('password-ko', notifyInvalidPassword);

    return {
        authenticate: authenticate
    };
};

util.inherits(Authentication, EventEmitter);

module.exports = Authentication;
