var mongoose = require("mongoose");

var User = function(args) {
    args = args || {};
        
    this.id = args.id || "";
    this.name = args.name || "";
    this.password = args.password || "";
    this.loginCount = args.loginCount || "";
    this.lastLoginDateTime = args.lastLoginDateTime || "";
};

User.Model = mongoose.model('User', mongoose.Schema({
    id: 'string',
    name: 'string',
    password: 'string',
    lastLoginDateTime: 'date',
    loginCount: 'number'
}));

module.exports = User;
