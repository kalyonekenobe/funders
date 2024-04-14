const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const chatMessages = await prisma.chatMessage.findMany({ select: { id: true } });

    const data = [
      {
        messageId: chatMessages[0].id,
        file: 'some_file.txt',
      },
      {
        messageId: chatMessages[0].id,
        file: 'some_file.txt',
        filename: 'File',
      },
      {
        messageId: chatMessages[1].id,
        file: 'some_file.txt',
        filename: 'Greetings',
      },
      {
        messageId: chatMessages[2].id,
        file: 'some_file.txt',
        filename: 'Important information',
      },
    ];

    await prisma.chatMessageAttachment.createMany({ data });
  },

  async down() {
    await prisma.chatMessageAttachment.deleteMany();
  },
};
