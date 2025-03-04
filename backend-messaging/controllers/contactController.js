const { matchedData } = require('express-validator');
const contactQueries = require('../prisma/queries/contactQueries');
const httpStatusCodes = require('../utils/httpStatusCodes');

async function getUserContacts(req, res, next) {
    try {
        const userId = req.user.id;
        const contacts = await contactQueries.getUserContacts(userId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Contacts retrieved successfully',
            data: contacts
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving contacts',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function addContact(req, res, next) {
    try {
        const userId = req.user.id;
        const { contactId, nickname } = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        // Prevent adding yourself as a contact
        if (userId === contactId) {
            return res.status(httpStatusCodes.BAD_REQUEST).json({
                success: false,
                message: 'You cannot add yourself as a contact'
            });
        }
        
        const contact = await contactQueries.addContact(userId, contactId, nickname);
        
        return res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: 'Contact added successfully',
            data: contact
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while adding contact',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function updateContact(req, res, next) {
    try {
        const userId = req.user.id;
        const { contactId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const { nickname } = matchedData(req, { locations: ['body'], onlyValidData: true });
        
        const contact = await contactQueries.updateContact(userId, contactId, nickname);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Contact updated successfully',
            data: contact
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating contact',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function removeContact(req, res, next) {
    try {
        const userId = req.user.id;
        const { contactId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        
        await contactQueries.removeContact(userId, contactId);
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'Contact removed successfully'
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while removing contact',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

module.exports = {
    getUserContacts,
    addContact,
    updateContact,
    removeContact
};