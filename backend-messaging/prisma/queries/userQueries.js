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
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

async function updateUser(id, updateData) {
    return await prisma.user.update({
        where: {
            id
        },
        data: updateData,
        select: {
            id: true,
            username: true,
            email: true,
            createdAt: true,
            updatedAt: true
        }
    });
}

module.exports = {getUserById, createUser, updateUser}