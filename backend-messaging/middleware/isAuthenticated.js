const passport = require('passport');
const httpStatusCodes = require('../utils/httpStatusCodes');

function isAuthenticated(req, res, next) {
  passport.authenticate('jwt', { session: false }, (err, user, info) => {
      if (err) {
          console.log(err);
          return res.status(httpStatusCodes.INTERNAL_SERVER_ERROR).json({
              success: false,
              message: err.message || 'An authentication error occurred',
              error: process.env.NODE_ENV === 'development' ? err : undefined
          });
      }

      if (!user) {
          return res.status(httpStatusCodes.UNAUTHORIZED).json({
              success: false,
              message: 'Invalid or missing token'
          });
      }

      req.user = user;
      next();
  })(req, res, next); 
};
  
  module.exports = isAuthenticated;