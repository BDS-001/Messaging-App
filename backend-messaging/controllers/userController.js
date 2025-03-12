const { matchedData } = require('express-validator');
const userQueries = require('../prisma/queries/userQueries');
const httpStatusCodes = require('../utils/httpStatusCodes');
const bcrypt = require('bcryptjs');

async function getUserById(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while retrieving the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function createUser(req, res) {
    try {
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true});

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userData.password, salt);
        userData.password = hashedPassword

        const user = await userQueries.createUser(userData);
        return res.status(httpStatusCodes.CREATED).json({
            success: true,
            message: 'User created successfully',
            data: user
        });  
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while creating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function updateUser(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while updating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function deleteUser(req, res) {
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
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while deleting the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

async function getUsersBySearchQuery(req, res) {
    try {
        const { q } = matchedData(req, { locations: ['query'], onlyValidData: true });
        const users = await userQueries.getUsersBySearchQuery(q);
        
        if (!users) {
            return res.status(httpStatusCodes.NOT_FOUND).json({
                success: false,
                message: 'User not found'
            });
        }
        
        return res.status(httpStatusCodes.OK).json({
            success: true,
            message: 'User found',
            data: users
        });
    } catch (error) {
        console.log(error);
        return res.status(error.status || httpStatusCodes.INTERNAL_SERVER_ERROR).json({
            success: false,
            message: error.message || 'An error occurred while finding user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
    }
}

module.exports = { getUserById, createUser, updateUser, deleteUser, getUsersBySearchQuery };