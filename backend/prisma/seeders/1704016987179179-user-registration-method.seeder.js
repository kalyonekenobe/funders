const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const data = [
      { name: 'Default' },
      { name: 'Google' },
      { name: 'Microsoft' },
      { name: 'Apple' },
    ];

    await prisma.userRegistrationMethod.createMany({ data });
  },

  async down() {
    await prisma.userRegistrationMethod.deleteMany();
  },
};
