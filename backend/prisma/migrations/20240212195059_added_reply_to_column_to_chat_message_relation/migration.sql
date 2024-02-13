-- AlterTable
ALTER TABLE "ChatMessage" ADD COLUMN     "replyTo" TEXT;

-- AddForeignKey
ALTER TABLE "ChatMessage" ADD CONSTRAINT "ChatMessage_replyTo_fkey" FOREIGN KEY ("replyTo") REFERENCES "ChatMessage"("id") ON DELETE SET NULL ON UPDATE CASCADE;
