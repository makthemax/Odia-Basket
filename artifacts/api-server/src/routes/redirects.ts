import { Router, type IRouter } from "express";
import { db, redirectTokensTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const router: IRouter = Router();

function generateToken(): string {
  return randomBytes(24).toString("hex");
}

/**
 * POST /api/redirects
 * Create a one-time redirect token.
 */
router.post("/redirects", async (req, res): Promise<void> => {
  const { targetUrl, metadata, expiresMinutes } = req.body;

  if (!targetUrl || typeof targetUrl !== "string") {
    res.status(400).json({ error: "targetUrl is required" });
    return;
  }

  const token = generateToken();
  const expiresAt = expiresMinutes && Number(expiresMinutes) > 0
    ? new Date(Date.now() + Number(expiresMinutes) * 60 * 1000)
    : null;

  const [record] = await db
    .insert(redirectTokensTable)
    .values({
      token,
      targetUrl,
      metadata: metadata ?? null,
      expiresAt,
    })
    .returning();

  res.status(201).json({
    token: record.token,
    redirectUrl: `/api/redirects/${record.token}`,
    expiresAt: record.expiresAt?.toISOString() ?? null,
  });
});

/**
 * GET /api/redirects/:token
 * Redeem a one-time redirect token.
 */
router.get("/redirects/:token", async (req, res): Promise<void> => {
  const { token } = req.params;

  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  const [record] = await db
    .select()
    .from(redirectTokensTable)
    .where(eq(redirectTokensTable.token, token));

  if (!record) {
    res.status(404).json({ error: "Token not found" });
    return;
  }

  if (record.used) {
    res.status(410).json({ error: "Token already used" });
    return;
  }

  if (record.expiresAt && new Date() > record.expiresAt) {
    res.status(410).json({ error: "Token expired" });
    return;
  }

  // Mark as used
  await db
    .update(redirectTokensTable)
    .set({ used: true })
    .where(eq(redirectTokensTable.token, token));

  // Redirect to target URL
  res.redirect(302, record.targetUrl);
});

export default router;
