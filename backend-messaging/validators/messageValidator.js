const { body, param } = require('express-validator');

const messageValidators = {
    get: [
        param('id')
            .exists()
            .withMessage('Message ID is required')
            .isInt()
            .withMessage('Message ID must be a number')
            .trim()
    ],
    create: [
        body('content')
            .exists()
            .withMessage('Message content is required')
            .trim()
            .notEmpty()
            .withMessage('Message content cannot be empty')
            .isLength({ max: 1000 })
            .withMessage('Message content cannot exceed 1000 characters'),
        
        body('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
    ],
    update: [
        param('id')
            .exists()
            .withMessage('Message ID is required')
            .isInt()
            .withMessage('Message ID must be a number')
            .trim(),
            
        body('content')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Message content cannot be empty if provided')
            .isLength({ max: 1000 })
            .withMessage('Message content cannot exceed 1000 characters')
    ]
};

module.exports = messageValidators;