const { body, param } = require('express-validator');

const userValidators = {
    get: [
        param('id')
          .exists()
          .withMessage('User ID is required')
          .isInt()
          .withMessage('User ID must be a number')
          .trim()
      ],
    create: [
        // Username validation
        body('username')
          .trim()
          .notEmpty()
          .withMessage('Username is required')
          .isLength({ min: 3, max: 30 })
          .withMessage('Username must be between 3 and 30 characters')
          .matches(/^[a-zA-Z0-9_-]+$/)
          .withMessage('Username can only contain letters, numbers, underscores and hyphens')
          .custom(value => !/\s/.test(value))
          .withMessage('Username cannot contain spaces'),
      
        // Email validation  
        body('email')
          .trim()
          .notEmpty()
          .withMessage('Email is required')
          .isEmail()
          .withMessage('Must be a valid email address')
          .normalizeEmail(),
      
        // Password validation
        body('password')
          .notEmpty()
          .withMessage('Password is required')
          .isLength({ min: 8 })
          .withMessage('Password must be at least 8 characters long')
          .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
          .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
          .custom((value, { req }) => {
            // Ensure password doesn't contain username or parts of email
            const username = req.body.username?.toLowerCase();
            const emailName = req.body.email?.split('@')[0].toLowerCase();
            const lowercasePassword = value.toLowerCase();
            
            if (username && lowercasePassword.includes(username)) {
              throw new Error('Password cannot contain your username');
            }
            
            if (emailName && lowercasePassword.includes(emailName)) {
              throw new Error('Password cannot contain your email username');
            }
            
            return true;
          }),
        ],
        update: [
            // Validate URL parameter
            param('id')
              .exists()
              .withMessage('User ID is required')
              .isInt()
              .withMessage('User ID must be a number')
              .trim(),
            
            // Optional username validation
            body('username')
              .optional()
              .trim()
              .notEmpty()
              .withMessage('Username cannot be empty if provided')
              .isLength({ min: 3, max: 30 })
              .withMessage('Username must be between 3 and 30 characters')
              .matches(/^[a-zA-Z0-9_-]+$/)
              .withMessage('Username can only contain letters, numbers, underscores and hyphens')
              .custom(value => !/\s/.test(value))
              .withMessage('Username cannot contain spaces'),
        
            // Optional email validation
            body('email')
              .optional()
              .trim()
              .notEmpty()
              .withMessage('Email cannot be empty if provided')
              .isEmail()
              .withMessage('Must be a valid email address')
              .normalizeEmail(),
        
            // Optional password validation
            body('password')
              .optional()
              .notEmpty()
              .withMessage('Password cannot be empty if provided')
              .isLength({ min: 8 })
              .withMessage('Password must be at least 8 characters long')
              .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
              .withMessage('Password must contain at least one uppercase letter, one lowercase letter, one number and one special character')
              .custom((value, { req }) => {
                // Ensure password doesn't contain username or parts of email
                const username = req.body.username?.toLowerCase();
                const emailName = req.body.email?.split('@')[0].toLowerCase();
                const lowercasePassword = value.toLowerCase();
                if (username && lowercasePassword.includes(username)) {
                  throw new Error('Password cannot contain your username');
                }
                if (emailName && lowercasePassword.includes(emailName)) {
                  throw new Error('Password cannot contain your email username');
                }
                return true;
              })
          ],
          findUser: [
            param('username')
              .isString()
              .trim()
              .notEmpty()
              .withMessage('Username is required')
              .isLength({ min: 3, max: 30 })
              .withMessage('Username must be between 3 and 30 characters')
          ],
}

module.exports = userValidators