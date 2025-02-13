/*
  Warnings:

  - You are about to alter the column `name` on the `List` table. The data in that column could be lost. The data in that column will be cast from `VarChar(100)` to `VarChar(50)`.
  - You are about to alter the column `title` on the `Task` table. The data in that column could be lost. The data in that column will be cast from `VarChar(150)` to `VarChar(50)`.

*/
-- AlterTable
ALTER TABLE "List" ALTER COLUMN "name" SET DATA TYPE VARCHAR(50);

-- AlterTable
ALTER TABLE "Task" ALTER COLUMN "title" SET DATA TYPE VARCHAR(50);
