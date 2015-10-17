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
                            var authInfo = data.data;
                            user.id = authInfo.user.id;
                            user.userName = authInfo.user.userName;
                            user.Name = authInfo.user.name;                            
                            user.isAuthenticated = true;
                            $window.sessionStorage.token = authInfo.token;
                            deferred.resolve(); 
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