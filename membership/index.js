var service = require("./src/service");
var Authentication = require("./src/authentication");
var seed = require("./src/seed");

module.exports = {
    init : function(app, db) {
        return service({app: app, auth: new Authentication(db)});
    },
    seed: seed
};
