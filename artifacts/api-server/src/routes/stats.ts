import { Router, type IRouter } from "express";
import { db, productsTable, categoriesTable } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { GetStoreSummaryResponse } from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/stats/summary", async (_req, res): Promise<void> => {
  const [productCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable);
  const [categoryCount] = await db.select({ count: sql<number>`count(*)` }).from(categoriesTable);
  const [featuredCount] = await db.select({ count: sql<number>`count(*)` }).from(productsTable).where(eq(productsTable.isFeatured, true));

  res.json(GetStoreSummaryResponse.parse({
    totalProducts: Number(productCount?.count ?? 0),
    totalCategories: Number(categoryCount?.count ?? 0),
    featuredCount: Number(featuredCount?.count ?? 0),
    deliveryAreas: [
      "Saheed Nagar",
      "Kharavela Nagar",
      "Janpath",
      "Nayapalli",
      "Mancheswar",
      "Unit 4",
      "Chandrasekharpur",
      "Bapuji Nagar",
      "Patia",
      "Jagamara",
    ],
    todayDeliverySlots: ["7:00 AM - 10:00 AM", "2:00 PM - 5:00 PM", "6:00 PM - 9:00 PM"],
  }));
});

export default router;
