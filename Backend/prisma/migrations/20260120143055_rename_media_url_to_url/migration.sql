/*
  Warnings:

  - You are about to drop the column `mediaUrl` on the `event_media` table. All the data in the column will be lost.
  - Added the required column `url` to the `event_media` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "event_media" DROP COLUMN "mediaUrl",
ADD COLUMN     "url" TEXT NOT NULL;
