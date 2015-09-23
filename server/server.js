/**
 * Created by Alex on 9/21/2015.
 */

var express = require('express');
var app = express();

app.use(express.static('public'));
app.use('/vendor', express.static('bower_components'));

require('./api/users')(app, '/api');

var server = app.listen(8080, function () {
    var host = server.address().address;
    var port = server.address().port;

    console.log('App listening at http...');
});
