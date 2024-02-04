const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const postComments = await prisma.postComment.findMany({ select: { id: true } });

    const data = [
      {
        commentId: postComments[0].id,
        file: 'some_file.txt',
        filename: 'Text',
      },
      {
        commentId: postComments[0].id,
        file: 'some_file.txt',
        filename: 'Image',
      },
      {
        commentId: postComments[6].id,
        file: 'some_file.txt',
        filename: 'Photo_1',
      },
      {
        commentId: postComments[6].id,
        file: 'some_file.txt',
        filename: 'Photo_2',
      },
      {
        commentId: postComments[6].id,
        file: 'some_file.txt',
        filename: 'Photo_3',
      },
      {
        commentId: postComments[7].id,
        file: 'some_file.txt',
        filename: 'Details',
      },
    ];

    await prisma.postCommentAttachment.createMany({ data });
  },

  async down() {
    await prisma.postCommentAttachment.deleteMany();
  },
};
