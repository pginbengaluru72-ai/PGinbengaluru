import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";

export function getAuth(env: { DB: D1Database }) {
  const db = drizzle(env.DB, { schema });
  
  return betterAuth({
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    // Optional: add Google OAuth or Phone OTP later here
  });
}
