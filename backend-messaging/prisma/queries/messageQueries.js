const prisma = require('../prismaClient')

async function getUsersChatMessages(chatId, userId) {
    const participant = await prisma.chatParticipant.findUnique({
        where: {
            userId,
            chatId,
        },
        select:{
            lastClearedAt: true
        }
    })

    if (!participant) throw new Error('User is not a participant in this chat');

    return await prisma.message.findMany({
        where: {
            chatId,
            sentAt: {
                gt: participant.lastClearedAt
            }
        },
        orderBy: {
            createdAt: 'asc'
          }
    })
}

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

module.exports = {getUsersChatMessages, createMessage, softDeleteMessage, updateMessage}