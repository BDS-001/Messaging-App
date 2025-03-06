// database-seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');
const prisma = new PrismaClient();

async function seedDatabase() {
  console.log('Checking if database needs seeding...');

  // Check if we already have users
  const userCount = await prisma.user.count();
  if (userCount > 0) {
    console.log('Database already has data, skipping seed');
    return;
  }

  console.log('Seeding database with test data...');

  try {
    // Create Users
    const users = [];
    for (let i = 1; i <= 10; i++) {
      const hashedPassword = await bcrypt.hash(`password${i}`, 10);
      users.push(await prisma.user.create({
        data: {
          username: `user${i}`,
          email: `user${i}@example.com`,
          password: hashedPassword
        }
      }));
      console.log(`Created user: user${i}`);
    }

    // Create Contacts (everyone is a contact of user1)
    for (let i = 2; i <= 10; i++) {
      await prisma.contact.create({
        data: {
          userId: users[0].id,
          contactId: users[i-1].id,
          nickname: `Friend ${i-1}`
        }
      });
      console.log(`Added user${i} as contact of user1`);

      // Also make some reciprocal contacts
      if (i < 6) {
        await prisma.contact.create({
          data: {
            userId: users[i-1].id,
            contactId: users[0].id,
            nickname: `My Friend 1`
          }
        });
      }
    }

    // Create some one-on-one chats
    for (let i = 2; i <= 6; i++) {
      const chat = await prisma.chat.create({
        data: {
          type: 'one_on_one',
          name: null
        }
      });
      
      // Add participants to one-on-one chats
      await prisma.chatParticipant.create({
        data: {
          chatId: chat.id,
          userId: users[0].id
        }
      });
      
      await prisma.chatParticipant.create({
        data: {
          chatId: chat.id,
          userId: users[i-1].id
        }
      });
      
      // Add some messages to each chat
      const messageCount = Math.floor(Math.random() * 10) + 5; // 5-15 messages
      for (let j = 0; j < messageCount; j++) {
        const sender = j % 2 === 0 ? users[0].id : users[i-1].id;
        await prisma.message.create({
          data: {
            chatId: chat.id,
            senderId: sender,
            content: `This is message #${j+1} in the conversation. From user${sender === users[0].id ? 1 : i}.`
          }
        });
      }
      
      console.log(`Created one-on-one chat between user1 and user${i} with ${messageCount} messages`);
    }

    // Create 2 group chats
    for (let i = 1; i <= 2; i++) {
      const chat = await prisma.chat.create({
        data: {
          type: 'group',
          name: `Group Chat ${i}`
        }
      });
      
      // Add 4-6 random participants to each group chat
      const participantCount = Math.floor(Math.random() * 3) + 4; // 4-6 participants
      const participantIndices = new Set();
      
      // Always include user1
      participantIndices.add(0);
      
      // Add other random participants
      while (participantIndices.size < participantCount) {
        const randomIndex = Math.floor(Math.random() * 9); // 0-9
        participantIndices.add(randomIndex);
      }
      
      // Create participants
      for (const index of participantIndices) {
        await prisma.chatParticipant.create({
          data: {
            chatId: chat.id,
            userId: users[index].id
          }
        });
      }
      
      // Add some messages to each group chat
      const messageCount = Math.floor(Math.random() * 20) + 10; // 10-30 messages
      for (let j = 0; j < messageCount; j++) {
        const participantArray = Array.from(participantIndices);
        const randomParticipantIndex = Math.floor(Math.random() * participantArray.length);
        const senderId = users[participantArray[randomParticipantIndex]].id;
        
        await prisma.message.create({
          data: {
            chatId: chat.id,
            senderId: senderId,
            content: `Group message #${j+1}. This is from user${participantArray[randomParticipantIndex] + 1} to the group!`
          }
        });
      }
      
      console.log(`Created group chat ${i} with ${participantCount} participants and ${messageCount} messages`);
    }
    
    // Add a special case of a deleted message
    const firstChat = await prisma.chat.findFirst({
      where: { type: 'one_on_one' }
    });
    
    await prisma.message.create({
      data: {
        chatId: firstChat.id,
        senderId: users[0].id,
        content: 'This message was deleted',
        isDeleted: true,
        deletedAt: new Date()
      }
    });
    
    // Add a special case of a user who deleted their account
    const deletedUserPassword = await bcrypt.hash('deleteduser', 10);
    await prisma.user.create({
      data: {
        username: 'deleteduser',
        email: 'deleted@example.com',
        password: deletedUserPassword,
        isDeleted: true,
        deletedAt: new Date()
      }
    });

    console.log('Database seeding completed successfully!');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await prisma.$disconnect();
  }
}

module.exports = { seedDatabase };

// Allow direct execution
if (require.main === module) {
  seedDatabase()
    .catch(e => {
      console.error(e);
      process.exit(1);
    });
}