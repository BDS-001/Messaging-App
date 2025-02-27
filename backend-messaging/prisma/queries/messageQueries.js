const prisma = require('../prismaClient')


async function createMessage(messageData) {
    return await prisma.message.create({
        data: messageData,
      });
}

async function softDeleteMessage(messageId) {
    return await prisma.message.update({
        where: {
            id: messageId
        },
        data: {
            isDeleted: true,
        },
        select: {
            isDeleted: true
        }
    })
}

async function updateMessage(messageId, newMessage) {
    return await prisma.message.update({
      where: {
        id: messageId
      },
      data: {
        content: newMessage
      }
    });
}

module.exports = {createMessage, softDeleteMessage, updateMessage}