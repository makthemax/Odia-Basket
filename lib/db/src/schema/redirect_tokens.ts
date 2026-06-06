import { pgTable, text, serial, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const redirectTokensTable = pgTable("redirect_tokens", {
  id: serial("id").primaryKey(),
  token: text("token").notNull().unique(),
  targetUrl: text("target_url").notNull(),
  metadata: text("metadata"),
  used: boolean("used").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});

export const insertRedirectTokenSchema = createInsertSchema(redirectTokensTable).omit({ id: true, createdAt: true });
export type InsertRedirectToken = z.infer<typeof insertRedirectTokenSchema>;
export type RedirectToken = typeof redirectTokensTable.$inferSelect;
