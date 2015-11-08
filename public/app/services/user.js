(function(window){
    'use strict';

    window.app.service('user', [
        function() {
            return {
                id: '',
                userName: '',
                Name: '',
                isAuthenticated: false
            };
        }
    ]);

})(window);