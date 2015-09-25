/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('login', {
            url: '/',
            templateUrl: 'app/login/view.html',
            controller: 'LoginController'
        });
    }])
    .controller('LoginController', ['$scope', function($scope){
        $scope.doLogin = function() {
            //TODO:
        };
    }]);
})(window);
