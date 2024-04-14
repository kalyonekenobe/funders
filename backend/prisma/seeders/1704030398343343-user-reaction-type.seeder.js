const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const data = [
      { name: 'Anger' },
      { name: 'Crying' },
      { name: 'Dislike' },
      { name: 'Heart' },
      { name: 'Laugh' },
      { name: 'Like' },
    ];

    await prisma.userReactionType.createMany({ data });
  },

  async down() {
    await prisma.userReactionType.deleteMany();
  },
};
