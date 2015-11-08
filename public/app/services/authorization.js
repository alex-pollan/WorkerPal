/**
 * Created by Alex on 9/26/2015.
 */
(function(window){
    'use strict';

    window.app.service('authorization', ['$q', '$state', '$timeout', '$window', '$log',
        function($q, $state, $timeout, $window, $log) {
            return {
                authorize: function(){
                    // Initialize a new promise
                    var deferred = $q.defer();

                    $timeout(function(){
                        if ($window.sessionStorage.token) {
                            $log.info('Authorized');
                            deferred.resolve();
                        }
                        else {
                            deferred.reject();
                            $log.info('Unauthorized');
                            $state.go('login');
                        }
                    }, 10);

                    return deferred.promise;
                }
            };
        }
    ]);

})(window);