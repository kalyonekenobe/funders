const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const userRegistrationMethods = [
      { name: 'Default' },
      { name: 'Google' },
      { name: 'Microsoft' },
      { name: 'Apple' },
    ];

    userRegistrationMethods.forEach(async data => {
      await prisma.userRegistrationMethod.create({ data });
    });
  },

  async down() {
    await prisma.userRegistrationMethod.deleteMany();
  },
};
