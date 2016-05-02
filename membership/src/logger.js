var LogEntry = require("./models/Log");

var Logger = function(db) {
    
    var Model = LogEntry.Model;
    
    var log = function(message, details, cb) {
        var model = new Model({type: 'info', message: message, details: details});
        
        model.save(function (err, created) {
            cb(err);
        });
    };
    
    var removeAll = function(cb) {
        Model.remove({}, function(err){
            cb(err);
        });
    };
    
    return {
        log: log,
        removeAll: removeAll
    };
};

module.exports = Logger;