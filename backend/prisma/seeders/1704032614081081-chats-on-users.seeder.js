const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const users = await prisma.user.findMany({ select: { id: true } });
    const chats = await prisma.chat.findMany({ select: { id: true } });

    const data = [
      { chatId: chats[0].id, userId: users[0].id, role: 'Owner' },
      { chatId: chats[0].id, userId: users[1].id, role: 'Moderator' },
      { chatId: chats[0].id, userId: users[2].id, role: 'Participant' },
      { chatId: chats[0].id, userId: users[3].id, role: 'Participant' },
      { chatId: chats[0].id, userId: users[4].id, role: 'Moderator' },
      { chatId: chats[1].id, userId: users[2].id, role: 'Owner' },
      { chatId: chats[1].id, userId: users[4].id, role: 'Owner' },
    ];

    await prisma.chatsOnUsers.createMany({ data });
  },

  async down() {
    await prisma.chatsOnUsers.deleteMany();
  },
};
