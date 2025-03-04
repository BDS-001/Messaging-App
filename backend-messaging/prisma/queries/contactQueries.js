const prisma = require('../prismaClient')

async function getUserContacts(userId) {
  return await prisma.contact.findMany({
    where: {
      userId: userId
    },
    include: {
      contact: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
}

async function addContact(userId, contactId, nickname = null) {
  // Check if contact already exists
  const existingContact = await prisma.contact.findUnique({
    where: {
      userId_contactId: {
        userId,
        contactId
      }
    }
  });

  if (existingContact) {
    throw new Error('This user is already in your contacts');
  }

  // Check if the contact exists
  const contactUser = await prisma.user.findUnique({
    where: {
      id: contactId,
      isDeleted: false
    }
  });

  if (!contactUser) {
    throw new Error('User not found');
  }

  // Create the contact
  return await prisma.contact.create({
    data: {
      userId,
      contactId,
      nickname
    },
    include: {
      contact: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
}

async function updateContact(userId, contactId, nickname) {
  return await prisma.contact.update({
    where: {
      userId_contactId: {
        userId,
        contactId
      }
    },
    data: {
      nickname,
      updatedAt: new Date()
    },
    include: {
      contact: {
        select: {
          id: true,
          username: true,
          email: true
        }
      }
    }
  });
}

async function removeContact(userId, contactId) {
  return await prisma.contact.delete({
    where: {
      userId_contactId: {
        userId,
        contactId
      }
    }
  });
}

module.exports = {
  getUserContacts,
  addContact,
  updateContact,
  removeContact
};