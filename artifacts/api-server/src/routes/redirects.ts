import { Router, type IRouter } from "express";
import { db, redirectTokensTable } from "@workspace/db";
import { eq } from "drizzle-orm";
import { randomBytes } from "crypto";

const router: IRouter = Router();

function generateToken(): string {
  return randomBytes(24).toString("hex");
}

/**
 * POST /api/secrets
 * Create a burn-after-reading secret.
 */
router.post("/secrets", async (req, res): Promise<void> => {
  const { content, expiresMinutes } = req.body;

  if (!content || typeof content !== "string") {
    res.status(400).json({ error: "content is required" });
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
      content,
      expiresAt,
    })
    .returning();

  res.status(201).json({
    token: record.token,
    secretUrl: `/api/secrets/${record.token}`,
    expiresAt: record.expiresAt?.toISOString() ?? null,
  });
});

/**
 * GET /api/secrets/:token
 * View a burn-after-reading secret.
 * The viewer sees it once, then it's burned. The creator can view anytime.
 */
router.get("/secrets/:token", async (req, res): Promise<void> => {
  const { token } = req.params;
  const isAdmin = req.query.admin === "true";

  if (!token || typeof token !== "string") {
    res.status(400).json({ error: "Token is required" });
    return;
  }

  const [record] = await db
    .select()
    .from(redirectTokensTable)
    .where(eq(redirectTokensTable.token, token));

  if (!record) {
    res.status(404).json({ error: "Secret not found" });
    return;
  }

  if (record.expiresAt && new Date() > record.expiresAt) {
    res.status(410).json({ error: "Secret expired" });
    return;
  }

  // If already viewed and not admin, it's burned
  if (record.viewed && !isAdmin) {
    res.status(410).json({ error: "This secret has already been viewed. It was a burn-after-reading link." });
    return;
  }

  // Mark as viewed (only the first time)
  if (!record.viewed) {
    await db
      .update(redirectTokensTable)
      .set({ viewed: true, viewedAt: new Date() })
      .where(eq(redirectTokensTable.token, token));
  }

  res.json({
    content: record.content,
    viewed: true,
    viewedAt: record.viewedAt ? new Date().toISOString() : null,
  });
});

export default router;
