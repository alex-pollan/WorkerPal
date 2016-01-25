var mongoose = require("mongoose");

var Log = function() {
}

Log.Model = mongoose.model('Log', mongoose.Schema({
    type: 'string',
    message: 'string',
    details: 'string',
    timestamp: { type : Date, default: Date.now }
}));

module.exports = Log;
