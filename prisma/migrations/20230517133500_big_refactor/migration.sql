/*
  Warnings:

  - The primary key for the `Message` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `Message` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `Message` table. All the data in the column will be lost.
  - You are about to alter the column `id` on the `Message` table. The data in that column could be lost. The data in that column will be cast from `VarChar(255)` to `Int`.
  - You are about to drop the `User` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `message_name` to the `Message` table without a default value. This is not possible if the table is not empty.
  - Added the required column `message_text` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `Message_author_id_idx` ON `Message`;

-- AlterTable
ALTER TABLE `Message` DROP PRIMARY KEY,
    DROP COLUMN `author_id`,
    DROP COLUMN `text`,
    ADD COLUMN `message_name` LONGTEXT NOT NULL,
    ADD COLUMN `message_text` LONGTEXT NOT NULL,
    ADD COLUMN `processedId` INTEGER NULL,
    MODIFY `id` INTEGER NOT NULL AUTO_INCREMENT,
    MODIFY `created_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    ADD PRIMARY KEY (`id`);

-- DropTable
DROP TABLE `User`;

-- CreateIndex
CREATE INDEX `Message_processedId_idx` ON `Message`(`processedId`);
