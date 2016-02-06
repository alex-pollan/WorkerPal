var mongoose = require("mongoose");

var Model = mongoose.model('User', mongoose.Schema({
    id: 'string',
    name: 'string',
    email: 'string',
    password: 'string',
    lastLoginDateTime: 'date',
    loginCount: 'number'
}));

module.exports = Model;
