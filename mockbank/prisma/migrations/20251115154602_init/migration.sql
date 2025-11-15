-- DropForeignKey
ALTER TABLE "AiResponse" DROP CONSTRAINT "AiResponse_userId_fkey";

-- AddForeignKey
ALTER TABLE "AiResponse" ADD CONSTRAINT "AiResponse_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
