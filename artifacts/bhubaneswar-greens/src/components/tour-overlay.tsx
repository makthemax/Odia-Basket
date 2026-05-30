import { useEffect, useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  X,
  Sprout,
  Search,
  ShoppingBag,
  Truck,
  CreditCard,
  PartyPopper,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const STORAGE_KEY = "bg.tourSeen";

type Slide = {
  icon: ReactNode;
  title: string;
  subtitle: string;
  body: string;
  bullets: string[];
  bg: string;
  art: ReactNode;
};

const SLIDES: Slide[] = [
  {
    icon: <Sprout className="h-5 w-5" />,
    title: "Swagatam!",
    subtitle: "Welcome to Bhubaneswar Greens",
    body: "Aapanaku Odisha r sabu thi taja organic pariba — directly from Cuttack, Khordha & Puri farms, delivered to your gate within 60 minutes.",
    bullets: ["100% organic", "60-min delivery", "Direct from Odia farms"],
    bg: "from-orange-400 via-orange-500 to-amber-400",
    art: (
      <div className="text-7xl select-none drop-shadow-lg">🥬🍅🥕</div>
    ),
  },
  {
    icon: <Search className="h-5 w-5" />,
    title: "Browse the Sabji Bazar",
    subtitle: "Find what you love",
    body: "Tap any category — Leafy Saags, Roots, Gourds, Tomatoes & Peppers — or search in Odia / English. Use chips like 'Seasonal' or 'Express' to narrow down.",
    bullets: ["6 categories", "Search 'palanga saag', 'alu', 'tomato'", "Filter by season"],
    bg: "from-emerald-500 via-emerald-600 to-teal-600",
    art: <div className="text-7xl select-none drop-shadow-lg">🔎🥦🌶️</div>,
  },
  {
    icon: <ShoppingBag className="h-5 w-5" />,
    title: "Add to Cart",
    subtitle: "Tap ADD, then +/− for quantity",
    body: "Hit the green ADD button on any product. A small +/− stepper appears so you can tune the quantity. Watch the cart pill at the top fill up with ₹ total.",
    bullets: ["Inline quantity stepper", "Live ₹ total in navbar", "Buy Now for express checkout"],
    bg: "from-rose-500 via-pink-600 to-fuchsia-600",
    art: <div className="text-7xl select-none drop-shadow-lg">🛒➕🥔</div>,
  },
  {
    icon: <Truck className="h-5 w-5" />,
    title: "Free Delivery on ₹199+",
    subtitle: "Aapana Cart",
    body: "On the Cart page you'll see a green progress bar showing how close you are to free delivery. Apply 'FRESH50' for ₹50 off and review your savings.",
    bullets: ["Free delivery threshold ₹199", "Use coupon FRESH50", "See live savings badge"],
    bg: "from-emerald-500 via-green-600 to-emerald-700",
    art: <div className="text-7xl select-none drop-shadow-lg">🚚💚🎟️</div>,
  },
  {
    icon: <CreditCard className="h-5 w-5" />,
    title: "Pay Your Way",
    subtitle: "GreensPay Secure Gateway",
    body: "Choose UPI (GPay, PhonePe, Paytm, BHIM), Credit/Debit Card, or Cash on Delivery. Every transaction is 256-bit SSL encrypted and PCI-DSS compliant.",
    bullets: ["UPI · Card · COD", "256-bit SSL encryption", "Track order in 'Aaji r Order'"],
    bg: "from-indigo-500 via-blue-600 to-cyan-600",
    art: <div className="text-7xl select-none drop-shadow-lg">📱💳💵</div>,
  },
  {
    icon: <PartyPopper className="h-5 w-5" />,
    title: "Aapana Pariba Aasiba!",
    subtitle: "You're all set",
    body: "Need help anytime? Tap the green WhatsApp button at the bottom-right to chat with our team. Now go grab some fresh saag!",
    bullets: ["WhatsApp support", "Order tracking live", "Reorder in one tap"],
    bg: "from-amber-400 via-orange-500 to-rose-500",
    art: <div className="text-7xl select-none drop-shadow-lg">🎉🌿✨</div>,
  },
];

export function TourOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (!open) setIndex(0);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setIndex((i) => Math.min(SLIDES.length - 1, i + 1));
      if (e.key === "ArrowLeft") setIndex((i) => Math.max(0, i - 1));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  function finish() {
    localStorage.setItem(STORAGE_KEY, "1");
    onClose();
  }

  if (!open) return null;

  const slide = SLIDES[index];
  const isLast = index === SLIDES.length - 1;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        onClick={(e) => {
          if (e.target === e.currentTarget) finish();
        }}
      >
        <motion.div
          initial={{ scale: 0.94, opacity: 0, y: 12 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.94, opacity: 0 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative w-full max-w-lg bg-white rounded-3xl overflow-hidden shadow-2xl"
        >
          {/* Close */}
          <button
            type="button"
            onClick={finish}
            aria-label="Close tour"
            className="absolute top-3 right-3 z-20 h-9 w-9 rounded-full bg-white/30 hover:bg-white/50 backdrop-blur text-white flex items-center justify-center transition"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Hero / art */}
          <div
            className={`relative bg-gradient-to-br ${slide.bg} text-white px-6 pt-10 pb-8 overflow-hidden`}
          >
            <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_40%,white,transparent_50%)]" />

            {/* Step pill */}
            <div className="relative flex items-center justify-between mb-4">
              <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur text-white text-[11px] font-bold px-3 py-1.5 rounded-full">
                <span className="h-5 w-5 rounded-full bg-white/30 flex items-center justify-center">
                  {slide.icon}
                </span>
                Step {index + 1} of {SLIDES.length}
              </div>
              <button
                type="button"
                onClick={finish}
                className="text-[11px] font-bold text-white/80 hover:text-white"
              >
                Skip tour
              </button>
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -24 }}
                transition={{ duration: 0.32 }}
                className="relative"
              >
                <p className="text-xs uppercase tracking-[0.2em] opacity-80 font-semibold mb-1">
                  {slide.subtitle}
                </p>
                <h2
                  className="text-3xl md:text-4xl font-bold leading-tight"
                  style={{ fontFamily: '"Playfair Display", Georgia, serif' }}
                >
                  {slide.title}
                </h2>
              </motion.div>
            </AnimatePresence>

            <div className="absolute right-4 bottom-2">{slide.art}</div>
          </div>

          {/* Body */}
          <div className="px-6 pt-5 pb-2 min-h-[170px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={`body-${index}`}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.28 }}
              >
                <p className="text-sm text-foreground/80 leading-relaxed">
                  {slide.body}
                </p>
                <ul className="mt-3 space-y-1.5">
                  {slide.bullets.map((b) => (
                    <li
                      key={b}
                      className="flex items-start gap-2 text-xs text-foreground/70"
                    >
                      <span className="h-4 w-4 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mt-0.5 shrink-0">
                        <Check className="h-3 w-3" />
                      </span>
                      <span className="font-medium">{b}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Footer / nav */}
          <div className="px-6 py-4 flex items-center justify-between gap-3 border-t border-border bg-muted/20">
            <div className="flex items-center gap-1.5">
              {SLIDES.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setIndex(i)}
                  aria-label={`Go to step ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all ${
                    i === index
                      ? "w-6 bg-primary"
                      : i < index
                      ? "w-1.5 bg-primary/40"
                      : "w-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                  }`}
                />
              ))}
            </div>

            <div className="flex items-center gap-2">
              {index > 0 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIndex((i) => Math.max(0, i - 1))}
                  className="h-9 rounded-lg"
                >
                  <ArrowLeft className="h-4 w-4 mr-1" />
                  Back
                </Button>
              )}
              {!isLast ? (
                <Button
                  type="button"
                  size="sm"
                  onClick={() => setIndex((i) => Math.min(SLIDES.length - 1, i + 1))}
                  className="h-9 rounded-lg bg-primary hover:bg-primary/90 text-white font-bold px-4"
                >
                  Next
                  <ArrowRight className="h-4 w-4 ml-1" />
                </Button>
              ) : (
                <Button
                  type="button"
                  size="sm"
                  onClick={finish}
                  className="h-9 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-4"
                >
                  Start Shopping
                  <Sprout className="h-4 w-4 ml-1" />
                </Button>
              )}
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export function useTour() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return undefined;
    const seen = localStorage.getItem(STORAGE_KEY);
    if (!seen) {
      const t = setTimeout(() => setOpen(true), 700);
      return () => clearTimeout(t);
    }
    return undefined;
  }, []);

  return {
    open,
    show: () => setOpen(true),
    close: () => setOpen(false),
  };
}
