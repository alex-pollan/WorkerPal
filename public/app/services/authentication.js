(function(window){
    'use strict';
    
    window.app.service('authentication', ['$http', '$q', '$window', 'user',
        function($http, $q, $window, user) {
            return {
                login: function(username, password){
                    var deferred = $q.defer();

                    $http
                        .post('api/login', {
                            username: username,
                            password: password
                        })
                        .then(function (data){
                            user.isAuthenticated = true;
                            $window.sessionStorage.token = data.token;
                            deferred.resolve(); //TODO: what to return here
                        }, function(response){
                            deferred.reject();
                        });

                    return deferred.promise;
                },
                logout: function(){
                    var that = this;

                    $http
                        .post('/api/logout')
                        .then(function (response){
                            user.isAuthenticated = false;
                            delete $window.sessionStorage.token;
                        }, function(response){
                        });
                }
            };
        }
    ]);
    
})(window);