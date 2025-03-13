const { body, param } = require('express-validator');

const contactValidation = {
  add: [
    body('contactId')
      .isInt()
      .withMessage('Contact ID must be an integer')
      .toInt(),
    body('nickname')
      .optional()
      .isString()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Nickname cannot exceed 50 characters')
  ],
  
  update: [
    param('contactId')
      .isInt()
      .withMessage('Contact ID must be an integer')
      .toInt(),
    body('nickname')
      .isString()
      .trim()
      .isLength({ max: 50 })
      .withMessage('Nickname cannot exceed 50 characters')
  ],
  delete: [
    param('contactId')
      .isInt()
      .withMessage('Contact ID must be an integer')
      .toInt(),
  ]
};

module.exports = contactValidation;