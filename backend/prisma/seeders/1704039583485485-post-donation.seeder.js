const { prisma } = require('../utils/prisma.utils');

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      { postId: posts[0].id, paymentInfo: JSON.stringify({ last4: '4242' }), donation: 1200 },
      { postId: posts[0].id, paymentInfo: JSON.stringify({ last4: '5156' }), donation: 4495 },
      { postId: posts[0].id, paymentInfo: JSON.stringify({ last4: '9615' }), donation: 300 },
      { postId: posts[1].id, paymentInfo: JSON.stringify({ last4: '8146' }), donation: 45.98 },
      { postId: posts[2].id, paymentInfo: JSON.stringify({ last4: '4242' }), donation: 5844.5 },
      { postId: posts[2].id, paymentInfo: JSON.stringify({ last4: '9675' }), donation: 124.12 },
      { postId: posts[3].id, paymentInfo: JSON.stringify({ last4: '5584' }), donation: 48591.5 },
      { postId: posts[4].id, paymentInfo: JSON.stringify({ last4: '1145' }), donation: 583.4 },
      { postId: posts[4].id, paymentInfo: JSON.stringify({ last4: '6431' }), donation: 888.33 },
    ];

    await prisma.postDonation.createMany({ data });
  },

  async down() {
    await prisma.postDonation.deleteMany();
  },
};
