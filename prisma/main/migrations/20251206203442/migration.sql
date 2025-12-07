-- CreateTable
CREATE TABLE "Link" (
    "_id" TEXT NOT NULL,
    "hash" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "link_items" (
    "_id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_items_pkey" PRIMARY KEY ("_id")
);

-- CreateTable
CREATE TABLE "link_settings" (
    "_id" TEXT NOT NULL,
    "linkId" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_settings_pkey" PRIMARY KEY ("_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Link_hash_key" ON "Link"("hash");

-- CreateIndex
CREATE INDEX "Link_domainId_idx" ON "Link"("domainId");

-- CreateIndex
CREATE INDEX "link_items_linkId_idx" ON "link_items"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_settings_linkId_key" ON "link_settings"("linkId");

-- CreateIndex
CREATE INDEX "link_settings_linkId_idx" ON "link_settings"("linkId");
