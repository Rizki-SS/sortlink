-- CreateEnum
CREATE TYPE "DomainType" AS ENUM ('PUBLIC', 'PRIVATE');

-- CreateTable
CREATE TABLE "domains" (
    "id" UUID NOT NULL,
    "name" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "teamId" TEXT,
    "type" "DomainType" NOT NULL DEFAULT 'PUBLIC',
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "domains_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "links_shards" (
    "id" UUID NOT NULL,
    "hashId" TEXT NOT NULL,
    "domainId" TEXT NOT NULL,
    "shardKey" TEXT NOT NULL,
    "teamId" TEXT,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "links_shards_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "domains_name_key" ON "domains"("name");

-- CreateIndex
CREATE UNIQUE INDEX "links_shards_hashId_key" ON "links_shards"("hashId");

-- CreateIndex
CREATE INDEX "links_shards_shardKey_idx" ON "links_shards"("shardKey");
