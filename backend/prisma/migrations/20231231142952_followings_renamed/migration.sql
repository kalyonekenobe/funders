/*
  Warnings:

  - You are about to drop the `Followings` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_followerId_fkey";

-- DropForeignKey
ALTER TABLE "Followings" DROP CONSTRAINT "Followings_userId_fkey";

-- DropTable
DROP TABLE "Followings";

-- CreateTable
CREATE TABLE "Following" (
    "userId" TEXT NOT NULL,
    "followerId" TEXT NOT NULL,

    CONSTRAINT "Following_pkey" PRIMARY KEY ("userId","followerId")
);

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Following" ADD CONSTRAINT "Following_followerId_fkey" FOREIGN KEY ("followerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
