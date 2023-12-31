const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });

    let data = [
      {
        postId: posts[0].id,
        authorId: users[0].id,
        content:
          "In times of crisis, your donations bring hope and aid to affected communities. Together, we're a force of compassion and resilience!",
      },
      {
        postId: posts[1].id,
        authorId: users[0].id,
        content:
          'Talking about mental health is crucial. Your support in raising awareness breaks stigmas and provides hope to those in need. ',
      },
      {
        postId: posts[2].id,
        authorId: users[4].id,
        content:
          'Preserving our planet is a collective responsibility. Your contribution to environmental causes is a step towards a greener and healthier future!',
      },
      {
        postId: posts[3].id,
        authorId: users[2].id,
        content:
          'Every little bit helps these furry pals in shelters. Your support means cozy beds and full bellies for these adorable companions!',
      },
      {
        postId: posts[4].id,
        authorId: users[4].id,
        content:
          'Your donations are making a real difference in fighting hunger within our community. Thank you for sharing and caring for our neighbors! ',
      },
      {
        postId: posts[4].id,
        authorId: users[1].id,
        content:
          'Supporting scholarships means opening doors to education for bright minds. Your generosity shapes future leaders!',
      },
    ];

    await prisma.postComment.createMany({ data });

    let postComments = await prisma.postComment.findMany({ select: { id: true } });
    data = [
      {
        postId: posts[0].id,
        authorId: users[1].id,
        parentCommentId: postComments[0].id,
        content:
          'Your contributions fund critical research that saves lives. Thank you for being a part of the journey towards better health!',
      },
      {
        postId: posts[3].id,
        authorId: users[4].id,
        parentCommentId: postComments[3].id,
        content:
          'Artists enrich our world with creativity. Your support for local talents nurtures culture and imagination in our communities!',
      },
      {
        postId: posts[4].id,
        authorId: users[0].id,
        parentCommentId: postComments[4].id,
        content:
          'Standing up for equality matters. Your support for LGBTQ+ rights fosters inclusivity and acceptance for everyone! ',
      },
    ];

    await prisma.postComment.createMany({ data });

    postComments = await prisma.postComment.findMany({ select: { id: true } });
    data = [
      {
        postId: posts[0].id,
        authorId: users[3].id,
        parentCommentId: postComments[6].id,
        content:
          'Supporting the elderly ensures their dignity and comfort. Your donations bring warmth and care to our beloved seniors! ',
      },
    ];

    await prisma.postComment.createMany({ data });
  },

  async down() {
    await prisma.postComment.deleteMany();
  },
};
