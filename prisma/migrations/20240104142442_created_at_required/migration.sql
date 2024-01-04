/*
  Warnings:

  - Made the column `createdAt` on table `Page` required. This step will fail if there are existing NULL values in that column.
  - Made the column `createdAt` on table `Result` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `Page` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);

-- AlterTable
ALTER TABLE `Result` MODIFY `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3);
