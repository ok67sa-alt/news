-- AlterTable
ALTER TABLE "Article" ADD COLUMN "hero" BOOLEAN NOT NULL DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN "Article"."hero" IS 'Mark article as main hero story for homepage carousel';
