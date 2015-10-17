/**
 * Created by Alex on 9/26/2015.
 */
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