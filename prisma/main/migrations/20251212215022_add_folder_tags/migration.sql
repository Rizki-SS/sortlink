-- CreateTable
CREATE TABLE "links_folders" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "parentId" TEXT,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_folders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_tags" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_tags_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_rel_tags" (
    "linkId" UUID NOT NULL,
    "tagId" UUID NOT NULL,

    CONSTRAINT "link_rel_tags_pkey" PRIMARY KEY ("linkId","tagId")
);

-- CreateIndex
CREATE INDEX "link_rel_tags_linkId_idx" ON "link_rel_tags"("linkId");

-- CreateIndex
CREATE INDEX "link_rel_tags_tagId_idx" ON "link_rel_tags"("tagId");

-- AddForeignKey
ALTER TABLE "link_rel_tags" ADD CONSTRAINT "link_rel_tags_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links_shards"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_rel_tags" ADD CONSTRAINT "link_rel_tags_tagId_fkey" FOREIGN KEY ("tagId") REFERENCES "link_tags"("id") ON DELETE CASCADE ON UPDATE CASCADE;
