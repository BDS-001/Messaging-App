const { validationResult } = require('express-validator');
const userValidators = require('../validators/userValidator');
const authValidators = require('../validators/authValidator');
const chatValidators = require('../validators/chatValidator');
const contactValidators = require('../validators/contactValidator');
const messageValidators = require('../validators/messageValidator')

const validators = {
    user: userValidators,
    auth: authValidators,
    chat: chatValidators,
    contact: contactValidators,
    message: messageValidators
};

function validateRequest(resource, operation) {
    return [
      // Get all validations rules
      ...(validators[resource]?.[operation] || []),
      
      //check errors
      (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          return res.status(400).json({
            message: 'Validation error',
            errors: errors.array(),
            success: false,
          });
        }
        next();
      }
    ];
}

module.exports = validateRequest