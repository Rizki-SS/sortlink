-- CreateEnum
CREATE TYPE "LinkHealthStatus" AS ENUM ('Not Set', 'Ok', 'Warning', 'Critical');

-- CreateEnum
CREATE TYPE "LinkBehaviorType" AS ENUM ('Redirect', 'Iframe', 'Onsite', 'Offsite');

-- CreateTable
CREATE TABLE "link_health" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "status" "LinkHealthStatus" NOT NULL DEFAULT 'Not Set',
    "lastCheckedAt" TIMESTAMP(3),
    "nextCheckAt" TIMESTAMP(3),
    "checkInterval" INTEGER,
    "statusCode" INTEGER,
    "stringCode" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_health_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "link_behavior" (
    "id" BIGSERIAL NOT NULL,
    "linkId" BIGINT NOT NULL,
    "type" "LinkBehaviorType" NOT NULL DEFAULT 'Redirect',
    "target" TEXT,
    "waitTime" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "link_behavior_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "link_health_linkId_key" ON "link_health"("linkId");

-- CreateIndex
CREATE UNIQUE INDEX "link_behavior_linkId_key" ON "link_behavior"("linkId");

-- AddForeignKey
ALTER TABLE "link_health" ADD CONSTRAINT "link_health_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "link_behavior" ADD CONSTRAINT "link_behavior_linkId_fkey" FOREIGN KEY ("linkId") REFERENCES "links"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
