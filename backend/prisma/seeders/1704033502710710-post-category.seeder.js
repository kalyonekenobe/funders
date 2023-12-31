const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const data = [
      { name: 'Army' },
      { name: 'Children' },
      { name: 'Animals' },
      { name: 'Poor people' },
      { name: 'Support for talents' },
    ];

    await prisma.postCategory.createMany({ data });
  },

  async down() {
    await prisma.postCategory.deleteMany();
  },
};
