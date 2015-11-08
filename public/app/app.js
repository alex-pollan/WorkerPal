(function (window) {
    'use strict';
    
    window.app = angular.module('workerpal',
        ['ui.router', 'ngResource'])
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider', 
        function ($urlRouterProvider, $stateProvider, $httpProvider) {
            
            $httpProvider.interceptors.push('securityInterceptor');
            
            $urlRouterProvider.otherwise('/');
            
            $stateProvider.state('private', {
                url: '/private',
                template: '<ui-view></ui-view>',
                isAbstract: true
            });
        }])
    .run(['$rootScope', 'authorization', function ($rootScope, authorization) {
            
            $rootScope.$on('$routeChangeStart', function (e, curr, prev) {
                if (prev.authorize) {
                    authorization.authorize();
                }
            });
        }]);
}(window));

