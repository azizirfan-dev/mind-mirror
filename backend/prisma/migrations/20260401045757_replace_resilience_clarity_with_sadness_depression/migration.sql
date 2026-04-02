/*
  Warnings:

  - You are about to drop the column `clarityScore` on the `JournalEntry` table. All the data in the column will be lost.
  - You are about to drop the column `resilienceScore` on the `JournalEntry` table. All the data in the column will be lost.

*/
-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp" WITH SCHEMA "extensions";

-- AlterTable
ALTER TABLE "JournalEntry" DROP COLUMN "clarityScore",
DROP COLUMN "resilienceScore",
ADD COLUMN     "depressionScore" INTEGER,
ADD COLUMN     "sadnessScore" INTEGER;
