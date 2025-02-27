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

module.exports = { getChatMessages };