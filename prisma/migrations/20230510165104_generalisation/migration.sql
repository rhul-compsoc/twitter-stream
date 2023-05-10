/*
  Warnings:

  - You are about to drop the column `tweet_id` on the `Processed` table. All the data in the column will be lost.
  - You are about to drop the `Tweet` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[msg_id]` on the table `Processed` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `msg_id` to the `Processed` table without a default value. This is not possible if the table is not empty.
  - Added the required column `accent_colour` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Processed_tweet_id_idx` ON `Processed`;

-- DropIndex
DROP INDEX `Processed_tweet_id_key` ON `Processed`;

-- AlterTable
ALTER TABLE `Processed` DROP COLUMN `tweet_id`,
    ADD COLUMN `msg_id` VARCHAR(255) NOT NULL;

-- AlterTable
ALTER TABLE `User` ADD COLUMN `accent_colour` VARCHAR(10) NOT NULL;

-- DropTable
DROP TABLE `Tweet`;

-- CreateTable
CREATE TABLE `Message` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `author_id` VARCHAR(255) NOT NULL,
    `text` LONGTEXT NOT NULL,

    INDEX `Message_author_id_idx`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Processed_msg_id_key` ON `Processed`(`msg_id`);

-- CreateIndex
CREATE INDEX `Processed_msg_id_idx` ON `Processed`(`msg_id`);
