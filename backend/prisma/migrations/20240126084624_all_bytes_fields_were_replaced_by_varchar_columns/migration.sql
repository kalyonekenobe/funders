/*
  Warnings:

  - You are about to alter the column `file` on the `ChatMessageAttachment` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - You are about to alter the column `image` on the `Post` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - You are about to alter the column `file` on the `PostAttachment` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - You are about to alter the column `file` on the `PostCommentAttachment` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.
  - You are about to alter the column `avatar` on the `User` table. The data in that column could be lost. The data in that column will be cast from `ByteA` to `VarChar(255)`.

*/
-- AlterTable
ALTER TABLE "ChatMessageAttachment" ALTER COLUMN "file" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "Post" ALTER COLUMN "image" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "PostAttachment" ALTER COLUMN "file" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "PostCommentAttachment" ALTER COLUMN "file" SET DATA TYPE VARCHAR(255);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "avatar" SET DATA TYPE VARCHAR(255);
