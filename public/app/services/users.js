(function(window){
    'use strict';
    
    window.app.service('users', ['$resource',
        function($resource) {
            return $resource('api/users');
        }
    ]);
    
})(window);