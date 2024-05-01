/*
  Warnings:

  - You are about to drop the column `cardNumber` on the `PostDonation` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PostDonation" DROP COLUMN "cardNumber",
ADD COLUMN     "paymentInfo" JSON NOT NULL DEFAULT '{}';
