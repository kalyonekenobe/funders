-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_role_fkey";

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "role" SET DEFAULT 'Default';

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_role_fkey" FOREIGN KEY ("role") REFERENCES "UserRole"("name") ON DELETE SET DEFAULT ON UPDATE CASCADE;
