const { param, body } = require('express-validator');

const chatValidators = {
    get: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim()
    ],
    create: [
        body('name')
            .exists()
            .withMessage('Chat name is required')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Chat name must be between 1 and 100 characters'),
        
        body('type')
            .exists()
            .withMessage('Chat type is required')
            .isIn(['DIRECT', 'GROUP'])
            .withMessage('Chat type must be either DIRECT or GROUP'),
        
        body('participantIds')
            .exists()
            .withMessage('Participant IDs are required')
            .isArray()
            .withMessage('Participant IDs must be an array')
            .custom(value => {
                if (value.length === 0) {
                    throw new Error('At least one participant is required');
                }
                return true;
            })
    ],
    update: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim(),
        
        body('name')
            .exists()
            .withMessage('Chat name is required')
            .trim()
            .isLength({ min: 1, max: 100 })
            .withMessage('Chat name must be between 1 and 100 characters')
    ],
    leave: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim()
    ],
    clear: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim()
    ],
    addUser: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim(),
        
        body('userId')
            .exists()
            .withMessage('User ID is required')
            .isInt()
            .withMessage('User ID must be a number')
    ],
    removeUser: [
        param('chatId')
            .exists()
            .withMessage('Chat ID is required')
            .isInt()
            .withMessage('Chat ID must be a number')
            .trim(),
        
        param('userId')
            .exists()
            .withMessage('User ID is required')
            .isInt()
            .withMessage('User ID must be a number')
            .trim()
    ]
};

module.exports = chatValidators;