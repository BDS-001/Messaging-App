const validateRequest = require('../middleware/validateRequest');

//controllers
const userController = require('../controllers/userController');
const authController = require('../controllers/authController');
const chatController = require('../controllers/chatController');
const messageController = require('../controllers/messageController');
const contactController = require('../controllers/contactController')

const router = require("express").Router();

//auth
router.get('/users/auth', authController.getCurrentUser);
router.post('/users/login', validateRequest('auth', 'login'), authController.getCurrentUser);

//user
router.get('/users/:id', validateRequest('user', 'get'), userController.getUserById);
router.post('/users', validateRequest('user', 'create'), userController.createUser);
router.put('/users/:id', authenticate, validateRequest('user', 'update'), userController.updateUser);
router.delete('/users', authenticate, userController.deleteUser);
router.get('/users/find/:username', authenticate, validateRequest('user', 'findUser'), userController.getUserByUsername);

//chat
router.get('/chats', authenticate, chatController.getUserChats);
router.get('/chats/:chatId', authenticate, validateRequest('chat', 'get'), chatController.getChatMessages);
router.post('/chats', authenticate, validateRequest('chat', 'create'), chatController.createChat);
router.put('/chats/:chatId', authenticate, validateRequest('chat', 'update'), chatController.updateChat);
router.post('/chats/:chatId/leave', authenticate, validateRequest('chat', 'leave'), chatController.leaveChat);
router.post('/chats/:chatId/clear', authenticate, validateRequest('chat', 'clear'), chatController.clearChatHistory);
router.post('/chats/:chatId/users', authenticate, validateRequest('chat', 'addUser'), chatController.addUserToChat);
router.delete('/chats/:chatId/users/:userId', authenticate, validateRequest('chat', 'removeUser'), chatController.removeUserFromChat);

//message
router.post('/messages', authenticate, validateRequest('message', 'create'), messageController.createMessage);
router.put('/messages/:id', authenticate, validateRequest('message', 'update'), messageController.updateMessage);
router.delete('/messages/:id', authenticate, validateRequest('message', 'get'), messageController.deleteMessage);

//contacts
router.get('/contacts', authenticate, contactController.getUserContacts);
router.post('/contacts', authenticate, validateRequest('contact', 'add'), contactController.addContact);
router.put('/contacts/:contactId', authenticate, validateRequest('contact', 'update'), contactController.updateContact);
router.delete('/contacts/:contactId', authenticate, contactController.removeContact);


module.exports = router