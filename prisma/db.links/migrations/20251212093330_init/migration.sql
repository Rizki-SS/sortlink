-- CreateTable
CREATE TABLE "links" (
    "id" BIGSERIAL NOT NULL,
    "hashId" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "note" TEXT,
    "folderId" TEXT,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_utm" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "utmSource" TEXT,
    "utmMedium" TEXT,
    "utmCampaign" TEXT,
    "utmTerm" TEXT,
    "utmContent" TEXT,
    "referrer" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_utm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_geolocation" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "country" TEXT,
    "url" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_geolocation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_ab_testing" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "urls" TEXT[],
    "started_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_ab_testing_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_protection" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "started_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "redirect_url" TEXT,
    "password" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_protection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_preview" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_preview_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "links_hashId_key" ON "links"("hashId");

-- CreateIndex
CREATE INDEX "links_domainId_hashId_idx" ON "links"("domainId", "hashId");

-- CreateIndex
CREATE UNIQUE INDEX "link_utm_linkId_key" ON "link_utm"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_geolocation_linkId_key" ON "link_geolocation"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_ab_testing_linkId_key" ON "link_ab_testing"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_protection_linkId_key" ON "link_protection"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_preview_linkId_key" ON "link_preview"("linkId");

-- AddForeignKey
ALTER TABLE "link_utm" ADD CONSTRAINT "link_utm_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_geolocation" ADD CONSTRAINT "link_geolocation_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_ab_testing" ADD CONSTRAINT "link_ab_testing_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_protection" ADD CONSTRAINT "link_protection_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_preview" ADD CONSTRAINT "link_preview_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
