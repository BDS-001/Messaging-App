const passport = require('passport');

function isAuthenticated(req, res, next) {
      passport.authenticate('jwt', { session: false }, (err, user, info) => {
        if (err) {
            console.error('Authentication error:', err);
            return next(err);
        }
  
        if (!user) {
            return res.status(401).json({ error: 'Unauthorized - Invalid or missing token' });
        }

        req.user = user;
        next();
      })(req, res, next); 
};
  
  module.exports = isAuthenticated;