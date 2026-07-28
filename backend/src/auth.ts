import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { drizzle } from "drizzle-orm/d1";
import * as schema from "./db/schema";

export function getAuth(env: { DB: D1Database }) {
  const db = drizzle(env.DB, { schema });
  
  return betterAuth({
    baseURL: "https://hsrpg-api.pginbengaluru72.workers.dev",
    trustedOrigins: ["https://pginbengaluru.pages.dev", "http://localhost:3000"],
    database: drizzleAdapter(db, {
      provider: "sqlite",
    }),
    emailAndPassword: {
      enabled: true,
    },
    advanced: {
      crossSubDomainCookies: {
        enabled: true,
      },
      defaultCookieAttributes: {
        sameSite: "none",
        secure: true
      }
    }
  });
}
