import { Link, useLocation } from "wouter";
import { useEffect, useState } from "react";
import { useCart } from "@/hooks/use-cart";
import { useTourTrigger } from "@/components/tour-context";
import { ShoppingCart, Sprout, MapPin, Search, ChevronDown, Tag, HelpCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const PROMOS = [
  "🎉 FREE delivery on orders above ₹199",
  "💸 Use code FRESH50 for ₹50 OFF your first order",
  "⚡ Same-day delivery across Bhubaneswar",
  "🌾 Direct from Odia farms — no middlemen, no markup",
];

export function Navbar() {
  const { itemCount, totalPrice } = useCart();
  const [, navigate] = useLocation();
  const showTour = useTourTrigger();
  const [promoIdx, setPromoIdx] = useState(0);
  const [search, setSearch] = useState("");

  useEffect(() => {
    const t = setInterval(() => setPromoIdx((i) => (i + 1) % PROMOS.length), 3500);
    return () => clearInterval(t);
  }, []);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const q = search.trim();
    navigate(q ? `/products?search=${encodeURIComponent(q)}` : "/products");
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-background shadow-sm">
      {/* Top promo strip */}
      <div className="bg-gradient-to-r from-secondary via-emerald-600 to-secondary text-white text-[11px] md:text-xs">
        <div className="max-w-7xl mx-auto px-4 h-7 flex items-center justify-center overflow-hidden">
          <div key={promoIdx} className="font-medium animate-in fade-in slide-in-from-bottom-1 duration-500">
            {PROMOS[promoIdx]}
          </div>
        </div>
      </div>

      {/* Main bar */}
      <div className="border-b border-border/60 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
        <div className="max-w-7xl mx-auto px-3 md:px-6 h-16 flex items-center gap-3 md:gap-6">
          <Link href="/" className="flex items-center gap-2 font-extrabold text-lg md:text-xl tracking-tight text-primary shrink-0">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center">
              <Sprout className="h-5 w-5" />
            </div>
            <span className="hidden sm:block leading-none">
              Bhubaneswar
              <span className="block text-[10px] font-bold text-secondary tracking-widest">GREENS</span>
            </span>
          </Link>

          {/* Location chip */}
          <button
            type="button"
            className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border border-border hover:border-primary/50 bg-card transition-colors text-left"
          >
            <MapPin className="h-4 w-4 text-primary shrink-0" />
            <div className="leading-tight">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold">Deliver to</div>
              <div className="text-xs font-semibold flex items-center gap-1">
                Bhubaneswar 751024 <ChevronDown className="h-3 w-3" />
              </div>
            </div>
          </button>

          {/* Search */}
          <form onSubmit={onSubmit} className="flex-1 max-w-2xl">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder='Search "palanga saag", "alu", "tomato"…'
                className="w-full h-10 md:h-11 pl-10 pr-4 rounded-xl bg-muted/60 border border-transparent focus:border-primary/50 focus:bg-background focus:outline-none text-sm placeholder:text-muted-foreground/70 transition-colors"
              />
            </div>
          </form>

          <nav className="hidden lg:flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={showTour}
              className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted flex items-center gap-1.5"
            >
              <HelpCircle className="h-4 w-4" />
              How it works
            </button>
            <Link href="/orders" className="text-sm font-semibold hover:text-primary transition-colors px-3 py-2 rounded-lg hover:bg-muted">
              Aaji r Order
            </Link>
          </nav>

          <Link href="/cart" className="shrink-0">
            <Button
              variant="default"
              className="relative h-10 md:h-11 rounded-xl gap-2 px-3 md:px-4 bg-secondary hover:bg-secondary/90 text-white shadow-sm"
            >
              <ShoppingCart className="h-4 w-4" />
              <span className="hidden sm:inline text-xs md:text-sm font-bold">
                {itemCount > 0 ? `${itemCount} item${itemCount > 1 ? "s" : ""}` : "Cart"}
              </span>
              {itemCount > 0 && (
                <span className="hidden md:inline text-xs font-bold border-l border-white/30 pl-2 ml-1">
                  ₹{totalPrice}
                </span>
              )}
              {itemCount > 0 && (
                <Badge className="absolute -top-1.5 -right-1.5 h-5 min-w-5 px-1 flex items-center justify-center p-0 text-[10px] bg-primary text-white border-2 border-background sm:hidden">
                  {itemCount}
                </Badge>
              )}
            </Button>
          </Link>
        </div>

        {/* Quick offer chips row */}
        <div className="max-w-7xl mx-auto px-3 md:px-6 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          <Badge variant="outline" className="shrink-0 text-[10px] gap-1 border-amber-300 bg-amber-50 text-amber-800">
            <Tag className="h-3 w-3" /> FRESH50 — ₹50 OFF
          </Badge>
          <Badge variant="outline" className="shrink-0 text-[10px] gap-1 border-emerald-300 bg-emerald-50 text-emerald-800">
            ⚡ 60-min delivery
          </Badge>
          <Badge variant="outline" className="shrink-0 text-[10px] gap-1 border-orange-300 bg-orange-50 text-orange-800">
            🌾 100% Organic
          </Badge>
          <Badge variant="outline" className="shrink-0 text-[10px] gap-1 border-pink-300 bg-pink-50 text-pink-800">
            🎁 Buy 2 Get 1 on Saag
          </Badge>
        </div>
      </div>
    </header>
  );
}
