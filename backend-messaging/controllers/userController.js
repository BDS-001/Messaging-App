const { matchedData } = require('express-validator');
const userQueries = require('../prisma/queries/userQueries')

async function getUserById(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const user = await userQueries.getUserById(userId)
        return res.json({
            success: true,
            message: 'User retrieved successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'An error occurred while retrieving the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error)
    }
}

async function createUser(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true})
        const user = await userQueries.createUser(userId, userData)
        return res.json({
            success: true,
            message: 'User created successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'An error occurred while creating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error)
    }
}

async function updateUser(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true})
        const user = await userQueries.updateUser(userId, userData)
        return res.json({
            success: true,
            message: 'User updated successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'An error occurred while updating the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error)
    }
}

async function deleteUser(req, res, next) {
    try {
        const userId = req.user.id
        const user = await userQueries.softDeleteUser(userId)
        return res.json({
            success: true,
            message: 'User deleted successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({
            success: false,
            message: error.message || 'An error occurred while deleting the user',
            error: process.env.NODE_ENV === 'development' ? error : undefined
        });
        return next(error)
    }
}

module.exports = {getUserById, createUser, updateUser, deleteUser}