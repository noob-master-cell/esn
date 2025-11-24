/*
  Warnings:

  - You are about to drop the column `imageUrl` on the `events` table. All the data in the column will be lost.

*/
-- Step 1: Add new images column
ALTER TABLE "events" ADD COLUMN "images" TEXT[] DEFAULT ARRAY[]::TEXT[];

-- Step 2: Migrate existing imageUrl data to images array
UPDATE "events" 
SET "images" = ARRAY["imageUrl"] 
WHERE "imageUrl" IS NOT NULL AND "imageUrl" != '';

-- Step 3: Drop the old imageUrl column
ALTER TABLE "events" DROP COLUMN "imageUrl";
