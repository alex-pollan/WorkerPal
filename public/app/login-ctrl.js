/**
 * Created by Alex on 9/26/2015.
 */
(function(window){
    'use strict';

    window.app.controller('LoginPanelController', ['$scope','user', 'authentication',
        function($scope, user, authentication){

            $scope.user = user;

            $scope.logout = function(){
                authentication.logout();
            };
    }]);
})(window);