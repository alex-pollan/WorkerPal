(function (window) {
    'use strict';
    
    window.app.service('projectsService', ['$http', '$q', 'user',
        function ($http, $q, user) {
            return {
                list: function () {
                    var deferred = $q.defer();
                    
                    $http.get('api/projects').then(function (response) {
                        deferred.resolve(response.data);
                    }, function (response) {
                        deferred.reject();
                    });
                    
                    return deferred.promise;
                }
            };
        }
    ]);
    
})(window);