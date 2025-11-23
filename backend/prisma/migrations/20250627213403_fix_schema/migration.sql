/*
  Warnings:

  - The values [CULTURE,TRIP,EDUCATION] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('SOCIAL', 'CULTURAL', 'EDUCATIONAL', 'SPORTS', 'TRAVEL', 'VOLUNTEER', 'NETWORKING', 'PARTY', 'WORKSHOP', 'CONFERENCE', 'OTHER');
ALTER TABLE "events" ALTER COLUMN "category" TYPE "EventCategory_new" USING ("category"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "EventCategory_old";
COMMIT;

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "EventStatus" ADD VALUE 'REGISTRATION_OPEN';
ALTER TYPE "EventStatus" ADD VALUE 'REGISTRATION_CLOSED';
ALTER TYPE "EventStatus" ADD VALUE 'ONGOING';
