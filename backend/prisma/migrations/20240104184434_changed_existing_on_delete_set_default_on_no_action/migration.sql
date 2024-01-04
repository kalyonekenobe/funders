-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_registrationMethod_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_fkey";

-- DropForeignKey
ALTER TABLE "UsersBanListRecord" DROP CONSTRAINT "UsersBanListRecord_status_fkey";

-- DropForeignKey
ALTER TABLE "UsersBanListRecord" DROP CONSTRAINT "UsersBanListRecord_userId_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "registrationMethod" DROP DEFAULT,
ALTER COLUMN "role" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRole"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_registrationMethod_fkey" FOREIGN KEY ("registrationMethod") REFERENCES "UserRegistrationMethod"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBanListRecord" ADD CONSTRAINT "UsersBanListRecord_status_fkey" FOREIGN KEY ("status") REFERENCES "UsersBanListRecordStatus"("name") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UsersBanListRecord" ADD CONSTRAINT "UsersBanListRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
