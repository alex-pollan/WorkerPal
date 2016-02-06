var service = require("./service");
var authentication = require("./authentication");

module.exports = function(app, db) {
    return service({app: app, auth: authentication(db)});
};
