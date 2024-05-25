ALTER TABLE "User" ADD COLUMN "titleId" INTEGER;

PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Title" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL
);
INSERT INTO "new_Title" ("id", "title") SELECT "id", "title" FROM "Title";
DROP TABLE "Title";
ALTER TABLE "new_Title" RENAME TO "Title";
CREATE TABLE "new__TitleToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL,
    CONSTRAINT "_TitleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Title" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_TitleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new__TitleToUser" ("A", "B") SELECT "A", "B" FROM "_TitleToUser";
DROP TABLE "_TitleToUser";
ALTER TABLE "new__TitleToUser" RENAME TO "_TitleToUser";
CREATE UNIQUE INDEX "_TitleToUser_AB_unique" ON "_TitleToUser"("A", "B");
CREATE INDEX "_TitleToUser_B_index" ON "_TitleToUser"("B");
PRAGMA foreign_key_check("Title");
PRAGMA foreign_key_check("_TitleToUser");
PRAGMA foreign_keys=ON;
