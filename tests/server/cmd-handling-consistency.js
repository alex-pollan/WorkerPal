var http = require('http');
var async = require('async');
var uuid = require('node-uuid');

var login = function (username, password, callback) {    
    var postData = JSON.stringify({
        username: 'alex',
        password: 'alex'
    });

    var req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: '/api/login',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length
        }
    }, function (res) {
        var err;
        if (res.statusCode !== 200) {
            callback(new Error('Login error: ' + res.statusCode));
            return;
        }
        
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            callback(null, JSON.parse(data).token);
        });
    });

    req.write(postData);
    req.end();
};

var createProject = function (name, description, authorizationToken, callback) {
    var aggregateId = uuid.v4();
    var putData = JSON.stringify({ id: aggregateId, name: name, description: description });
    
    var req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: '/api/projects',
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': putData.length,
            'Authorization': 'Bearer ' + authorizationToken
        }
    }, function (res) {
        var err;
        if (res.statusCode !== 200) {
            callback(new Error(res));
            return;
        }
        
        callback(null, aggregateId, authorizationToken);
    });
    
    req.write(putData);
    req.end();
};

var changeNameToProject = function (aggregateId, newName, expectedVersion, authorizationToken, callback) {
    var postData = JSON.stringify({ id: aggregateId, name: newName, expectedVersion: expectedVersion });
    
    var req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: '/api/projects/changename',
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Content-Length': postData.length,
            'Authorization': 'Bearer ' + authorizationToken
        }
    }, function (res) {       
                
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });

        res.on('end', function () {
            var err;
            if (res.statusCode !== 200) {
                callback(new Error(data));
                return;
            }
            callback(null, data);
        });
    });
    
    req.write(postData);
    req.end();
};

var getLastVersion = function (aggregateId, authorizationToken, callback) {
    var req = http.request({
        hostname: 'localhost',
        port: 8080,
        path: '/api/projects/' + aggregateId,
        method: 'GET',
        headers: {           
            'Authorization': 'Bearer ' + authorizationToken
        }
    }, function (res) {
        
        res.setEncoding('utf8');
        var data = '';
        res.on('data', function (chunk) {
            data += chunk;
        });
        res.on('end', function () {
            var err;
            if (res.statusCode !== 200) {
                callback(new Error(res));
                return;
            }
            callback(null, JSON.parse(data).version);
        });
    });
    
    req.end();
};

var tryToBlowUpCommandHandling = function (aggregateId, authorizationToken, mainCallback) {
    var changeNameXTimes = function (baseNewName, times, changeNameCallback) {        
        var count = 0;
        var expectedVersion = 0;
        
        async.whilst(
            function () { return count < times; },
            function (whilstCallback) {
                changeNameToProject(aggregateId, baseNewName + '_' + count, expectedVersion, authorizationToken, function (err) {
                    if (!err) {
                        expectedVersion++;
                        count++;
                        whilstCallback(null);
                    }
                    else if (err.message === 'ConcurrencyException') {
                        getLastVersion(aggregateId, authorizationToken, function (err2, version) {
                            expectedVersion = version;
                            whilstCallback(err2);
                        });
                    }
                    else {
                        whilstCallback(err);
                    }
                });
            },
            function (err) {
                changeNameCallback(err);
            }
        );
    };
    
    var tasks = [
        function (callback) {
            changeNameXTimes('Name changer 1', 100, callback);
        },
        function (callback) {
            changeNameXTimes('Name changer 2', 100, callback);
        },
        function (callback) {
            changeNameXTimes('Name changer 3', 200, callback);
        }
    ];

    async.parallel(tasks, function (err) { 
        mainCallback(err);
    });
};

async.waterfall([
    function (callback) {
        login('alex', 'alex', callback);
    },
    function (authorizationToken, callback) {
        createProject('Project 1', 'Project to try to blow the command handling', authorizationToken, callback);
    },
    function (aggregateId, authorizationToken, callback) {
        tryToBlowUpCommandHandling(aggregateId, authorizationToken, callback);
    }
], function (err, result) {
    if (err) {
        console.error(err);
        return;
    }
    
    console.log('Done!');
});
