/*
  Warnings:

  - You are about to alter the column `price` on the `Part` table. The data in that column could be lost. The data in that column will be cast from `Decimal(11,2)` to `Decimal(10,2)`.

*/
-- AlterTable
ALTER TABLE "Part" ALTER COLUMN "price" SET DATA TYPE DECIMAL(10,2);
