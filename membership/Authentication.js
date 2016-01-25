const EventEmitter = require('events');
var assert = require("assert");
const util = require('util');

var Authentication = function(userRepository, logger) {
    assert(userRepository != null);
    assert(logger != null);

    var _this = this;

    var continueWith = null;
    
    EventEmitter.call(this);

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
    
    var notifyInvalidPassword = function() {
        _this.emit('not-authenticated');
        continueWith(new Error('Invalid password'));
    };

    var updateStats = function(user) {
        user.lastLoginDateTime = new Date();
        user.loginCount = user.loginCount + 1;
        
        userRepository.update(user, function(err, updated) {
            if (err) {
                _this.emit('stats-update-ko', err);
                return;
            }
            
            _this.emit('stats-update-ok', user);  
        });
    };

    var log = function(user) {
        logger.log('User authenticated', user, function(err) {
            if (err) {
                _this.emit('log-ko', err);
                return;
            }
            _this.emit('log-ok', user);
        });
    };

    var authenticated = function(user) {
        _this.emit('authenticated', user);
        continueWith(null, user);
    };
    
    var notifyAuthenticationError = function(err) {
        _this.emit('not-authenticated', err);
        continueWith(err);
    };
    
    _this.on('authentication-start', findUser)
    _this.on('username-ko', notifyUserNotFound);
    _this.on('username-ok', verifyPassword);
    _this.on('password-ok', updateStats);
    _this.on('password-ko', notifyInvalidPassword);
    _this.on('stats-update-ok', log);
    _this.on('stats-update-ko', notifyAuthenticationError);
    _this.on('log-ok', authenticated);
    _this.on('log-ko', notifyAuthenticationError);

    return {
        authenticate: authenticate
    };
};

util.inherits(Authentication, EventEmitter);

module.exports = Authentication;
