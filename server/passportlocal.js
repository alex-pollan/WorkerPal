module.exports = function (passport) {
    var localStrategy = require('passport-local').Strategy;

    passport.use(new localStrategy(
        function(username, password, done) {
            if (username !== 'alex') return done(null, false, { message: 'Incorrect username.' });
            if (password !== 'alex') return done(null, false, { message: 'Incorrect password.' });
            
            return done(null, {
                name: 'Alex',
                username: 'alex'
            });
        }
    ));
};