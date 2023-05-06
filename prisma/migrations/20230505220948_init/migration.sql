-- CreateTable
CREATE TABLE `Processed` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `tweet_id` VARCHAR(255) NOT NULL,
    `processed_at` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `processed_by` VARCHAR(255) NOT NULL,
    `processed_result` BOOLEAN NOT NULL,

    UNIQUE INDEX `Processed_tweet_id_key`(`tweet_id`),
    INDEX `Processed_tweet_id_idx`(`tweet_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Tweet` (
    `id` VARCHAR(255) NOT NULL,
    `created_at` DATETIME(3) NOT NULL,
    `author_id` VARCHAR(255) NOT NULL,
    `text` LONGTEXT NOT NULL,

    INDEX `Tweet_author_id_idx`(`author_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(255) NOT NULL,
    `username` VARCHAR(255) NOT NULL,
    `profile_image_url` VARCHAR(255) NOT NULL DEFAULT '',

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
