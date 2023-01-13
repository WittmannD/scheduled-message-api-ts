/*
  Warnings:

  - Added the required column `peerId` to the `ScheduledMessage` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ScheduledMessage" ADD COLUMN     "peerId" TEXT NOT NULL;
