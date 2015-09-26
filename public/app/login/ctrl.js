/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('login', {
            url: '/login',
            templateUrl: 'app/login/view.html',
            controller: 'LoginController'
        });
    }])
    .controller('LoginController', ['$scope', '$state', 'authentication', function($scope, $state, authentication){
        $scope.doLogin = function() {
            authentication.login($scope.login.username, $scope.login.password)
                .then(function(){
                    $state.go('private.home');
                }, function(){
                    $scope.loginErrorMessage = "Invalid username or password. Please, try again.";
                });
        };
    }]);
})(window);
