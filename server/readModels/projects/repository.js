var Datastore = require('nedb');
var _ = require("lodash");

var Repository = function (config) {
    var db = new Datastore({ filename: config.nedb.readModel, autoload: true });

    return {
        upsert: function (id, project, callback) {
            db.update({ $and : [{ type: 'project', id: id }] }, _.merge(project, { type: 'project'}), { upsert: true }, 
            function (err, numReplaced, upsert) {
                callback(err);
            });
        },
        update: function (id, dataToSet, callback) { 
            db.update({ $and : [{ type: 'project', id: id }] }, { $set: dataToSet }, {}, 
            function (err, numReplaced, upsert) {
                callback(err);
            });
        },
        "get": function (id, userId, callback) {
            db.findOne({ $and : [{ type: 'project', userId: userId, id: id}] }, function (err, doc) {
                callback(err, doc);
            });  
        },
        query: function (query, callback){
            db.find({ $and : [_.merge(query, { type: 'project' })] }, function (err, docs) {
                callback(err, docs);
            });    
        }
    };
};

module.exports = Repository;