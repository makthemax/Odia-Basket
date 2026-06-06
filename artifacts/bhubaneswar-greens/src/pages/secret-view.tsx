import { useState, useEffect } from "react";
import { useRoute } from "wouter";
import { Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Flame, Eye, Check, Copy, AlertTriangle } from "lucide-react";

interface SecretData {
  content: string;
  viewed: boolean;
  viewedAt: string | null;
}

export default function SecretView() {
  const [match, params] = useRoute("/secret/:token");
  const [secret, setSecret] = useState<SecretData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [burned, setBurned] = useState(false);
  const [copied, setCopied] = useState(false);

  const token = params?.token;

  useEffect(() => {
    if (!token) return;
    setLoading(true);
    fetch(`/api/secrets/${token}`)
      .then(async (res) => {
        const data = await res.json();
        if (res.ok) {
          setSecret(data);
        } else {
          setError(data.error || "Failed to load secret");
          if (res.status === 410) {
            setBurned(true);
          }
        }
      })
      .catch(() => setError("Failed to load secret"))
      .finally(() => setLoading(false));
  }, [token]);

  function copyContent() {
    if (!secret) return;
    navigator.clipboard.writeText(secret.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  if (loading) {
    return (
      <div className="max-w-xl mx-auto py-10 flex items-center justify-center h-40">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-amber-600 border-t-transparent" />
      </div>
    );
  }

  if (error) {
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
          <div className="flex items-center gap-2 text-red-600">
            <AlertTriangle className="h-5 w-5" />
            <h1 className="text-lg font-bold">{burned ? "This Secret Has Burned" : "Error"}</h1>
          </div>
          <p className="text-sm text-muted-foreground">{error}</p>
          {burned && (
            <div className="bg-red-50 border border-red-200 rounded-xl p-3">
              <p className="text-xs text-red-800">
                This secret was a burn-after-reading link. Someone already opened it and now it's gone forever.
              </p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (!secret) return null;

  return (
    <div className="max-w-xl mx-auto py-10">
      <div className="flex items-center gap-2 mb-6">
        <Link href="/" className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back
        </Link>
      </div>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-card border border-card-border rounded-2xl p-6 space-y-4"
        >
          <div className="flex items-center gap-2 text-amber-600">
            <Eye className="h-5 w-5" />
            <h1 className="text-lg font-bold">You have opened a secret</h1>
          </div>
          <div className="bg-muted rounded-xl p-4 relative group">
            <pre className="text-sm whitespace-pre-wrap font-sans text-foreground leading-relaxed">{secret.content}</pre>
            <Button
              size="sm"
              variant="outline"
              onClick={copyContent}
              className="absolute top-2 right-2 gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? "Copied" : "Copy"}
            </Button>
          </div>
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 flex items-start gap-2">
            <Flame className="h-4 w-4 text-amber-700 mt-0.5 shrink-0" />
            <p className="text-xs text-amber-800">
              This was a burn-after-reading link. If you close this page and someone else tries to open it, they will see nothing. It's gone forever.
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
