/*
  Warnings:

  - You are about to drop the column `resourseType` on the `ChatMessageAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `resourseType` on the `PostAttachment` table. All the data in the column will be lost.
  - You are about to drop the column `resourseType` on the `PostCommentAttachment` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ChatMessageAttachment" DROP COLUMN "resourseType",
ADD COLUMN     "resourceType" VARCHAR(255) NOT NULL DEFAULT 'raw';

-- AlterTable
ALTER TABLE "PostAttachment" DROP COLUMN "resourseType",
ADD COLUMN     "resourceType" VARCHAR(255) NOT NULL DEFAULT 'raw';

-- AlterTable
ALTER TABLE "PostCommentAttachment" DROP COLUMN "resourseType",
ADD COLUMN     "resourceType" VARCHAR(255) NOT NULL DEFAULT 'raw';
