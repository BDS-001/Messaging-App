const userQueries = require('../prisma/queries/userQueries')

async function getUserById(req, res, next) {
    try {
        const userId = req.body.userId
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