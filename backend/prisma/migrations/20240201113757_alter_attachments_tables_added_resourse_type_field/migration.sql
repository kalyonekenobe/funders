-- AlterTable
ALTER TABLE "ChatMessageAttachment" ADD COLUMN     "resourseType" VARCHAR(255) NOT NULL DEFAULT 'raw';

-- AlterTable
ALTER TABLE "PostAttachment" ADD COLUMN     "resourseType" VARCHAR(255) NOT NULL DEFAULT 'raw';

-- AlterTable
ALTER TABLE "PostCommentAttachment" ADD COLUMN     "resourseType" VARCHAR(255) NOT NULL DEFAULT 'raw';
