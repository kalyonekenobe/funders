const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      { userId: users[0].id, followerId: users[1].id },
      { userId: users[0].id, followerId: users[2].id },
      { userId: users[0].id, followerId: users[3].id },
      { userId: users[0].id, followerId: users[4].id },
      { userId: users[1].id, followerId: users[2].id },
      { userId: users[1].id, followerId: users[4].id },
      { userId: users[2].id, followerId: users[1].id },
      { userId: users[2].id, followerId: users[3].id },
      { userId: users[2].id, followerId: users[4].id },
      { userId: users[3].id, followerId: users[0].id },
      { userId: users[3].id, followerId: users[2].id },
      { userId: users[4].id, followerId: users[1].id },
      { userId: users[4].id, followerId: users[2].id },
    ];

    await prisma.following.createMany({ data });
  },

  async down() {
    await prisma.following.deleteMany();
  },
};
