-- CreateTable
CREATE TABLE `actionCategories` (
    `id` VARCHAR(350) NOT NULL,
    `name` TEXT NOT NULL,
    `type` TEXT NOT NULL,

    UNIQUE INDEX `catName`(`name`(50)),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailyBudget` (
    `id` VARCHAR(350) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `value` DECIMAL(10, 2) NULL,
    `date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `houseId-dailyBudget`(`houseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `dailyTransactions` (
    `id` VARCHAR(350) NOT NULL,
    `dailyActionCount` INTEGER NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `dailyActionCount`(`dailyActionCount`),
    INDEX `houseId-dailyActions`(`houseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `householdUsers` (
    `id` VARCHAR(350) NOT NULL,
    `userId` VARCHAR(350) NOT NULL,
    `userName` VARCHAR(50) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL DEFAULT '0',
    `role` TEXT NOT NULL,

    UNIQUE INDEX `householdUsers_ibfk_1`(`userId`),
    INDEX `houseId_householdUsers`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `households` (
    `houseId` VARCHAR(450) NOT NULL,
    `userId` VARCHAR(450) NOT NULL,
    `userName` VARCHAR(50) NOT NULL,
    `houseName` VARCHAR(250) NOT NULL,
    `initBudget` DECIMAL(10, 2) NULL,
    `currentBalance` DECIMAL(10, 2) NULL,
    `monthlyBalanceDate` DATE NULL,
    `createdAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    INDEX `createdAt`(`createdAt`),
    INDEX `houseId_households`(`houseId`),
    INDEX `monthlyBalanceDate`(`monthlyBalanceDate`),
    INDEX `userId`(`userId`),
    PRIMARY KEY (`houseId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `initialMonthlyBudgets` (
    `id` VARCHAR(350) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `value` DECIMAL(10, 2) NULL,
    `addedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `validUntil` DATE NOT NULL,

    UNIQUE INDEX `validUntil-initialMonthlyBudgets`(`id`),
    INDEX `addedAt-initialMonthlyBudgets`(`id`),
    INDEX `houseId_initialMonthlyBudgets`(`houseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `invitations` (
    `id` VARCHAR(350) NOT NULL,
    `status` VARCHAR(20) NOT NULL,
    `invitingUserId` VARCHAR(350) NOT NULL,
    `invitedUserId` VARCHAR(350) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `hostId` VARCHAR(350) NOT NULL,
    `date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `invitingUserId`(`invitingUserId`),
    UNIQUE INDEX `invitedUserId`(`invitedUserId`),
    INDEX `hostId`(`hostId`),
    INDEX `houseId`(`houseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `messages` (
    `id` VARCHAR(350) NOT NULL,
    `senderId` VARCHAR(350) NOT NULL,
    `recipientId` VARCHAR(350) NOT NULL,
    `content` TEXT NOT NULL,
    `datetime` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `is_read` BOOLEAN NOT NULL DEFAULT false,

    UNIQUE INDEX `datetime_messages`(`datetime`),
    INDEX `id_messages`(`id`),
    INDEX `recipientId`(`recipientId`),
    INDEX `senderId`(`senderId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthlyTransactionCounts` (
    `id` VARCHAR(350) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `transactionCount` INTEGER NOT NULL,
    `startDate` DATE NOT NULL,
    `balanceDate` DATE NOT NULL,

    INDEX `houseId-transactionCounts`(`houseId`),
    INDEX `startDate`(`startDate`),
    INDEX `transactionCount`(`transactionCount`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `monthly_balances` (
    `id` VARCHAR(350) NOT NULL,
    `monthly_balance` DECIMAL(10, 2) NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `monthlyBalanceDate` DATE NOT NULL,

    INDEX `balanceDate-monthly_balances`(`id`),
    INDEX `houseId-monthly_balances`(`houseId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `notifications` (
    `id` VARCHAR(400) NOT NULL,
    `category` TEXT NOT NULL,
    `noticeData` JSON NOT NULL,
    `houseId` VARCHAR(400) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `socketConnections` (
    `id` VARCHAR(350) NOT NULL,
    `userId` VARCHAR(350) NOT NULL,
    `connectionId` VARCHAR(500) NOT NULL,
    `expireDate` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `technologies` (
    `id` VARCHAR(400) NOT NULL,
    `name` TEXT NOT NULL,
    `icon` VARCHAR(50) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `transactions` (
    `id` VARCHAR(350) NOT NULL,
    `transactionId` VARCHAR(350) NOT NULL,
    `userId` VARCHAR(350) NOT NULL,
    `houseId` VARCHAR(350) NOT NULL,
    `catId` VARCHAR(350) NOT NULL,
    `type` VARCHAR(50) NOT NULL,
    `value` DECIMAL(10, 2) NULL,
    `addedAt` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`),
    INDEX `addedAt`(`addedAt`),
    INDEX `catId`(`catId`),
    INDEX `houseId-transactions`(`houseId`),
    INDEX `userId`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `users` (
    `id` VARCHAR(350) NOT NULL,
    `role` TEXT NOT NULL,
    `name` VARCHAR(15) NOT NULL,
    `password` VARCHAR(255) NOT NULL,
    `email` VARCHAR(150) NOT NULL,
    `acceptCookies` BOOLEAN NOT NULL DEFAULT false,
    `avatarName` VARCHAR(100) NULL,
    `host` BOOLEAN NOT NULL DEFAULT false,
    `inmate` BOOLEAN NOT NULL DEFAULT false,
    `regDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `avatarName`(`avatarName`),
    INDEX `acceptCookies`(`acceptCookies`),
    INDEX `household_id`(`host`),
    INDEX `id-users`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `usersReviews` (
    `id` VARCHAR(350) NOT NULL,
    `rating` INTEGER NOT NULL,
    `content` TEXT NOT NULL,
    `userName` VARCHAR(20) NOT NULL,
    `userId` VARCHAR(350) NOT NULL,
    `date` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    UNIQUE INDEX `id`(`id`),
    INDEX `rating`(`rating`),
    INDEX `userId`(`userId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `dailyBudget` ADD CONSTRAINT `dailyBudget_ibfk_1` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `dailyTransactions` ADD CONSTRAINT `dailyTransactions_ibfk_1` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `householdUsers` ADD CONSTRAINT `householdUsers_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `households` ADD CONSTRAINT `households_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `initialMonthlyBudgets` ADD CONSTRAINT `initialMonthlyBudgets_ibfk_1` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_ibfk_1` FOREIGN KEY (`hostId`) REFERENCES `householdUsers`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_ibfk_2` FOREIGN KEY (`invitedUserId`) REFERENCES `householdUsers`(`userId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `invitations` ADD CONSTRAINT `invitations_ibfk_3` FOREIGN KEY (`invitingUserId`) REFERENCES `householdUsers`(`userId`) ON DELETE RESTRICT ON UPDATE RESTRICT;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_1` FOREIGN KEY (`senderId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `messages` ADD CONSTRAINT `messages_ibfk_2` FOREIGN KEY (`recipientId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthlyTransactionCounts` ADD CONSTRAINT `monthlyTransactionCounts_ibfk_1` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `monthly_balances` ADD CONSTRAINT `monthly_balances_ibfk_1` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_2` FOREIGN KEY (`houseId`) REFERENCES `households`(`houseId`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `transactions` ADD CONSTRAINT `transactions_ibfk_3` FOREIGN KEY (`catId`) REFERENCES `actionCategories`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `usersReviews` ADD CONSTRAINT `usersReviews_ibfk_1` FOREIGN KEY (`userId`) REFERENCES `users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

