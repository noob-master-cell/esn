-- CreateIndex
CREATE INDEX "events_status_isPublic_startDate_idx" ON "events"("status", "isPublic", "startDate");
