-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_registrationMethod_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "registrationMethod" SET DEFAULT 'Default';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_registrationMethod_fkey" FOREIGN KEY ("registrationMethod") REFERENCES "UserRegistrationMethod"("name") ON DELETE SET DEFAULT ON UPDATE CASCADE;
