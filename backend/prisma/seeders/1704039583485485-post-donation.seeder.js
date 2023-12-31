const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      { postId: posts[0].id, cardNumber: '4651959430571585', donation: 1200 },
      { postId: posts[0].id, cardNumber: '5684068403860256', donation: 4495 },
      { postId: posts[0].id, cardNumber: '1058674969476571', donation: 300 },
      { postId: posts[1].id, cardNumber: '6965394867570345', donation: 45.98 },
      { postId: posts[2].id, cardNumber: '1244765939851691', donation: 5844.5 },
      { postId: posts[2].id, cardNumber: '4868005043353572', donation: 124.12 },
      { postId: posts[3].id, cardNumber: '5979504764832046', donation: 48591.5 },
      { postId: posts[4].id, cardNumber: '2231456163626402', donation: 583.4 },
      { postId: posts[4].id, cardNumber: '9340315560156934', donation: 888.33 },
    ];

    await prisma.postDonation.createMany({ data });
  },

  async down() {
    await prisma.postDonation.deleteMany();
  },
};
