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

async function getChatWithMessages(chatId, userId) {
  const participant = await prisma.chatParticipant.findUnique({
      where: {
        chatId_userId: {
          chatId,
          userId
        }
      },
      select:{
          lastClearedAt: true
      }
  })

  if (!participant) throw new Error('User is not a participant in this chat');

  return await prisma.chat.findUnique({
      where: {
          id: chatId,
      },
      include: {
        messages: {
          where: {
            sentAt: participant.lastClearedAt ? {
              gt: participant.lastClearedAt
            } : undefined
          },
          orderBy: {
            sentAt: 'asc'
          }
        },
        participants: {
          include: {user: true}
        }
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

async function updateChat(chatId, newChatName) {
  return await prisma.chat.update({
    where: {
      id: chatId
    },
    data: {
        name: newChatName
    },
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

async function isUserParticipantInChat(userId, chatId) {
  return await prisma.chatParticipant.findUnique({
    where: {
      chatId_userId: {
        chatId,
        userId
      }
    }
  })
}

async function addUserToChat(chatId, userId) {
  const existingParticipant = await prisma.chatParticipant.findUnique({
    where: {
      chatId_userId: {
        chatId,
        userId
      }
    }
  });

  if (existingParticipant) {
    throw new Error('User is already a participant in this chat');
  }

  return await prisma.chatParticipant.create({
    data: {
      chatId,
      userId
    },
    include: {
      user: true,
      chat: true
    }
  });
}

async function removeUserFromChat(chatId, userId) {
  return await prisma.chatParticipant.delete({
    where: {
      chatId_userId: {
        chatId,
        userId
      }
    }
  });
}

module.exports = {getUserChats, createChat, updateChat, deleteChat, getChatWithMessages, isUserParticipantInChat, addUserToChat, removeUserFromChat}