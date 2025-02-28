const validateRequest = require('../middleware/validateRequest')

//controllers
const userController = require('../controllers/userController')
const authController = require('../controllers/authController')

const router = require("express").Router();

//auth
router.get('/users/auth', authController.getCurrentUser)
router.post('/users/login', validateRequest('auth', 'login'), authController.getCurrentUser)

//user
router.get('/users/:id', validateRequest('user', 'get'), userController.getUserById);
router.post('/users', validateRequest('user', 'create'), userController.createUser);
router.put('/users/:id', authenticate, validateRequest('user', 'update'), userController.updateUser);
router.delete('/users', authenticate, userController.deleteUser);


module.exports = router