/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app = angular.module('workerpal',
        ['ui.router', 'ngResource'])
    .config(['$urlRouterProvider', '$stateProvider', '$httpProvider',
            function($urlRouterProvider, $stateProvider, $httpProvider){

        $httpProvider.interceptors.push('securityInterceptor');

        $urlRouterProvider.otherwise('/');

        $stateProvider
        .state('private', {
            url: '/private',
            template: '<ui-view></ui-view>',
            isAbstract: true
        });
    }]);
}(window));

