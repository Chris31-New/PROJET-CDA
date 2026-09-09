/*
  Warnings:

  - A unique constraint covering the columns `[task_id,article_id]` on the table `Shopping_Line` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `description` to the `Project` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `Project` ADD COLUMN `description` TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `Shopping_Line_task_id_article_id_key` ON `Shopping_Line`(`task_id`, `article_id`);
