/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    window.app = angular.module('workerpal',
        ['ui.router'])
    .config(['$locationProvider', function($locationProvider){
        $locationProvider.html5Mode(true);
    }]);
}(window));

