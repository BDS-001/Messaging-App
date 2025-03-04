const { matchedData } = require('express-validator');
const userQueries = require('../prisma/queries/userQueries');
const httpStatusCodes = require('../path/to/httpStatusCodes');

async function getUserById(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const user = await userQueries.getUserById(userId);
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });  
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function createUser(req, res, next) {
    try {
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true});
        const user = await userQueries.createUser(userData);
        return res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: user
        });  
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while creating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function updateUser(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true});
        const user = await userQueries.updateUser(userId, userData);
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User updated successfully',
            data: user
        });  
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function deleteUser(req, res, next) {
    try {
        const userId = req.user.id;
        const user = await userQueries.softDeleteUser(userId);
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });  
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while deleting the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

async function getUserByUsername(req, res, next) {
    try {
        const { username } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const user = await contactQueries.getUserByUsername(username);
        
        if (!user) {
            return res.status(httpStatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User found',
            data: user
        });
    } catch (error) {
        console.log(error);
        res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while finding user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error);
    }
}

module.exports = { getUserById, createUser, updateUser, deleteUser, getUserByUsername };