-- CreateEnum
CREATE TYPE "MessageStatus" AS ENUM ('AWAIT', 'FAILED', 'PROCESSED', 'SUCCEEDED');

-- CreateTable
CREATE TABLE "ScheduledMessage" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "userId" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "payload" TEXT,
    "timeForDispatch" TIMESTAMP(3) NOT NULL,
    "token" TEXT NOT NULL,
    "status" "MessageStatus" NOT NULL DEFAULT 'AWAIT',

    CONSTRAINT "ScheduledMessage_pkey" PRIMARY KEY ("id")
);
