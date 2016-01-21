var mongoose = require("mongoose");

var User = function(args) {
    args = args || {};
        
    this.id = args.id || "";
    this.name = args.name || "";
    this.password = args.password || "";
};

User.Model = mongoose.model('User', mongoose.Schema({
    id: 'string',
    name: 'string',
    password: 'string'
}));

module.exports = User;
