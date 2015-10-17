/**
 * Created by Alex on 9/23/2015.
 */
(function (window) {
    'use strict';
    
    window.app.config(['$stateProvider', function ($stateProvider) {
            $stateProvider.state('private.home', {
                url: '/',
                templateUrl: 'app/private/home/view.html',
                controller: 'PrivateHomeController',
                resolve: {
                    projects: ['projectsService', function (projectsService) {
                            return projectsService.list();
                        }],
                    authorized: ['authorization', function (authorization) {
                            return authorization.authorize();
                        }]                   
                }
            });
        }])
    .controller('PrivateHomeController', ['$scope', 'projects', function ($scope, projects) {
            $scope.projects = projects;
        }]);
})(window);
