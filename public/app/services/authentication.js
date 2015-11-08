(function (window) {
    'use strict';
    
    window.app.service('authentication', ['$http', '$q', '$window', 'user',
        function ($http, $q, $window, user) {
            
            function setLoggedInfo(authInfo) {
                user.id = authInfo.user.id;
                user.userName = authInfo.user.userName;
                user.name = authInfo.user.name;
                user.authType = authInfo.authType;
                user.isAuthenticated = true;
                $window.sessionStorage.token = authInfo.token;
            }
            
            function cleanLoggedInfo(){
                user.id = '';
                user.userName = '';
                user.name = '';
                user.authType = '';
                user.isAuthenticated = false;
                delete $window.sessionStorage.token;
            }

            return {
                login: function (username, password) {
                    var deferred = $q.defer();
                    
                    $http.post('api/login', {
                        username: username,
                        password: password
                    })
                    .then(function (data) {
                        var authInfo = data.data;
                        setLoggedInfo(authInfo);
                        deferred.resolve();
                    }, function (response) {
                        deferred.reject();
                    });
                    
                    return deferred.promise;
                },
                loginFb: function (email) {
                    var deferred = $q.defer();
                    
                    $http.post('api/loginFb', {
                        email: email
                    })
                    .then(function (data) {
                        var authInfo = data.data;
                        setLoggedInfo(authInfo);
                        deferred.resolve();
                    }, function (response) {
                        deferred.reject();
                    });
                    
                    return deferred.promise;
                },
                logout: function () {
                    var that = this;
                    
                    $http.post('api/logout').then(function (response) {
                        cleanLoggedInfo();
                    }, function (response) {
                    });
                }
            };
        }
    ]);
    
})(window);