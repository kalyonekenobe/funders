const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const postComments = await prisma.postComment.findMany({ select: { id: true } });
    const users = await prisma.user.findMany({ select: { id: true } });

    const data = [
      { commentId: postComments[0].id, userId: users[0].id, reactionType: 'Heart' },
      { commentId: postComments[0].id, userId: users[1].id, reactionType: 'Like' },
      { commentId: postComments[1].id, userId: users[2].id, reactionType: 'Like' },
      { commentId: postComments[2].id, userId: users[0].id, reactionType: 'Dislike' },
      { commentId: postComments[3].id, userId: users[1].id, reactionType: 'Anger' },
      { commentId: postComments[5].id, userId: users[2].id, reactionType: 'Crying' },
      { commentId: postComments[5].id, userId: users[3].id, reactionType: 'Anger' },
      { commentId: postComments[7].id, userId: users[3].id, reactionType: 'Like' },
      { commentId: postComments[9].id, userId: users[3].id, reactionType: 'Laugh' },
      { commentId: postComments[9].id, userId: users[4].id, reactionType: 'Heart' },
    ];

    await prisma.postCommentReaction.createMany({ data });
  },

  async down() {
    await prisma.postCommentReaction.deleteMany();
  },
};
