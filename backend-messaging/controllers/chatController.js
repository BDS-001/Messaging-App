const { matchedData } = require('express-validator');
const chatQueries = require('../prisma/queries/chatQueries');
const httpStatusCodes = require('../utils/httpStatusCodes');

async function getChatMessages(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving chat messages',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function getUserChats(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving user chats',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function createChat(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while creating the chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function updateChat(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating the chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function addUserToChat(req, res) {
    try {
        const { chatId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const { userId } = matchedData(req, { locations: ['body'], onlyValidData: true });
        const currentUserId = req.user.id;
        
        // Check if current user is a participant
        const isParticipant = await chatQueries.isUserParticipantInChat(currentUserId, chatId);
        
        if (!isParticipant) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not a participant in this chat'
            });
        }
        
        const participant = await chatQueries.addUserToChat(chatId, userId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User added to chat successfully',
            data: participant
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while adding user to chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function removeUserFromChat(req, res) {
    try {
        const { chatId, userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const currentUserId = req.user.id;
        
        // Check if current user is a participant
        const isParticipant = await chatQueries.isUserParticipantInChat(currentUserId, chatId);
        
        if (!isParticipant) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not a participant in this chat'
            });
        }

        if (userId === currentUserId) {
            return res.status(httpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'To leave a chat, use the leave chat endpoint'
            });
        }
        
        // Allow users to remove themselves or others (in a real app, you might want to restrict this)
        await chatQueries.removeUserFromChat(chatId, userId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User removed from chat successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while removing user from chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function leaveChat(req, res) {
    try {
        const { chatId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userId = req.user.id;
        
        // Check if user is a participant
        const isParticipant = await chatQueries.isUserParticipantInChat(userId, chatId);
        
        if (!isParticipant) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not a participant in this chat'
            });
        }
        
        await chatQueries.removeUserFromChat(chatId, userId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Successfully left the chat'
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while leaving the chat',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function clearChatHistory(req, res) {
    try {
        const { chatId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userId = req.user.id;
        
        // Check if user is a participant
        const isParticipant = await chatQueries.isUserParticipantInChat(userId, chatId);
        
        if (!isParticipant) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not a participant in this chat'
            });
        }
        
        await chatQueries.clearChatHistory(chatId, userId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Chat history cleared successfully'
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while clearing chat history',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

module.exports = { 
    getChatMessages, 
    getUserChats, 
    createChat, 
    updateChat, 
    addUserToChat,
    removeUserFromChat,
    clearChatHistory,
    leaveChat
};