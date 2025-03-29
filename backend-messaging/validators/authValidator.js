const { body } = require('express-validator');

const authValidators = {
    login: [
        body('email')
        .exists().withMessage('Email is required')
        .trim()
        .notEmpty().withMessage('Email cannot be empty')
        .isEmail().withMessage('Must be a valid email address')
        .normalizeEmail(),
    
    body('password')
        .exists().withMessage('Password is required')
        .notEmpty().withMessage('Password cannot be empty')
      ],
    resetPassword: [
        body('currentPassword')
            .exists().withMessage('Password is required')
            .notEmpty().withMessage('Password cannot be empty'),
        body('newPassword')
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
    ]
}

module.exports = authValidators