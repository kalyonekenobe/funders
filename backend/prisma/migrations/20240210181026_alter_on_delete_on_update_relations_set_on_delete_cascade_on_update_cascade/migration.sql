-- DropForeignKey
ALTER TABLE "ChatMessageAttachment" DROP CONSTRAINT "ChatMessageAttachment_messageId_fkey";

-- DropForeignKey
ALTER TABLE "PostComment" DROP CONSTRAINT "PostComment_parentCommentId_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentAttachment" DROP CONSTRAINT "PostCommentAttachment_commentId_fkey";

-- DropForeignKey
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_commentId_fkey";

-- AddForeignKey
ALTER TABLE "ChatMessageAttachment" ADD CONSTRAINT "ChatMessageAttachment_messageId_fkey" FOREIGN KEY ("messageId") REFERENCES "ChatMessage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostComment" ADD CONSTRAINT "PostComment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReaction" ADD CONSTRAINT "PostCommentReaction_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentAttachment" ADD CONSTRAINT "PostCommentAttachment_commentId_fkey" FOREIGN KEY ("commentId") REFERENCES "PostComment"("id") ON DELETE CASCADE ON UPDATE CASCADE;
