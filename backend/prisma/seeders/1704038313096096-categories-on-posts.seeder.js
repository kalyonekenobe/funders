const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

module.exports = {
  async up() {
    const postCategories = await prisma.postCategory.findMany();
    const posts = await prisma.post.findMany({ select: { id: true } });

    const data = [
      { postId: posts[0].id, category: postCategories[0].name },
      { postId: posts[1].id, category: postCategories[0].name },
      { postId: posts[2].id, category: postCategories[1].name },
      { postId: posts[2].id, category: postCategories[3].name },
      { postId: posts[3].id, category: postCategories[2].name },
      { postId: posts[4].id, category: postCategories[4].name },
    ];

    await prisma.categoriesOnPosts.createMany({ data });
  },

  async down() {
    await prisma.categoriesOnPosts.deleteMany();
  },
};
