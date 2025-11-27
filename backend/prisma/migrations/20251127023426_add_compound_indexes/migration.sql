/*
  Warnings:

  - The values [STRIPE] on the enum `PaymentMethod` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `stripeFeeAmount` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripePaymentIntentId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `stripeSessionId` on the `payments` table. All the data in the column will be lost.
  - You are about to drop the column `emailEvents` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `emailNewsletter` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `emailPromotions` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the column `emailReminders` on the `user_preferences` table. All the data in the column will be lost.
  - You are about to drop the `notification_settings` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "PaymentMethod_new" AS ENUM ('CASH', 'BANK_TRANSFER', 'FREE');
ALTER TABLE "payments" ALTER COLUMN "method" DROP DEFAULT;
ALTER TABLE "payments" ALTER COLUMN "method" TYPE "PaymentMethod_new" USING ("method"::text::"PaymentMethod_new");
ALTER TYPE "PaymentMethod" RENAME TO "PaymentMethod_old";
ALTER TYPE "PaymentMethod_new" RENAME TO "PaymentMethod";
DROP TYPE "PaymentMethod_old";
ALTER TABLE "payments" ALTER COLUMN "method" SET DEFAULT 'CASH';
COMMIT;

-- DropForeignKey
ALTER TABLE "notification_settings" DROP CONSTRAINT "notification_settings_userId_fkey";

-- DropIndex
DROP INDEX "payments_stripePaymentIntentId_key";

-- DropIndex
DROP INDEX "payments_stripeSessionId_key";

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "isUnlimited" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "payments" DROP COLUMN "stripeFeeAmount",
DROP COLUMN "stripePaymentIntentId",
DROP COLUMN "stripeSessionId",
ALTER COLUMN "method" SET DEFAULT 'CASH';

-- AlterTable
ALTER TABLE "user_preferences" DROP COLUMN "emailEvents",
DROP COLUMN "emailNewsletter",
DROP COLUMN "emailPromotions",
DROP COLUMN "emailReminders";

-- DropTable
DROP TABLE "notification_settings";

-- CreateIndex
CREATE INDEX "comments_userId_idx" ON "comments"("userId");

-- CreateIndex
CREATE INDEX "events_organizerId_idx" ON "events"("organizerId");

-- CreateIndex
CREATE INDEX "events_category_idx" ON "events"("category");

-- CreateIndex
CREATE INDEX "events_type_idx" ON "events"("type");

-- CreateIndex
CREATE INDEX "events_category_startDate_status_idx" ON "events"("category", "startDate", "status");

-- CreateIndex
CREATE INDEX "events_type_status_startDate_idx" ON "events"("type", "status", "startDate");

-- CreateIndex
CREATE INDEX "events_organizerId_status_startDate_idx" ON "events"("organizerId", "status", "startDate");

-- CreateIndex
CREATE INDEX "events_location_startDate_idx" ON "events"("location", "startDate");

-- CreateIndex
CREATE INDEX "feedbacks_userId_idx" ON "feedbacks"("userId");

-- CreateIndex
CREATE INDEX "payments_userId_idx" ON "payments"("userId");

-- CreateIndex
CREATE INDEX "payments_eventId_idx" ON "payments"("eventId");

-- CreateIndex
CREATE INDEX "registrations_userId_idx" ON "registrations"("userId");

-- CreateIndex
CREATE INDEX "registrations_paymentStatus_idx" ON "registrations"("paymentStatus");

-- CreateIndex
CREATE INDEX "registrations_userId_status_registeredAt_idx" ON "registrations"("userId", "status", "registeredAt");

-- CreateIndex
CREATE INDEX "registrations_eventId_paymentStatus_idx" ON "registrations"("eventId", "paymentStatus");

-- CreateIndex
CREATE INDEX "reviews_userId_idx" ON "reviews"("userId");

-- CreateIndex
CREATE INDEX "reviews_eventId_idx" ON "reviews"("eventId");

-- CreateIndex
CREATE INDEX "users_createdAt_idx" ON "users"("createdAt");

-- CreateIndex
CREATE INDEX "users_role_idx" ON "users"("role");
