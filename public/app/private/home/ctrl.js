(function (window) {
    'use strict';
    
    window.app.config(['authStateProvider', function (authState) {
            authState.state('private.home', {
                url: '/',
                templateUrl: 'app/private/home/view.html',
                controller: 'PrivateHomeController',
                resolve: {
                    projects: ['projectsService', function (projectsService) {
                            return projectsService.list();
                        }]
                }
            });
        }])
    .controller('PrivateHomeController', ['$scope', 'projects', 'authorized', function ($scope, projects, authorized) {
            $scope.projects = projects;
        }]);
})(window);
