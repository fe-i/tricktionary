import type { Config } from "drizzle-kit";
import { env } from "~/env.js";

export default {
  schema: "./drizzle/schema.ts",
  out: "./drizzle",
  driver: "turso",
  dbCredentials: {
    url: env.DATABASE_URL as string,
    authToken: env.TURSO_AUTH_TOKEN as string,
  },
} satisfies Config;
