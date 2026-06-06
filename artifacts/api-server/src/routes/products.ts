import { Router, type IRouter } from "express";
import { db, productsTable } from "@workspace/db";
import { eq, ilike, and, inArray, isNull, type SQL } from "drizzle-orm";
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

async function embedOrganicVariants(products: any[]): Promise<any[]> {
  if (products.length === 0) return [];
  const ids = products.map((p) => p.id);
  const variants = await db
    .select()
    .from(productsTable)
    .where(
      and(
        eq(productsTable.isOrganic, true),
        inArray(productsTable.parentProductId, ids)
      )
    );
  const byParent: Record<number, any> = {};
  for (const v of variants) {
    if (v.parentProductId != null) {
      byParent[v.parentProductId] = {
        id: v.id,
        price: Number(v.price),
        isComingSoon: v.isComingSoon,
      };
    }
  }
  return products.map((p) => ({
    ...p,
    organicVariant: byParent[p.id] ?? null,
  }));
}

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.isFeatured, true), eq(productsTable.isOrganic, false)))
    .limit(12);
  const products = await embedOrganicVariants(rows.map(normalizeProduct));
  res.json(GetFeaturedProductsResponse.parse(products));
});

router.get("/products", async (req, res): Promise<void> => {
  const parsed = ListProductsQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { categoryId, search, featured } = parsed.data;
  const conditions: SQL[] = [eq(productsTable.isOrganic, false)];

  if (categoryId != null) {
    conditions.push(eq(productsTable.categoryId, Number(categoryId)));
  }
  if (search) {
    conditions.push(ilike(productsTable.name, `%${search}%`));
  }
  if (featured === true) {
    conditions.push(eq(productsTable.isFeatured, true));
  }

  const rows = await db
    .select()
    .from(productsTable)
    .where(and(...conditions))
    .orderBy(productsTable.id);

  const products = await embedOrganicVariants(rows.map(normalizeProduct));
  res.json(ListProductsResponse.parse(products));
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

  const normalized = normalizeProduct(product);

  if (!normalized.isOrganic) {
    const [embedded] = await embedOrganicVariants([normalized]);
    res.json(GetProductResponse.parse(embedded));
  } else {
    res.json(GetProductResponse.parse({ ...normalized, organicVariant: null }));
  }
});

export default router;
