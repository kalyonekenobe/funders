-- DropForeignKey
ALTER TABLE "CategoriesOnPosts" DROP CONSTRAINT "CategoriesOnPosts_category_fkey";

-- AddForeignKey
ALTER TABLE "CategoriesOnPosts" ADD CONSTRAINT "CategoriesOnPosts_category_fkey" FOREIGN KEY ("category") REFERENCES "PostCategory"("name") ON DELETE NO ACTION ON UPDATE CASCADE;
