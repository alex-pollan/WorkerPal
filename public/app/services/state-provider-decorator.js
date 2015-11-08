(function (window) {
    'use strict';
    
    window.app.provider('authState', ['$stateProvider',  
        function ($stateProvider) {
            var provider = this;
            
            this.$get = function () {
                return provider;
            };
            
            this.state = function (name, options) {
                options.resolve = options.resolve || {};
                options.resolve.authorized = ['authorization', function (authorization) {
                        return authorization.authorize();
                    }];
                
                $stateProvider.state(name, options);
            };
            
            return provider;
        }]);
})(window);