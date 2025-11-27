-- CreateIndex
CREATE INDEX "payments_status_createdAt_idx" ON "payments"("status", "createdAt");

-- CreateIndex
CREATE INDEX "registrations_status_registeredAt_idx" ON "registrations"("status", "registeredAt");

-- CreateIndex
CREATE INDEX "users_isActive_idx" ON "users"("isActive");
