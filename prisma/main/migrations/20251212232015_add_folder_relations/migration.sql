/*
  Warnings:

  - The `parentId` column on the `links_folders` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "links_folders" DROP COLUMN "parentId",
ADD COLUMN     "parentId" UUID;

-- AlterTable
ALTER TABLE "links_shards" ADD COLUMN     "folderId" UUID;

-- AddForeignKey
ALTER TABLE "links_shards" ADD CONSTRAINT "links_shards_folderId_fkey" FOREIGN KEY ("folderId") REFERENCES "links_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "links_folders" ADD CONSTRAINT "links_folders_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "links_folders"("id") ON DELETE SET NULL ON UPDATE CASCADE;
