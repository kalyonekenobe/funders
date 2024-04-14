const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const data = [{ name: 'Permanent' }, { name: 'Temporary' }];

    await prisma.usersBanListRecordStatus.createMany({ data });
  },

  async down() {
    await prisma.usersBanListRecordStatus.deleteMany();
  },
};
