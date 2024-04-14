const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const chats = await prisma.chat.findMany();
    const users = await prisma.user.findMany({ select: { id: true } });

    const date = new Date();

    let data = [
      {
        chatId: chats[0].id,
        authorId: users[0].id,
        text: 'Hello!',
        createdAt: date,
        updatedAt: new Date(date.getTime() + 1000),
      },
      {
        chatId: chats[0].id,
        authorId: users[2].id,
        text: 'Cheers!',
        createdAt: new Date(date.getTime() + 4000),
        updatedAt: new Date(date.getTime() + 4000),
      },
      {
        chatId: chats[0].id,
        authorId: users[0].id,
        text: 'How are you?',
        createdAt: new Date(date.getTime() + 8000),
        updatedAt: new Date(date.getTime() + 8000),
      },
      {
        chatId: chats[0].id,
        authorId: users[3].id,
        text: 'Nice to meet you all guys)',
        createdAt: new Date(date.getTime() + 10000),
        updatedAt: new Date(date.getTime() + 10000),
      },
      {
        chatId: chats[0].id,
        authorId: users[4].id,
        text: 'Wassup bro?',
        createdAt: new Date(date.getTime() + 16000),
        updatedAt: new Date(date.getTime() + 16000),
      },
      {
        chatId: chats[1].id,
        authorId: users[2].id,
        text: 'Lets go for a walk today',
        isPinned: true,
        createdAt: new Date(date.getTime() + 30000),
        updatedAt: new Date(date.getTime() + 30000),
      },
      {
        chatId: chats[1].id,
        authorId: users[4].id,
        text: 'Sorry, I have a lot of work to do today. Shell we go tomorrow?',
        createdAt: new Date(date.getTime() + 5000000),
        updatedAt: new Date(date.getTime() + 5000000),
      },
    ];

    await prisma.chatMessage.createMany({ data });

    const messages = await prisma.chatMessage.findMany();

    data = [
      {
        chatId: chats[0].id,
        authorId: users[1].id,
        replyTo: messages[0].id,
        text: 'Hi!',
        createdAt: new Date(date.getTime() + 3000),
        updatedAt: new Date(date.getTime() + 3000),
      },
    ];

    await prisma.chatMessage.createMany({ data });
  },

  async down() {
    await prisma.chatMessage.deleteMany();
  },
};
