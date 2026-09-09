/*
  Warnings:

  - You are about to drop the column `address` on the `Company` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[address,city,postal_code]` on the table `Address` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Article` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId]` on the table `Company` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `Speciality` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `address_id` to the `Company` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Company` DROP COLUMN `address`,
    ADD COLUMN `address_id` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Address_address_city_postal_code_key` ON `Address`(`address`, `city`, `postal_code`);

-- CreateIndex
CREATE UNIQUE INDEX `Article_name_key` ON `Article`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Category_name_key` ON `Category`(`name`);

-- CreateIndex
CREATE UNIQUE INDEX `Company_userId_key` ON `Company`(`userId`);

-- CreateIndex
CREATE UNIQUE INDEX `Speciality_name_key` ON `Speciality`(`name`);

-- AddForeignKey
ALTER TABLE `Company` ADD CONSTRAINT `Company_address_id_fkey` FOREIGN KEY (`address_id`) REFERENCES `Address`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
