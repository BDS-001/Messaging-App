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

async function createUser(userData) {
    return await prisma.user.create({
        data: userData,
        select: {
            id,
            username,
            email,
            createdAt,
        }
    });
}

module.exports = {getUserById, createUser}