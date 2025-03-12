const validateRequest = require('../middleware/validateRequest');
const isAuthenticated = require('../middleware/isAuthenticated')

//controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const messageController = require('../controllers/messageController');
const contactController = require('../controllers/contactController')

const router = require("express").Router();

//auth
router.get('/users/auth', isAuthenticated, authController.getCurrentUser);
router.post('/users/login', validateRequest('auth', 'login'), authController.login);

//user
router.get('/users/:id', validateRequest('user', 'get'), userController.getUserById);
router.post('/users', validateRequest('user', 'create'), userController.createUser);
router.put('/users/:id', isAuthenticated, validateRequest('user', 'update'), userController.updateUser);
router.delete('/users', isAuthenticated, userController.deleteUser);
router.get('/users/find/:username', isAuthenticated, validateRequest('user', 'findUser'), userController.getUserByUsername);

//chat
router.get('/chats', isAuthenticated, chatController.getUserChats);
router.get('/chats/:chatId', isAuthenticated, validateRequest('chat', 'get'), chatController.getChatMessages);
router.post('/chats', isAuthenticated, validateRequest('chat', 'create'), chatController.createChat);
router.put('/chats/:chatId', isAuthenticated, validateRequest('chat', 'update'), chatController.updateChat);
router.post('/chats/:chatId/leave', isAuthenticated, validateRequest('chat', 'leave'), chatController.leaveChat);
router.post('/chats/:chatId/clear', isAuthenticated, validateRequest('chat', 'clear'), chatController.clearChatHistory);
router.put('/chats/:chatId/users/:userId', isAuthenticated, validateRequest('chat', 'addUser'), chatController.addUserToChat);
router.delete('/chats/:chatId/users/:userId', isAuthenticated, validateRequest('chat', 'removeUser'), chatController.removeUserFromChat);

//message
router.post('/messages', isAuthenticated, validateRequest('message', 'create'), messageController.createMessage);
router.put('/messages/:id', isAuthenticated, validateRequest('message', 'update'), messageController.updateMessage);
router.delete('/messages/:id', isAuthenticated, validateRequest('message', 'get'), messageController.deleteMessage);

//contacts
router.get('/contacts', isAuthenticated, contactController.getUserContacts);
router.post('/contacts', isAuthenticated, validateRequest('contact', 'add'), contactController.addContact);
router.put('/contacts/:contactId', isAuthenticated, validateRequest('contact', 'update'), contactController.updateContact);
router.delete('/contacts/:contactId', isAuthenticated, contactController.removeContact);


module.exports = router