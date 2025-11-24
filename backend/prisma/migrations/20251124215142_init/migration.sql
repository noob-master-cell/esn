/*
  Warnings:

  - The values [WAITLISTED] on the enum `RegistrationStatus` will be removed. If these variants are still used in the database, this will fail.
  - The values [WAITLIST] on the enum `RegistrationType` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `allowWaitlist` on the `events` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationStatus_new" AS ENUM ('PENDING', 'CONFIRMED', 'CANCELLED', 'ATTENDED', 'NO_SHOW');
ALTER TABLE "public"."registrations" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "registrations" ALTER COLUMN "status" TYPE "RegistrationStatus_new" USING ("status"::text::"RegistrationStatus_new");
ALTER TYPE "RegistrationStatus" RENAME TO "RegistrationStatus_old";
ALTER TYPE "RegistrationStatus_new" RENAME TO "RegistrationStatus";
DROP TYPE "public"."RegistrationStatus_old";
ALTER TABLE "registrations" ALTER COLUMN "status" SET DEFAULT 'PENDING';
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "RegistrationType_new" AS ENUM ('REGULAR', 'VIP', 'ORGANIZER');
ALTER TABLE "public"."registrations" ALTER COLUMN "registrationType" DROP DEFAULT;
ALTER TABLE "registrations" ALTER COLUMN "registrationType" TYPE "RegistrationType_new" USING ("registrationType"::text::"RegistrationType_new");
ALTER TYPE "RegistrationType" RENAME TO "RegistrationType_old";
ALTER TYPE "RegistrationType_new" RENAME TO "RegistrationType";
DROP TYPE "public"."RegistrationType_old";
ALTER TABLE "registrations" ALTER COLUMN "registrationType" SET DEFAULT 'REGULAR';
COMMIT;

-- AlterEnum
ALTER TYPE "UserRole" ADD VALUE 'ORGANIZER';

-- AlterTable
ALTER TABLE "events" DROP COLUMN "allowWaitlist";

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "bio" TEXT,
ADD COLUMN     "emergencyContactName" TEXT,
ADD COLUMN     "emergencyContactPhone" TEXT,
ADD COLUMN     "instagram" TEXT,
ADD COLUMN     "telegram" TEXT;

-- CreateIndex
CREATE INDEX "registrations_eventId_status_idx" ON "registrations"("eventId", "status");
