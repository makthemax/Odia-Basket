import { useState } from "react";
import { useLocation } from "wouter";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Copy, Check, ArrowLeft, Flame, Clock, Eye } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function SecretCreate() {
  const [content, setContent] = useState("");
  const [expiresMinutes, setExpiresMinutes] = useState("60");
  const [createdSecret, setCreatedSecret] = useState<{
    token: string;
    secretUrl: string;
    expiresAt: string | null;
  } | null>(null);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const [, navigate] = useLocation();

  async function createSecret() {
    if (!content.trim()) {
      toast({ title: "Secret is empty", description: "Please type something to share." });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/secrets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: content.trim(),
          expiresMinutes: Number(expiresMinutes) || null,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreatedSecret(data);
      } else {
        toast({ title: "Error", description: data.error || "Failed to create secret", variant: "destructive" });
      }
    } catch {
      toast({ title: "Error", description: "Failed to create secret", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }

  function copySecretUrl() {
    if (!createdSecret) return;
    const url = `${window.location.origin}${createdSecret.secretUrl}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (createdSecret) {
    const fullUrl = `${window.location.origin}${createdSecret.secretUrl}`;
    return (
      <div className="max-w-xl mx-auto py-10">
        <div className="flex items-center gap-2 mb-6">
          <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <ArrowLeft className="h-4 w-4" /> Back
          </Link>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-600">
            <Flame className="h-5 w-5" />
            <h1 className="text-lg font-bold">Secret Created!</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Share this link. The first person who opens it will see your secret. Once viewed, it burns forever.
          </p>
          <div className="bg-muted rounded-xl p-3 space-y-2">
            <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">Secret Link</p>
            <div className="flex items-center gap-2">
              <code className="text-xs font-mono break-all flex-1 text-foreground">{fullUrl}</code>
              <Button size="sm" variant="outline" onClick={copySecretUrl} className="shrink-0 gap-1">
                {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                {copied ? "Copied" : "Copy"}
              </Button>
            </div>
          </div>
          {createdSecret.expiresAt && (
            <div className="flex items-center gap-1.5 text-xs text-amber-600">
              <Clock className="h-3.5 w-3.5" />
              Expires at {new Date(createdSecret.expiresAt).toLocaleString()}
            </div>
          )}
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 space-y-2">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-amber-700" />
              <p className="text-sm font-bold text-amber-900">You can always view this secret</p>
            </div>
            <p className="text-xs text-amber-800">
              Add <code className="font-mono">?admin=true</code> to the URL to view it anytime, even after it has been burned.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <div className="space-y-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Flame className="h-5 w-5 text-amber-600" />
            <h1 className="text-xl font-bold">Burn After Reading</h1>
          </div>
          <p className="text-sm text-muted-foreground">
            Create a secret link that can only be viewed once. The first person who opens it sees it, then it burns forever.
          </p>
        </div>
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
          <div className="space-y-2">
            <Label className="text-sm">Your Secret</Label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Type your secret message here..."
              className="min-h-[120px] rounded-xl"
              maxLength={5000}
            />
            <p className="text-[10px] text-muted-foreground text-right">{content.length}/5000</p>
          </div>
          <div className="space-y-2">
            <Label className="text-sm">Auto-expire after (minutes)</Label>
            <Input
              type="number"
              value={expiresMinutes}
              onChange={(e) => setExpiresMinutes(e.target.value)}
              min="1"
              max="10080"
              className="h-10 rounded-xl"
              placeholder="Leave empty for no expiry"
            />
            <p className="text-[10px] text-muted-foreground">Optional. If set, the link expires after this time even if not viewed.</p>
          </div>
          <Button
            onClick={createSecret}
            disabled={loading || !content.trim()}
            className="w-full h-12 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold"
          >
            {loading ? "Creating..." : "Create Secret Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
