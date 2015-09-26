/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app.config(['$stateProvider', function($stateProvider){
        $stateProvider.state('home', {
            url: '/',
            templateUrl: 'app/home/view.html',
            controller: 'HomeController'
        });
    }])
    .controller('HomeController', ['$scope', function($scope){

    }]);
})(window);
