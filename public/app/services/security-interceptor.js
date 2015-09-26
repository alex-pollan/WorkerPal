/**
 * Created by Alex on 9/26/2015.
 */
(function(window){
    'use strict';

    window.app.factory('securityInterceptor', ['$q', '$window', '$location', 'user',
        function($q, $window, $location, user) {
            return {
                request: function (config) {
                    config.headers = config.headers || {};
                    if ($window.sessionStorage.token) {
                        config.headers.Authorization = 'Bearer ' + $window.sessionStorage.token;
                    }
                    return config;
                },

                requestError: function(rejection) {
                    return $q.reject(rejection);
                },

                /* Set Authentication.isAuthenticated to true if 200 received */
                response: function (response) {
                    if (response != null
                            && response.status == 200
                            && $window.sessionStorage.token
                            && !user.isAuthenticated) {
                        user.isAuthenticated = true;
                    }
                    return response || $q.when(response);
                },

                /* Revoke client authentication if 401 is received */
                responseError: function(rejection) {
                    if (rejection != null
                            && rejection.status === 401
                            && ($window.sessionStorage.token || user.isAuthenticated)) {
                        delete $window.sessionStorage.token;
                        user.isAuthenticated = false;
                        $location.url("/login");
                    }

                    return $q.reject(rejection);
                }
            };
        }
    ]);

})(window);