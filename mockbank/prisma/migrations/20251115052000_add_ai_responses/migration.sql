-- CreateTable
CREATE TABLE "AiResponse" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "prompt" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "model" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AiResponse_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "AiResponse_userId_createdAt_idx" ON "AiResponse"("userId", "createdAt");

-- AddForeignKey
ALTER TABLE "AiResponse" ADD CONSTRAINT "AiResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
