(function (window) {
    'use strict';
    
    window.app.service('facebookService', ['$rootScope', '$q', '$state', 'authentication',
        function ($rootScope, $q, $state, authentication) {
            
            function getUserInfo() {
                var deferred = $q.defer();
                
                FB.api('/me', function (res) {
                    deferred.resolve(res);
                    //TODO: handle failure and reject promise
                });
                
                return deferred.promise;
            }
            
            function appLogout() {
                authentication.logout();
                $state.go('home');
            }
            
            return {
                watchAuthenticationStatusChange: function () {
                    var _this = this;
                    
                    FB.Event.subscribe('auth.authResponseChange', function (res) {
                        if (res.status === 'connected') {
                            getUserInfo().then(function (user) {
                                authentication.loginFb(user.email).then(function () {
                                    $rootScope.fbLoginError = false;
                                    $state.go('private.home');
                                }, function () {
                                    $rootScope.fbLoginError = true;
                                });
                            }, function () {
                                
                            });
                        } 
                        else {
                            appLogout();
                        }
                    });
                },
                
                logout: function () {
                    var deferred = $q.defer();
                    FB.logout(function (response) {
                        deferred.resolve(res);
                        //TODO: handle failure and reject promise
                    });
                    return deferred.promise;
                }
            };
        }
    ]);
})(window);