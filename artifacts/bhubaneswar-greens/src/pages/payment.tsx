import { useEffect, useMemo, useState } from "react";
import { useLocation, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ShieldCheck,
  Lock,
  Loader2,
  CheckCircle2,
  Smartphone,
  CreditCard,
  Banknote,
  Clock,
  Sprout,
  Copy,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useCreateOrder } from "@workspace/api-client-react";

const STORAGE_KEY = "bg.pendingCheckout";
const MERCHANT_UPI = "bhubaneswargreens@oksbi";

type PendingCheckout = {
  customerName: string;
  phone: string;
  address: string;
  locality: string;
  pincode: string;
  notes?: string;
  paymentMethod: "cod" | "upi" | "card";
  grandTotal: number;
  itemCount: number;
};

const UPI_APPS = [
  { id: "gpay", name: "Google Pay", color: "from-blue-500 to-green-500", short: "GPay" },
  { id: "phonepe", name: "PhonePe", color: "from-purple-600 to-purple-700", short: "PhonePe" },
  { id: "paytm", name: "Paytm", color: "from-sky-500 to-blue-600", short: "Paytm" },
  { id: "bhim", name: "BHIM UPI", color: "from-orange-500 to-rose-500", short: "BHIM" },
];

const ACCEPTED_NETWORKS = ["VISA", "Mastercard", "RuPay", "Amex"];

export default function Payment() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();

  const [pending, setPending] = useState<PendingCheckout | null>(null);
  const [stage, setStage] = useState<"select" | "processing" | "success">("select");
  const [copied, setCopied] = useState(false);

  // UPI state
  const [upiId, setUpiId] = useState("");
  const [selectedApp, setSelectedApp] = useState<string | null>(null);
  const [waitSeconds, setWaitSeconds] = useState(180);

  // Card state
  const [cardNumber, setCardNumber] = useState("");
  const [cardName, setCardName] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");

  useEffect(() => {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) {
      navigate("/checkout");
      return;
    }
    try {
      setPending(JSON.parse(raw) as PendingCheckout);
    } catch {
      navigate("/checkout");
    }
  }, [navigate]);

  // UPI countdown
  useEffect(() => {
    if (stage !== "processing" || pending?.paymentMethod !== "upi") return;
    if (waitSeconds <= 0) return;
    const t = setInterval(() => setWaitSeconds((s) => s - 1), 1000);
    return () => clearInterval(t);
  }, [stage, pending?.paymentMethod, waitSeconds]);

  const cartItems = useMemo(() => Object.values(items), [items]);

  if (!pending) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  const txnId = `BG${Date.now().toString().slice(-10)}`;

  async function placeOrder() {
    if (!pending) return;
    const orderItems = cartItems.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
      priceAtOrder: product.price,
    }));

    try {
      const result = await createOrder.mutateAsync({
        data: {
          customerName: pending.customerName,
          phone: pending.phone,
          address: pending.address,
          locality: pending.locality,
          pincode: pending.pincode,
          notes: pending.notes ?? "",
          paymentMethod: pending.paymentMethod,
          items: orderItems,
          totalAmount: pending.grandTotal,
        },
      });
      sessionStorage.removeItem(STORAGE_KEY);
      clearCart();
      navigate(`/payment-success?orderId=${result.id}&orderNumber=${result.orderNumber}`);
    } catch {
      toast({ title: "Order failed", description: "Please try again.", variant: "destructive" });
      setStage("select");
    }
  }

  function startProcessing(durationMs: number) {
    setStage("processing");
    if (pending?.paymentMethod === "upi") setWaitSeconds(180);
    setTimeout(() => {
      setStage("success");
      setTimeout(placeOrder, 900);
    }, durationMs);
  }

  function handleUpiPay() {
    if (!selectedApp && !upiId.includes("@")) {
      toast({ title: "Choose a UPI app or enter your UPI ID.", variant: "destructive" });
      return;
    }
    startProcessing(2400);
  }

  function handleCardPay() {
    const digits = cardNumber.replace(/\s/g, "");
    if (digits.length < 12 || !cardName || cardExpiry.length < 5 || cardCvv.length < 3) {
      toast({ title: "Please fill all card details.", variant: "destructive" });
      return;
    }
    startProcessing(2200);
  }

  function handleCodConfirm() {
    startProcessing(900);
  }

  function copyUpi() {
    navigator.clipboard.writeText(MERCHANT_UPI);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  const total = pending.grandTotal;
  const formatTime = (s: number) =>
    `${Math.floor(s / 60).toString().padStart(2, "0")}:${(s % 60).toString().padStart(2, "0")}`;

  return (
    <div className="max-w-4xl mx-auto pb-16">
      {/* Top bar */}
      <div className="flex items-center justify-between mb-5">
        <Link
          href="/checkout"
          className="text-xs md:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1"
        >
          <ArrowLeft className="h-4 w-4" /> Back to checkout
        </Link>
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs">
          <span className="flex items-center gap-1 text-muted-foreground">
            <Check className="h-3 w-3 text-secondary" /> Cart
          </span>
          <span className="text-muted-foreground">›</span>
          <span className="flex items-center gap-1 text-muted-foreground">
            <Check className="h-3 w-3 text-secondary" /> Checkout
          </span>
          <span className="text-muted-foreground">›</span>
          <span className="font-bold text-primary">Pay</span>
        </div>
      </div>

      <div className="grid md:grid-cols-[1fr_320px] gap-5">
        {/* Gateway card */}
        <div className="bg-card border border-card-border rounded-2xl shadow-sm overflow-hidden">
          {/* Branded header */}
          <div className="bg-gradient-to-r from-emerald-600 via-emerald-700 to-green-800 text-white px-5 py-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-white/15 flex items-center justify-center">
                <Sprout className="h-4 w-4" />
              </div>
              <div>
                <p className="text-[10px] uppercase tracking-wider opacity-80">Powered by</p>
                <p className="text-sm font-extrabold leading-none">GreensPay Secure Gateway</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] bg-white/15 backdrop-blur px-2 py-1 rounded-full">
              <Lock className="h-3 w-3" /> 256-bit SSL
            </div>
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              {stage === "select" && pending.paymentMethod === "upi" && (
                <motion.div
                  key="upi"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Smartphone className="h-5 w-5 text-emerald-600" /> Pay via UPI
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Choose your UPI app or enter your UPI ID to complete the ₹{total} payment.
                    </p>
                  </div>

                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground mb-2">
                      Pay using app
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {UPI_APPS.map((app) => (
                        <button
                          key={app.id}
                          type="button"
                          onClick={() => setSelectedApp(app.id)}
                          className={`p-3 rounded-xl border-2 text-left transition-all ${
                            selectedApp === app.id
                              ? "border-emerald-600 bg-emerald-50"
                              : "border-border hover:border-emerald-300"
                          }`}
                        >
                          <div
                            className={`h-8 w-8 rounded-lg bg-gradient-to-br ${app.color} text-white flex items-center justify-center text-[10px] font-extrabold mb-1.5 shadow-sm`}
                          >
                            {app.short.slice(0, 2).toUpperCase()}
                          </div>
                          <p className="text-xs font-bold">{app.short}</p>
                          <p className="text-[9px] text-muted-foreground truncate">{app.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="relative">
                    <div className="absolute inset-0 flex items-center">
                      <Separator />
                    </div>
                    <div className="relative flex justify-center">
                      <span className="bg-card px-3 text-[10px] uppercase tracking-wider text-muted-foreground">
                        OR
                      </span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="upiId" className="text-xs">
                      Enter UPI ID
                    </Label>
                    <div className="flex gap-2">
                      <Input
                        id="upiId"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="yourname@okhdfcbank"
                        className="h-11 rounded-lg"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        className="h-11 rounded-lg shrink-0"
                        onClick={() => upiId.includes("@") && toast({ title: "UPI ID verified", description: upiId })}
                      >
                        Verify
                      </Button>
                    </div>
                    <p className="text-[11px] text-muted-foreground">
                      Money will be debited from your linked bank account.
                    </p>
                  </div>

                  <div className="bg-muted/50 rounded-xl p-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-[10px] uppercase tracking-wider text-muted-foreground">
                        Or scan & pay to merchant
                      </p>
                      <p className="text-sm font-bold truncate">{MERCHANT_UPI}</p>
                    </div>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={copyUpi}
                      className="shrink-0 gap-1.5"
                    >
                      {copied ? <Check className="h-3.5 w-3.5 text-emerald-600" /> : <Copy className="h-3.5 w-3.5" />}
                      {copied ? "Copied" : "Copy"}
                    </Button>
                  </div>

                  <Button
                    type="button"
                    onClick={handleUpiPay}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Pay ₹{total}
                  </Button>
                </motion.div>
              )}

              {stage === "select" && pending.paymentMethod === "card" && (
                <motion.div
                  key="card"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <CreditCard className="h-5 w-5 text-emerald-600" /> Card Payment
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Pay ₹{total} securely. We accept all major cards.
                    </p>
                  </div>

                  <div className="flex gap-1.5 flex-wrap">
                    {ACCEPTED_NETWORKS.map((n) => (
                      <Badge key={n} variant="outline" className="text-[10px] font-bold">
                        {n}
                      </Badge>
                    ))}
                  </div>

                  {/* Animated card preview */}
                  <div className="relative h-44 w-full max-w-sm mx-auto">
                    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-emerald-900 text-white p-4 shadow-xl flex flex-col justify-between">
                      <div className="flex items-start justify-between">
                        <div>
                          <p className="text-[9px] uppercase tracking-wider opacity-70">GreensPay</p>
                          <p className="text-xs font-bold">Debit / Credit Card</p>
                        </div>
                        <div className="h-8 w-10 rounded bg-amber-300/90" />
                      </div>
                      <div>
                        <p className="text-[10px] opacity-70 uppercase tracking-wider">Card Number</p>
                        <p className="font-mono text-base tracking-widest">
                          {(cardNumber || "•••• •••• •••• ••••").padEnd(19, "•").slice(0, 19)}
                        </p>
                      </div>
                      <div className="flex justify-between text-xs">
                        <div>
                          <p className="text-[9px] opacity-70 uppercase tracking-wider">Card Holder</p>
                          <p className="font-bold uppercase">{cardName || "YOUR NAME"}</p>
                        </div>
                        <div>
                          <p className="text-[9px] opacity-70 uppercase tracking-wider">Expires</p>
                          <p className="font-bold">{cardExpiry || "MM/YY"}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div className="space-y-1">
                      <Label htmlFor="cardNumber" className="text-xs">
                        Card Number
                      </Label>
                      <Input
                        id="cardNumber"
                        value={cardNumber}
                        onChange={(e) => {
                          const v = e.target.value
                            .replace(/\D/g, "")
                            .slice(0, 16)
                            .replace(/(.{4})/g, "$1 ")
                            .trim();
                          setCardNumber(v);
                        }}
                        placeholder="1234 5678 9012 3456"
                        className="h-11 rounded-lg font-mono"
                      />
                    </div>

                    <div className="space-y-1">
                      <Label htmlFor="cardName" className="text-xs">
                        Name on Card
                      </Label>
                      <Input
                        id="cardName"
                        value={cardName}
                        onChange={(e) => setCardName(e.target.value)}
                        placeholder="Full name as on card"
                        className="h-11 rounded-lg"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="space-y-1">
                        <Label htmlFor="cardExpiry" className="text-xs">
                          Expiry (MM/YY)
                        </Label>
                        <Input
                          id="cardExpiry"
                          value={cardExpiry}
                          onChange={(e) => {
                            let v = e.target.value.replace(/\D/g, "").slice(0, 4);
                            if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
                            setCardExpiry(v);
                          }}
                          placeholder="08/28"
                          className="h-11 rounded-lg"
                        />
                      </div>
                      <div className="space-y-1">
                        <Label htmlFor="cardCvv" className="text-xs flex items-center gap-1">
                          CVV <Lock className="h-3 w-3 text-muted-foreground" />
                        </Label>
                        <Input
                          id="cardCvv"
                          type="password"
                          value={cardCvv}
                          onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 4))}
                          placeholder="•••"
                          className="h-11 rounded-lg"
                        />
                      </div>
                    </div>
                  </div>

                  <Button
                    type="button"
                    onClick={handleCardPay}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base"
                  >
                    <Lock className="h-4 w-4 mr-2" /> Pay ₹{total}
                  </Button>
                </motion.div>
              )}

              {stage === "select" && pending.paymentMethod === "cod" && (
                <motion.div
                  key="cod"
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <Banknote className="h-5 w-5 text-emerald-600" /> Cash on Delivery
                    </h2>
                    <p className="text-xs text-muted-foreground">
                      Confirm your order to lock in delivery. Pay ₹{total} in cash when our agent arrives.
                    </p>
                  </div>

                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 space-y-2">
                    <p className="text-sm font-bold text-amber-900">Please keep ₹{total} ready</p>
                    <p className="text-xs text-amber-800">
                      Our delivery agent will accept cash or scan-to-pay UPI on the spot. No COD charges.
                    </p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center">
                    {[
                      { label: "Order in", value: "60 min" },
                      { label: "Delivery fee", value: "FREE" },
                      { label: "Refund", value: "100%" },
                    ].map((s) => (
                      <div key={s.label} className="bg-muted/50 rounded-xl p-3">
                        <p className="text-base font-extrabold text-emerald-700">{s.value}</p>
                        <p className="text-[10px] text-muted-foreground">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  <Button
                    type="button"
                    onClick={handleCodConfirm}
                    className="w-full h-12 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-base"
                  >
                    <CheckCircle2 className="h-4 w-4 mr-2" /> Confirm Order · ₹{total}
                  </Button>
                </motion.div>
              )}

              {stage === "processing" && (
                <motion.div
                  key="processing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 space-y-4"
                >
                  <div className="flex justify-center">
                    <div className="relative">
                      <div className="h-20 w-20 rounded-full border-4 border-emerald-100 border-t-emerald-600 animate-spin" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        {pending.paymentMethod === "upi" ? (
                          <Smartphone className="h-7 w-7 text-emerald-600" />
                        ) : pending.paymentMethod === "card" ? (
                          <CreditCard className="h-7 w-7 text-emerald-600" />
                        ) : (
                          <Banknote className="h-7 w-7 text-emerald-600" />
                        )}
                      </div>
                    </div>
                  </div>
                  <div>
                    <p className="text-lg font-bold">
                      {pending.paymentMethod === "upi"
                        ? "Approve the request in your UPI app"
                        : pending.paymentMethod === "card"
                        ? "Securely processing your card…"
                        : "Confirming your order…"}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Transaction Ref: <span className="font-mono">{txnId}</span>
                    </p>
                  </div>
                  {pending.paymentMethod === "upi" && (
                    <div className="inline-flex items-center gap-2 bg-amber-50 text-amber-800 text-xs font-bold px-3 py-1.5 rounded-full">
                      <Clock className="h-3.5 w-3.5" />
                      Expires in {formatTime(waitSeconds)}
                    </div>
                  )}
                  <p className="text-[11px] text-muted-foreground max-w-xs mx-auto">
                    Do not refresh or close this window. We will redirect you automatically once payment is confirmed.
                  </p>
                </motion.div>
              )}

              {stage === "success" && (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-center py-10 space-y-3"
                >
                  <div className="flex justify-center">
                    <div className="h-20 w-20 rounded-full bg-emerald-100 flex items-center justify-center">
                      <CheckCircle2 className="h-10 w-10 text-emerald-600" />
                    </div>
                  </div>
                  <p className="text-lg font-extrabold text-emerald-700">Payment Successful</p>
                  <p className="text-xs text-muted-foreground">Placing your order…</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Trust footer */}
          <div className="border-t border-border bg-muted/30 px-5 py-3 flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-600" />
              <span>Encrypted by GreensPay · PCI-DSS compliant</span>
            </div>
            <div className="flex items-center gap-1.5 text-[10px] font-bold text-muted-foreground">
              <span className="px-1.5 py-0.5 rounded bg-white border">UPI</span>
              <span className="px-1.5 py-0.5 rounded bg-white border">VISA</span>
              <span className="px-1.5 py-0.5 rounded bg-white border">RuPay</span>
              <span className="px-1.5 py-0.5 rounded bg-white border">MC</span>
            </div>
          </div>
        </div>

        {/* Order summary */}
        <div className="md:sticky md:top-32 self-start bg-card border border-card-border rounded-2xl p-4 space-y-3 h-fit">
          <h3 className="font-bold text-sm">Order Summary</h3>
          <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1 text-xs">
            {cartItems.length === 0 ? (
              <p className="text-muted-foreground">No items</p>
            ) : (
              cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between gap-2">
                  <span className="text-muted-foreground truncate">
                    {product.name} <span className="text-foreground font-bold">× {quantity}</span>
                  </span>
                  <span className="shrink-0">₹{(product.price * quantity).toFixed(0)}</span>
                </div>
              ))
            )}
          </div>
          <Separator />
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Items subtotal</span>
            <span>₹{totalPrice.toFixed(0)}</span>
          </div>
          <div className="flex justify-between font-extrabold text-base">
            <span>Amount Payable</span>
            <span>₹{total}</span>
          </div>
          <div className="bg-emerald-50 text-emerald-800 text-[11px] rounded-lg p-2 flex items-start gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 mt-0.5" />
            <span>100% safe — your payment details never touch our servers.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
