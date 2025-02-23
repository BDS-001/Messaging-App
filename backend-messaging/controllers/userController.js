const { matchedData } = require('express-validator');
const userQueries = require('../prisma/queries/userQueries')

async function getUserById(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const user = await userQueries.getUserById(userId)
        return res.json({
            message: 'User retrieved successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        next(error)
    }
}

async function createUser(req, res, next) {
    try {
        const { id: userId } = matchedData(req, { locations: ['params'], onlyValidData: true });
        const userData = matchedData(req, {locations: ['body'], onlyValidData: true})
        //TODO: db query function
        return res.json({
            message: 'User created successfully',
            data: user
        });  
    } catch (error) {
        console.log(error)
        next(error)
    }
}

module.exports = {getUserById, createUser}