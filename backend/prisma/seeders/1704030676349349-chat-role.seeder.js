const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const data = [{ name: 'Owner' }, { name: 'Moderator' }, { name: 'Participant' }];

    await prisma.chatRole.createMany({ data });
  },

  async down() {
    await prisma.chatRole.deleteMany();
  },
};
