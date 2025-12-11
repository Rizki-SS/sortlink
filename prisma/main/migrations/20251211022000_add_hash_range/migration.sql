/*
  Warnings:

  - Added the required column `hashRange` to the `links_shards` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "links_shards" ADD COLUMN     "hashRange" BIGINT;
