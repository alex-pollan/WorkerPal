var service = require("./service");
var Authentication = require("./authentication");

module.exports = function(app, db) {
    return service({app: app, auth: new Authentication(db)});
};
