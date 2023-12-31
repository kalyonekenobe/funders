const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const chatMessages = await prisma.chatMessage.findMany({ select: { id: true } });

    const data = [
      {
        messageId: chatMessages[0].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
      },
      {
        messageId: chatMessages[0].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'File',
      },
      {
        messageId: chatMessages[1].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Greetings',
      },
      {
        messageId: chatMessages[2].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Important information',
      },
    ];

    await prisma.chatMessageAttachment.createMany({ data });
  },

  async down() {
    await prisma.chatMessageAttachment.deleteMany();
  },
};
