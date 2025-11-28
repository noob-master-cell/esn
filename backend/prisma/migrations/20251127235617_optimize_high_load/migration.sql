-- CreateIndex
CREATE INDEX "users_esnCardVerified_idx" ON "users"("esnCardVerified");

-- CreateIndex
CREATE INDEX "users_university_idx" ON "users"("university");

-- CreateIndex
CREATE INDEX "users_role_isActive_idx" ON "users"("role", "isActive");
