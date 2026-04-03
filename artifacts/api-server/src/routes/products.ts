import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and, type SQL } from "drizzle-orm";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  GetProductParams,
  GetProductResponse,
  GetFeaturedProductsResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function normalizeProduct(p: any) {
  return { ...p, price: Number(p.price) };
}

router.get("/products/featured", async (_req, res): Promise<void> => {
  const products = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .limit(12);
  res.json(GetFeaturedProductsResponse.parse(products.map(normalizeProduct)));
});

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, search, featured } = parsed.data;
  const conditions: SQL[] = [];

  if (categoryId != null) {
    conditions.push(eq(productsTable.categoryId, Number(categoryId)));
  }
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (featured === true) {
    conditions.push(eq(productsTable.isFeatured, true));
  }

  const products = conditions.length > 0
    ? await db.select().from(productsTable).where(and(...conditions)).orderBy(productsTable.id)
    : await db.select().from(productsTable).orderBy(productsTable.id);

  res.json(ListProductsResponse.parse(products.map(normalizeProduct)));
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetProductParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [product] = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.id, params.data.id));

  if (!product) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  res.json(GetProductResponse.parse(normalizeProduct(product)));
});

export default router;
