import { pgTable, text, serial, integer, boolean, numeric } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod/v4";

export const productsTable = pgTable("products", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  nameOdia: text("name_odia").notNull(),
  description: text("description"),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  unit: text("unit").notNull().default("kg"),
  imageUrl: text("image_url"),
  categoryId: integer("category_id").notNull(),
  categoryName: text("category_name").notNull(),
  inStock: boolean("in_stock").notNull().default(true),
  isFeatured: boolean("is_featured").notNull().default(false),
  isSeasonal: boolean("is_seasonal").notNull().default(false),
  discountPercent: integer("discount_percent").notNull().default(0),
  farmName: text("farm_name"),
  origin: text("origin"),
  isComingSoon: boolean("is_coming_soon").notNull().default(false),
});

export const insertProductSchema = createInsertSchema(productsTable).omit({ id: true });
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type Product = typeof productsTable.$inferSelect;
