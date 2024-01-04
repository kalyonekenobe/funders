-- DropForeignKey
ALTER TABLE "UsersBanListRecord" DROP CONSTRAINT "UsersBanListRecord_userId_fkey";

-- AddForeignKey
ALTER TABLE "UsersBanListRecord" ADD CONSTRAINT "UsersBanListRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
