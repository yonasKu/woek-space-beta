/*
  Warnings:

  - The `reviewer` column on the `outlines` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "outlines" DROP COLUMN "reviewer",
ADD COLUMN     "reviewer" TEXT;

-- DropEnum
DROP TYPE "Reviewer";
