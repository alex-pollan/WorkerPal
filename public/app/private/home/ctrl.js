/**
 * Created by Alex on 9/23/2015.
 */
(function(window){
    'use strict';

    window.app.config(['$stateProvider', function($stateProvider) {
        $stateProvider.state('private.home', {
            url: '/',
            templateUrl: 'app/private/home/view.html',
            controller: 'PrivateHomeController'
        });
    }])
    .controller('PrivateHomeController', ['$scope', function($scope){
        //TODO: Prevent non logged access to private area
        $scope.user = { name: '[The logged user name goes here]' };
    }]);
})(window);
