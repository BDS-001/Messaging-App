const userQueries = require('../prisma/queries/userQueries')

async function getUserById(req, res, next) {
    try {
        const userId = req.body.userId
        const user = await userQueries.getUserById(userId)
        //TODO: return json   
    } catch (error) {
        next(error)
    }
}