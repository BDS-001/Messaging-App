const { matchedData } = require('express-validator');
const messageQueries = require('../prisma/queries/messageQueries');
const httpStatusCodes = require('../path/to/httpStatusCodes');

async function createMessage(req, res, next) {
    try {
        const senderId = req.user.id;
        const messageData = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        messageData.senderId = senderId;
        
        const message = await messageQueries.createMessage(messageData);
        
        return res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: 'Message created successfully',
            data: message
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while creating the message',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function updateMessage(req, res, next) {
    try {
        const { id: messageId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const senderId = req.user.id;
        const messageData = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        const existingMessage = await messageQueries.getMessageById(messageId);
        
        if (!existingMessage) {
            return res.status(httpStatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        if (existingMessage.senderId !== senderId) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to update this message'
            });
        }
        
        const message = await messageQueries.updateMessage(messageId, messageData);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Message updated successfully',
            data: message
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating the message',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function deleteMessage(req, res, next) {
    try {
        const { id: messageId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const senderId = req.user.id;
        
        const existingMessage = await messageQueries.getMessageById(messageId);
        
        if (!existingMessage) {
            return res.status(httpStatusCodes.NOT_FOUND).json({
                success: false,
                message: 'Message not found'
            });
        }
        
        if (existingMessage.senderId !== senderId) {
            return res.status(httpStatusCodes.FORBIDDEN).json({
                success: false,
                message: 'You are not authorized to delete this message'
            });
        }
        
        await messageQueries.softDeleteMessage(messageId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Message deleted successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while deleting the message',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

module.exports = { createMessage, updateMessage, deleteMessage };