const prisma = require('../prismaClient')

async function getUserById(userId) {
    return await prisma.User.findUnique({
        where: {
            id: userId
        },
        select:{
            id: true,
            username: true,
            email: true
        }
    })
}

module.exports = {getUserById}