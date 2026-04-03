import { Router, type IRouter } from "express";
import { db, ordersTable, productsTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import {
  CreateOrderBody,
  ListOrdersQueryParams,
  ListOrdersResponse,
  GetOrderParams,
  GetOrderResponse,
  UpdateOrderStatusParams,
  UpdateOrderStatusBody,
  UpdateOrderStatusResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

function generateOrderNumber(): string {
  const date = new Date();
  const ymd = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `BBG-${ymd}-${rand}`;
}

function estimateDelivery(): string {
  const now = new Date();
  const deliveryHour = now.getHours() < 10 ? "14:00" : now.getHours() < 16 ? "19:00" : "08:00 (Tomorrow)";
  return deliveryHour;
}

router.get("/orders", async (req, res): Promise<void> => {
  const parsed = ListOrdersQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { phone } = parsed.data;
  const orders = phone
    ? await db.select().from(ordersTable).where(eq(ordersTable.phone, phone)).orderBy(ordersTable.id)
    : await db.select().from(ordersTable).orderBy(ordersTable.id);

  res.json(ListOrdersResponse.parse(orders.map(o => ({
    ...o,
    totalAmount: Number(o.totalAmount),
    items: Array.isArray(o.items) ? o.items : [],
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  }))));
});

router.post("/orders", async (req, res): Promise<void> => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { items, ...rest } = parsed.data;

  const productIds = items.map(i => i.productId);
  const products = productIds.length > 0
    ? await db.select().from(productsTable).where(eq(productsTable.id, productIds[0]))
    : [];

  const productMap: Record<number, { name: string; unit: string }> = {};
  for (const p of products) {
    productMap[p.id] = { name: p.name, unit: p.unit };
  }

  const allProducts = await db.select({ id: productsTable.id, name: productsTable.name, unit: productsTable.unit }).from(productsTable);
  for (const p of allProducts) {
    productMap[p.id] = { name: p.name, unit: p.unit };
  }

  const enrichedItems = items.map((item, idx) => ({
    id: idx + 1,
    productId: item.productId,
    productName: productMap[item.productId]?.name ?? "Unknown Product",
    quantity: item.quantity,
    unit: productMap[item.productId]?.unit ?? "kg",
    priceAtOrder: item.priceAtOrder,
  }));

  const orderNumber = generateOrderNumber();
  const estimatedDelivery = estimateDelivery();

  const [order] = await db
    .insert(ordersTable)
    .values({
      orderNumber,
      customerName: rest.customerName,
      phone: rest.phone,
      address: rest.address,
      locality: rest.locality,
      pincode: rest.pincode,
      status: "pending",
      paymentMethod: rest.paymentMethod,
      totalAmount: String(rest.totalAmount),
      notes: rest.notes ?? null,
      items: enrichedItems,
      estimatedDelivery,
    })
    .returning();

  res.status(201).json(GetOrderResponse.parse({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: Array.isArray(order.items) ? order.items : [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

router.get("/orders/:id", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = GetOrderParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [order] = await db
    .select()
    .from(ordersTable)
    .where(eq(ordersTable.id, params.data.id));

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(GetOrderResponse.parse({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: Array.isArray(order.items) ? order.items : [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

router.patch("/orders/:id/status", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.id) ? req.params.id[0] : req.params.id;
  const params = UpdateOrderStatusParams.safeParse({ id: parseInt(raw, 10) });
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const parsed = UpdateOrderStatusBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [order] = await db
    .update(ordersTable)
    .set({ status: parsed.data.status })
    .where(eq(ordersTable.id, params.data.id))
    .returning();

  if (!order) {
    res.status(404).json({ error: "Order not found" });
    return;
  }

  res.json(UpdateOrderStatusResponse.parse({
    ...order,
    totalAmount: Number(order.totalAmount),
    items: Array.isArray(order.items) ? order.items : [],
    createdAt: order.createdAt.toISOString(),
    updatedAt: order.updatedAt.toISOString(),
  }));
});

export default router;
