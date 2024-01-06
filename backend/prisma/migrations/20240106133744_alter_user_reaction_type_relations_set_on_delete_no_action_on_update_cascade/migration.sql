-- DropForeignKey
ALTER TABLE "PostCommentReaction" DROP CONSTRAINT "PostCommentReaction_reactionType_fkey";

-- DropForeignKey
ALTER TABLE "PostReaction" DROP CONSTRAINT "PostReaction_reactionType_fkey";

-- AddForeignKey
ALTER TABLE "PostReaction" ADD CONSTRAINT "PostReaction_reactionType_fkey" FOREIGN KEY ("reactionType") REFERENCES "UserReactionType"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PostCommentReaction" ADD CONSTRAINT "PostCommentReaction_reactionType_fkey" FOREIGN KEY ("reactionType") REFERENCES "UserReactionType"("name") ON DELETE NO ACTION ON UPDATE CASCADE;
