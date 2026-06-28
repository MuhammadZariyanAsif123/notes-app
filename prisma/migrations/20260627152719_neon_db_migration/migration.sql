-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "vector" WITH SCHEMA "public";

-- AlterTable
ALTER TABLE "Note" ADD COLUMN     "embedding" vector(768);
