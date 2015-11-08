/**
 * Created by Alex on 9/26/2015.
 */
(function(window){
    'use strict';

    window.app.controller('LoginPanelController', ['$scope','$state', 'user', 'authentication',
        function($scope, $state, user, authentication){
            $scope.user = user;

            $scope.logout = function(){
                authentication.logout();
                $state.go('home');
            };
    }]);

})(window);