(function (window) {
    'use strict';
    
    window.app.run(['$rootScope', '$window', 'facebookService', 'config', 
        function ($rootScope, $window, facebookService, config) {
            
            $window.fbAsyncInit = function () {
                // Executed when the SDK is loaded
                
                FB.init({
                    appId: config.fbAppId, 
                    //Adding a Channel File improves the performance 
                    //of the javascript SDK, by addressing issues 
                    //with cross-domain communication in certain browsers. 
                    channelUrl: 'public/app/channel.html', 
                    //Set if you want to check the authentication status
                    //at the start up of the app 
                    status: true, 
                    //Enable cookies to allow the server to access 
                    //the session 
                    cookie: true, 
                    //Parse XFBML
                    xfbml: true
                });
                
                facebookService.watchAuthenticationStatusChange();
            };
        }]);

})(window);

(function (d) {
    // load the Facebook javascript SDK
    
    var js, 
        id = 'facebook-jssdk', 
        ref = d.getElementsByTagName('script')[0];
    
    if (d.getElementById(id)) {
        return;
    }
    
    js = d.createElement('script');
    js.id = id;
    js.async = true;
    js.src = "//connect.facebook.net/en_US/all.js";
    
    ref.parentNode.insertBefore(js, ref);

}(document));