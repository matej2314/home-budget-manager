-- Align householdUsers.houseId with Prisma schema (String?) and app (NULL = brak domu).
-- 0_init had NOT NULL DEFAULT '0'; explicit NULL from registerUser fails under that DDL.
ALTER TABLE `householdUsers` MODIFY `houseId` VARCHAR(350) NULL;
UPDATE `householdUsers` SET `houseId` = NULL WHERE `houseId` = '0';
