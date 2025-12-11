-- CreateTable
CREATE TABLE "links" (
    "id" BIGSERIAL NOT NULL,
    "hashId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_items" (
    "id" BIGSERIAL NOT NULL,
    "linkId" TEXT NOT NULL,
    "item" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_settings" (
    "id" BIGSERIAL NOT NULL,
    "linkId" TEXT NOT NULL,
    "setting" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_settings_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_hashId_key" ON "links"("hashId");

-- CreateIndex
CREATE INDEX "links_domainId_hashId_idx" ON "links"("domainId", "hashId");

-- CreateIndex
CREATE INDEX "link_items_linkId_idx" ON "link_items"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_settings_linkId_key" ON "link_settings"("linkId");
