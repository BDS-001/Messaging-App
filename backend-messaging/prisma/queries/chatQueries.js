const prisma = require('../prismaClient')

async function getUserChats(userId) {
  return await prisma.chat.findMany({
    where: {
      participants: {
        some: {
          userId: userId
        }
      }
    },
    include: {
      participants: {
        include: {user: true}
      },
    }
  })
}

async function createChat({ type, name, participantIds }) {
  const uniqueParticipantIds = [...new Set(participantIds)];
  return await prisma.chat.create({
    data: {
      type,
      name,
      participants: {
        create: uniqueParticipantIds.map(userId => ({ userId })),
      },
    },
    include: {
      participants: {
        include: { user: true },
      },
    },
  });
}

async function updateChat(chatId, updateData) {
  return await prisma.chat.update({
    where: {
      id: chatId
    },
    data: updateData,
    include: {
      participants: {
        include: { user: true },
      },
    },
  });
}

async function deleteChat(chatId) {
  return await prisma.chat.delete({
    where: {
      id: chatId
    },
    include: {
      participants: true,
    }
  });
}

module.exports = {getUserChats, createChat, updateChat, deleteChat}