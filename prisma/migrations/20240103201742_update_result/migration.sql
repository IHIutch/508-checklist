/*
  Warnings:

  - You are about to drop the `TestOnPages` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `TestOnPages` DROP FOREIGN KEY `TestOnPages_pageId_fkey`;

-- DropForeignKey
ALTER TABLE `TestOnPages` DROP FOREIGN KEY `TestOnPages_testId_fkey`;

-- DropTable
DROP TABLE `TestOnPages`;

-- CreateTable
CREATE TABLE `Result` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `pageId` INTEGER NULL,
    `testId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_pageId_fkey` FOREIGN KEY (`pageId`) REFERENCES `Page`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Result` ADD CONSTRAINT `Result_testId_fkey` FOREIGN KEY (`testId`) REFERENCES `Test`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
