/*
  Warnings:

  - You are about to drop the column `tripId` on the `activities` table. All the data in the column will be lost.
  - You are about to drop the column `tripId` on the `links` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_activities" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "occurs_at" DATETIME NOT NULL,
    "trip_id" TEXT NOT NULL,
    CONSTRAINT "activities_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_activities" ("id", "occurs_at", "title", "trip_id") SELECT "id", "occurs_at", "title", "trip_id" FROM "activities";
DROP TABLE "activities";
ALTER TABLE "new_activities" RENAME TO "activities";
CREATE TABLE "new_links" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "title" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "trip_id" TEXT NOT NULL,
    CONSTRAINT "links_trip_id_fkey" FOREIGN KEY ("trip_id") REFERENCES "trips" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_links" ("id", "title", "trip_id", "url") SELECT "id", "title", "trip_id", "url" FROM "links";
DROP TABLE "links";
ALTER TABLE "new_links" RENAME TO "links";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
