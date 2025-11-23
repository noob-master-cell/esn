/*
  Warnings:

  - The values [CULTURAL,EDUCATIONAL,TRAVEL,VOLUNTEER,NETWORKING,WORKSHOP,CONFERENCE] on the enum `EventCategory` will be removed. If these variants are still used in the database, this will fail.
  - The values [REGISTRATION_OPEN,REGISTRATION_CLOSED,ONGOING] on the enum `EventStatus` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `cancellationPolicy` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `capacity` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `chapter` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `coordinates` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `coverImage` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `currency` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `esnCardPrice` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `images` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `registeredCount` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `registrationClose` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `registrationOpen` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `requireEsnCard` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `timezone` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `waitlistCount` on the `events` table. All the data in the column will be lost.
  - You are about to alter the column `price` on the `events` table. The data in that column could be lost. The data in that column will be cast from `Decimal(65,30)` to `DoublePrecision`.
  - Added the required column `maxParticipants` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EventType" AS ENUM ('FREE', 'PAID', 'MEMBERS_ONLY');

-- AlterEnum
BEGIN;
CREATE TYPE "EventCategory_new" AS ENUM ('PARTY', 'CULTURE', 'SPORTS', 'TRIP', 'SOCIAL', 'EDUCATION', 'OTHER');
ALTER TABLE "events" ALTER COLUMN "category" TYPE "EventCategory_new" USING ("category"::text::"EventCategory_new");
ALTER TYPE "EventCategory" RENAME TO "EventCategory_old";
ALTER TYPE "EventCategory_new" RENAME TO "EventCategory";
DROP TYPE "EventCategory_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "EventStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'CANCELLED', 'COMPLETED');
ALTER TABLE "events" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "events" ALTER COLUMN "status" TYPE "EventStatus_new" USING ("status"::text::"EventStatus_new");
ALTER TYPE "EventStatus" RENAME TO "EventStatus_old";
ALTER TYPE "EventStatus_new" RENAME TO "EventStatus";
DROP TYPE "EventStatus_old";
ALTER TABLE "events" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;

-- DropIndex
DROP INDEX "events_slug_key";

-- AlterTable
ALTER TABLE "events" DROP COLUMN "cancellationPolicy",
DROP COLUMN "capacity",
DROP COLUMN "chapter",
DROP COLUMN "coordinates",
DROP COLUMN "coverImage",
DROP COLUMN "currency",
DROP COLUMN "esnCardPrice",
DROP COLUMN "images",
DROP COLUMN "registeredCount",
DROP COLUMN "registrationClose",
DROP COLUMN "registrationOpen",
DROP COLUMN "requireEsnCard",
DROP COLUMN "slug",
DROP COLUMN "timezone",
DROP COLUMN "waitlistCount",
ADD COLUMN     "additionalInfo" TEXT,
ADD COLUMN     "imageUrl" TEXT,
ADD COLUMN     "maxParticipants" INTEGER NOT NULL,
ADD COLUMN     "memberPrice" DOUBLE PRECISION,
ADD COLUMN     "registrationDeadline" TIMESTAMP(3),
ADD COLUMN     "requirements" TEXT,
ADD COLUMN     "type" "EventType" NOT NULL,
ALTER COLUMN "price" DROP NOT NULL,
ALTER COLUMN "price" DROP DEFAULT,
ALTER COLUMN "price" SET DATA TYPE DOUBLE PRECISION;
