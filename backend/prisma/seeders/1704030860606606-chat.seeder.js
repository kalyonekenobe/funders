const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const data = [{ name: 'Group chat' }, {}];

    await prisma.chat.createMany({ data });
  },

  async down() {
    await prisma.chat.deleteMany();
  },
};
