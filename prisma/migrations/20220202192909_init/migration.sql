-- CreateTable
CREATE TABLE `User` (
    `id` VARCHAR(191) NOT NULL,
    `firstName` VARCHAR(191) NOT NULL,
    `lastName` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `userBioId` VARCHAR(191) NULL,

    UNIQUE INDEX `User_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `UserBio` (
    `id` VARCHAR(191) NOT NULL,
    `description` VARCHAR(191) NOT NULL,
    `github` VARCHAR(191) NOT NULL,
    `twitter` VARCHAR(191) NOT NULL,
    `linkedin` VARCHAR(191) NOT NULL,
    `facebook` VARCHAR(191) NOT NULL,
    `hashnode` VARCHAR(191) NOT NULL,
    `devto` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `User` ADD CONSTRAINT `User_userBioId_fkey` FOREIGN KEY (`userBioId`) REFERENCES `UserBio`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
