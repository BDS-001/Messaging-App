const { matchedData } = require('express-validator');
const chatQueries = require('../prisma/queries/chatQueries');
const httpStatusCodes = require('../path/to/httpStatusCodes');

async function getChatMessages(req, res, next) {
    try {
        const { chatId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userId = req.user.id
        const chat = await chatQueries.getChatWithMessages(chatId, userId);
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Chat messages retrieved successfully',
            data: chat
        });  
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving chat messages',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function getUserChats(req, res, next) {
    try {
        const userId = req.user.id;
        const chats = await chatQueries.getUserChats(userId);
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User chats retrieved successfully',
            data: chats
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving user chats',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function createChat(req, res, next) {
    try {
        const userId = req.user.id;
        const chatData = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        if (!chatData.participantIds.includes(userId)) {
            chatData.participantIds.push(userId);
        }
        
        const chat = await chatQueries.createChat(chatData);
        
        return res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: 'Chat created successfully',
            data: chat
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while creating the chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function updateChat(req, res, next) {
    try {
        const { chatId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userId = req.user.id;
        const { name } = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        // Check if user is a participant
        const isParticipant = await chatQueries.isUserParticipantInChat(userId, chatId);
        
        if (!isParticipant) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not a participant in this chat'
            });
        }
        
        const chat = await chatQueries.updateChat(chatId, name);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Chat updated successfully',
            data: chat
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating the chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

module.exports = { getChatMessages };