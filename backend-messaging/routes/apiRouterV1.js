const validateRequest = require('../middleware/validateRequest')

//controllers
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = require("express").Router();

//auth
router.get('/users/auth', authController.getCurrentUser)
router.post('/users/login', validateRequest('auth', 'login'), authController.getCurrentUser)


module.exports = router