import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import { sqliteTable, integer, text } from "drizzle-orm/sqlite-core";
import dotenv from "dotenv";
dotenv.config();

const titles = [{ title: "🐧" }];

const client = createClient({
  url: process.env.DATABASE_URL as string,
  authToken: process.env.TURSO_AUTH_TOKEN as string,
});
const db = drizzle(client);
const titleTable = sqliteTable("Title", {
  id: integer("id").primaryKey({ autoIncrement: true }).notNull(),
  title: text("title").notNull(),
});

(async () => {
  console.log(`Seeding ${titles.length} titles...`);
  await db.delete(titleTable);
  await db
    .insert(titleTable)
    .values(titles)
    .then((r) =>
      console.log(
        `Seeded ${r.rows} titles!\n${titles.map((t, _) => `${_ + 1}: ${t.title}`).join("\n")}`,
      ),
    );
})();
