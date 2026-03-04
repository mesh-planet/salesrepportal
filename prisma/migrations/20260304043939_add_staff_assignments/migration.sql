-- CreateTable
CREATE TABLE "StaffAssignment" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "shop" TEXT NOT NULL,
    "staffId" TEXT NOT NULL,
    "companyLocationId" TEXT NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateIndex
CREATE INDEX "StaffAssignment_shop_staffId_idx" ON "StaffAssignment"("shop", "staffId");

-- CreateIndex
CREATE UNIQUE INDEX "StaffAssignment_shop_staffId_companyLocationId_key" ON "StaffAssignment"("shop", "staffId", "companyLocationId");
