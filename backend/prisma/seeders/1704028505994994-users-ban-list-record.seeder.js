const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const users = await prisma.user.findMany({
      where: {
        OR: [{ role: 'Default' }, { role: 'Volunteer' }],
      },
      select: {
        id: true,
      },
    });

    const data = [
      {
        userId: users[2].id,
        status: 'Temporary',
        dueTo: new Date('2024-10-09T12:14:41'),
        note: 'The use of profanity',
        permissionsPenalty: 3,
      },
      {
        userId: users[3].id,
        status: 'Permanent',
        note: 'Publishing false publications for illegal fundraising',
        permissionsPenalty: 255,
      },
    ];

    await prisma.usersBanListRecord.createMany({ data });
  },

  async down() {
    await prisma.usersBanListRecord.deleteMany();
  },
};
