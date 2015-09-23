/**
 * Created by Alex on 9/23/2015.
 */

module.exports = function UsersApi(app, baseUrl) {
    var relUrl = baseUrl + '/users';

    app.get(relUrl, function (req, res) {
        res.end('users  ssds');
    });

};