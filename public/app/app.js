/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app = angular.module('workerpal',
        ['ui.router', 'ngResource'])
    .config(['$locationProvider', '$stateProvider', function($locationProvider, $stateProvider){
        $locationProvider.html5Mode(true);
        
         $stateProvider.state('private', {
            url: '/private',
            template: '<ui-view></ui-view>',
            isAbstract: true
        });
    }]);
}(window));

