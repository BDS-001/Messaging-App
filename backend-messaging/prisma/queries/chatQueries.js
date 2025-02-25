const prisma = require('../prismaClient')

async function getUserConversations(userId) {
    return await prisma.Conversation.findMany({
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

async function createConversation({ type, name, participantIds }) {
    const uniqueParticipantIds = [...new Set(participantIds)];
    
        return await prisma.conversation.create({
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

async function updateConversation(conversationId, updateData) {
    return await prisma.conversation.update({
        where: {
            id: conversationId
        },
        data: updateData,
        include: {
            participants: {
                include: { user: true },
            },
        },
    });
}

async function deleteConversation(conversationId) {
    return await prisma.conversation.delete({
        where: {
            id: conversationId
        },
        include: {
            participants: true,
        }
    });
}

module.exports = {getUserConversations, createConversation, updateConversation, deleteConversation}