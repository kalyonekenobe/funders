const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const data = [{ name: 'Permanent' }, { name: 'Temporary' }];

    await prisma.usersBanListRecordStatus.createMany({ data });
  },

  async down() {
    await prisma.usersBanListRecordStatus.deleteMany();
  },
};
