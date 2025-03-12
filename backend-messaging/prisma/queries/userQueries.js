const prisma = require('../prismaClient')
const bcrypt = require('bcryptjs');
const crypto = require('crypto');

async function getUserById(userId) {
  return await prisma.user.findUnique({
    where: {
      id: userId
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true
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

async function softDeleteUser(userId) {
  const anonymousUsername = `deleted_user_${userId}`;
  const anonymousEmail = `deleted_${userId}@example.com`;
  
  return await prisma.user.update({
    where: {
      id: userId,
      isDeleted: false
    },
    data: {
      username: anonymousUsername,
      email: anonymousEmail,
      password: await bcrypt.hash(crypto.randomBytes(32).toString('hex'), 10),
      isDeleted: true,
      deletedAt: new Date()
    },
    select: {
      id: true,
      isDeleted: true,
      deletedAt: true
    }
  });
}

async function getUserForAuth(email) {
  return await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true,
      password: true
    }
  })
}

async function getUsersBySearchQuery(q) {
  return await prisma.user.findMany({
    where: {
      username: {
        contains: q,
        mode: 'insensitive',
      },
      isDeleted: false
    },
    select: {
      id: true,
      username: true,
      email: true,
      createdAt: true,
      updatedAt: true
    }
  });
}

module.exports = { getUserById, createUser, updateUser, softDeleteUser, getUserForAuth, getUsersBySearchQuery }