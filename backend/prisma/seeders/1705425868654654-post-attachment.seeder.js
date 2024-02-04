const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      {
        postId: posts[0].id,
        file: 'some_file.txt',
        filename: 'Video',
      },
      {
        postId: posts[0].id,
        file: 'some_file.txt',
        filename: 'Document',
      },
      {
        postId: posts[2].id,
        file: 'some_file.txt',
        filename: 'Image_16012024',
      },
      {
        postId: posts[2].id,
        file: 'some_file.txt',
        filename: 'Image_13012024',
      },
      {
        postId: posts[3].id,
        file: 'some_file.txt',
      },
      {
        postId: posts[4].id,
        file: 'some_file.txt',
        filename: 'Additional info',
      },
    ];
    await prisma.postAttachment.createMany({ data });
  },

  async down() {
    await prisma.postAttachment.deleteMany();
  },
};
