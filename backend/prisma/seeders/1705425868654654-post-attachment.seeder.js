const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      {
        postId: posts[0].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Video',
      },
      {
        postId: posts[0].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Document',
      },
      {
        postId: posts[2].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Image_16012024',
      },
      {
        postId: posts[2].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Image_13012024',
      },
      {
        postId: posts[3].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
      },
      {
        postId: posts[4].id,
        file: Buffer.from(await new Blob([''], { type: 'text/plain' }).arrayBuffer()),
        filename: 'Additional info',
      },
    ];
    await prisma.postAttachment.createMany({ data });
  },

  async down() {
    await prisma.postAttachment.deleteMany();
  },
};
