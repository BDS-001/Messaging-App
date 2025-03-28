const { body, param, query } = require('express-validator');

const messageValidators = {
    get: [
        param('id')
            .exists()
            .withMessage('Message ID is required')
            .isInt()
            .withMessage('Message ID must be a number')
            .toInt()
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
            .toInt()
    ],
    update: [
        param('id')
            .exists()
            .withMessage('Message ID is required')
            .isInt()
            .withMessage('Message ID must be a number')
            .toInt(),
            
        body('content')
            .optional()
            .trim()
            .notEmpty()
            .withMessage('Message content cannot be empty if provided')
            .isLength({ max: 1000 })
            .withMessage('Message content cannot exceed 1000 characters')
    ],
    getLatest: [
        param('chatId')
            .exists()
            .withMessage('Message ID is required')
            .isInt()
            .withMessage('Message ID must be a number')
            .toInt(),
  
        query('timestamp')
          .exists()
          .withMessage('timestamp is required')
          .isNumeric()
          .withMessage('timestamp must be a number')
          .toInt()
          .customSanitizer(value => {
            // Convert the numeric timestamp to a Date object for Prisma
            return new Date(value);
          })
          .custom((value) => {
            // Ensure timestamp is a valid date
            if (isNaN(value.getTime())) {
              throw new Error('timestamp must be a valid date timestamp');
            }
            return true;
          }),
      ]
};

module.exports = messageValidators;