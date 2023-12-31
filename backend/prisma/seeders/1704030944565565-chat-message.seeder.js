const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const chats = await prisma.chat.findMany();
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      {
        chatId: chats[0].id,
        authorId: users[0].id,
        text: 'Hello!',
      },
      {
        chatId: chats[0].id,
        authorId: users[1].id,
        text: 'Hi!',
      },
      {
        chatId: chats[0].id,
        authorId: users[2].id,
        text: 'Cheers!',
      },
      {
        chatId: chats[0].id,
        authorId: users[0].id,
        text: 'How are you?',
      },
      {
        chatId: chats[0].id,
        authorId: users[3].id,
        text: 'Nice to meet you all guys)',
      },
      {
        chatId: chats[0].id,
        authorId: users[4].id,
        text: 'Wassup bro?',
      },
      {
        chatId: chats[1].id,
        authorId: users[2].id,
        text: 'Lets go for a walk today',
        isPinned: true,
      },
      {
        chatId: chats[1].id,
        authorId: users[4].id,
        text: 'Sorry, I have a lot of work to do today. Shell we go tomorrow?',
      },
    ];

    await prisma.chatMessage.createMany({ data });
  },

  async down() {
    await prisma.chatMessage.deleteMany();
  },
};
