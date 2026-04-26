import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Sprout, Truck, Star, Clock, Zap, ShieldCheck, BadgePercent, Flame } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetFeaturedProducts, useListCategories, useGetStoreSummary } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useLocation } from "wouter";
import { ProductImage } from "@/components/vegetable-illustrations";

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const { toast } = useToast();
  const [, navigate] = useLocation();

  const handleAdd = () => {
    addItem(product);
    toast({
      title: `${product.name} added to cart`,
      description: "Aapana cart update hela!",
      action: (
        <ToastAction
          altText="View cart"
          onClick={() => navigate("/cart")}
          className="border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-700 hover:text-white"
        >
          View Cart →
        </ToastAction>
      ),
    });
  };

  const discount = product.discountPercent ?? 0;
  const mrp = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : null;
  // Pseudo-rating derived from id (stable per product) — replace with real ratings later
  const rating = (4.0 + ((product.id * 7) % 10) / 10).toFixed(1);
  const ratingCount = 80 + ((product.id * 31) % 900);

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        <ProductImage
          product={product}
          className="w-full h-full"
          imgClassName="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
        />

        {discount > 0 && product.inStock && (
          <div className="absolute top-0 left-0 bg-secondary text-white text-[10px] font-bold px-2 py-1 rounded-br-lg shadow">
            {discount}% OFF
          </div>
        )}
        {product.isSeasonal && (
          <Badge className="absolute top-2 right-2 bg-amber-500 text-white text-[10px] gap-1 border-0 shadow">
            <Flame className="h-3 w-3" /> Seasonal
          </Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="destructive">Astock Nahi</Badge>
          </div>
        )}
      </div>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {rating} <Star className="h-2.5 w-2.5 fill-white" />
          </span>
          <span className="text-[10px] text-muted-foreground">({ratingCount})</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium truncate">{product.nameOdia}</p>
        <h3 className="font-semibold text-sm leading-tight line-clamp-1">{product.name}</h3>
        <p className="text-[10px] text-muted-foreground mt-0.5">{product.unit}</p>

        <div className="mt-2 flex items-center gap-1.5">
          <span className="text-base font-extrabold text-foreground">₹{product.price}</span>
          {mrp && (
            <>
              <span className="text-xs text-muted-foreground line-through">₹{mrp}</span>
              <span className="text-[10px] font-bold text-secondary">SAVE ₹{mrp - product.price}</span>
            </>
          )}
        </div>

        <div className="mt-1 flex items-center gap-1 text-[10px] text-emerald-700">
          <Zap className="h-3 w-3" /> Delivery in 60 min
        </div>

        <div className="mt-2.5">
          {product.inStock ? (
            <Button
              size="sm"
              onClick={handleAdd}
              variant="outline"
              className="w-full h-8 text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary hover:text-white"
            >
              ADD
            </Button>
          ) : (
            <Button size="sm" disabled variant="outline" className="w-full h-8 text-xs">Out of stock</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

const DEAL_TILES = [
  {
    title: "Mega Pariba Sale",
    sub: "Up to 30% OFF on saags",
    cta: "Shop Saag",
    href: "/products?category=1",
    bg: "from-rose-500 to-pink-600",
    emoji: "🥬",
  },
  {
    title: "Combo Bachat",
    sub: "Buy 2 Get 1 — Mix & Match",
    cta: "Grab Combos",
    href: "/products",
    bg: "from-violet-600 to-indigo-700",
    emoji: "🛒",
  },
  {
    title: "Aaji ka Special",
    sub: "Cuttack Greens — fresh today",
    cta: "Order Now",
    href: "/products",
    bg: "from-emerald-600 to-teal-700",
    emoji: "🌿",
  },
];

export default function Home() {
  const { data: featured = [], isLoading: featuredLoading } = useGetFeaturedProducts();
  const { data: categories = [], isLoading: catLoading } = useListCategories();
  const { data: summary } = useGetStoreSummary();

  return (
    <div className="space-y-8">
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-amber-400 text-white px-6 py-10 md:py-16 ring-1 ring-orange-300/60 border-2 border-white/40 shadow-[0_10px_40px_-12px_rgba(234,88,12,0.55)]"
      >
        <div className="absolute inset-0 rounded-3xl ring-1 ring-inset ring-white/15 pointer-events-none" />
        <div className="relative z-10 max-w-md">
          <div className="flex flex-wrap gap-2 mb-3">
            <Badge className="bg-white text-primary border-0 font-bold gap-1 shadow">
              <Zap className="h-3 w-3" /> 60-min delivery
            </Badge>
            <Badge className="bg-white/20 text-white border border-white/30 font-semibold">
              Bhubaneswar's Own Sabji Store
            </Badge>
          </div>
          <h1 className="text-4xl md:text-6xl font-light leading-[1.05] mb-4 tracking-tight" style={{ fontFamily: '"Playfair Display", "Georgia", serif' }}>
            <span className="block italic font-extralight text-white/95">Gharaku Fresh</span>
            <span className="block font-semibold tracking-tighter">Pariba<span className="text-amber-100">.</span></span>
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-5">
            Farm-fresh organic vegetables delivered straight to your home in Bhubaneswar. Directly from Odia farms, no middlemen.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <Link href="/products">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 font-bold h-11 px-5 rounded-xl shadow-md">
                Shop Now <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
            <div className="flex items-center gap-1.5 text-white/95 text-xs font-semibold bg-white/15 backdrop-blur px-3 py-2 rounded-xl border border-white/20">
              <BadgePercent className="h-4 w-4" /> Use code <span className="font-extrabold">FRESH50</span> · ₹50 OFF
            </div>
          </div>
        </div>
        <Sprout className="absolute right-4 top-4 h-20 w-20 text-white/10 rotate-12" />
        <VeggieIllustration className="hidden sm:block absolute right-2 md:right-8 bottom-0 h-48 md:h-64 w-auto" />
      </motion.div>

      {/* Deal Tiles - desi promo banner row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {DEAL_TILES.map((d) => (
          <Link key={d.title} href={d.href}>
            <motion.div
              whileHover={{ y: -2 }}
              className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${d.bg} text-white p-4 cursor-pointer shadow-sm hover:shadow-md transition-shadow h-28`}
            >
              <div className="relative z-10">
                <p className="text-[11px] font-bold uppercase tracking-wider opacity-90">{d.sub}</p>
                <h3 className="text-lg font-extrabold leading-tight mt-0.5">{d.title}</h3>
                <p className="text-xs font-bold mt-2 inline-flex items-center gap-1 underline-offset-2 underline">
                  {d.cta} <ArrowRight className="h-3 w-3" />
                </p>
              </div>
              <span className="absolute -right-2 -bottom-3 text-7xl opacity-30 leading-none select-none">{d.emoji}</span>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Trust strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { icon: Zap, title: "60-min Delivery", sub: "Across Bhubaneswar" },
          { icon: Sprout, title: "100% Organic", sub: "FSSAI Certified" },
          { icon: Truck, title: "FREE above ₹199", sub: "Orders ₹199+" },
          { icon: ShieldCheck, title: "Easy Returns", sub: "Quality guarantee" },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex items-center gap-3 p-3 bg-card rounded-xl border border-card-border">
            <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold leading-tight">{title}</p>
              <p className="text-[10px] text-muted-foreground leading-tight mt-0.5">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Categories - BigBasket-style colorful tiles */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold">Shop by Category</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Fresh from Odisha's farms</p>
          </div>
          <Link href="/products" className="text-xs md:text-sm text-primary font-bold hover:underline">View all →</Link>
        </div>
        {catLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat: any, i: number) => {
              const tones = [
                "from-emerald-100 to-emerald-50 border-emerald-200",
                "from-amber-100 to-amber-50 border-amber-200",
                "from-rose-100 to-rose-50 border-rose-200",
                "from-violet-100 to-violet-50 border-violet-200",
                "from-sky-100 to-sky-50 border-sky-200",
                "from-orange-100 to-orange-50 border-orange-200",
              ];
              const tone = tones[i % tones.length];
              return (
                <Link key={cat.id} href={`/products?category=${cat.id}`}>
                  <motion.div
                    whileHover={{ scale: 1.04 }}
                    className={`relative flex flex-col items-center justify-end gap-1 p-3 pt-12 bg-gradient-to-b ${tone} border rounded-2xl cursor-pointer transition-shadow hover:shadow-md aspect-square overflow-hidden`}
                  >
                    <div className="absolute top-2 left-1/2 -translate-x-1/2 h-14 w-14 rounded-full bg-white shadow-md ring-2 ring-white overflow-hidden flex items-center justify-center">
                      {cat.imageUrl ? (
                        <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover" />
                      ) : (
                        <Sprout className="h-6 w-6 text-primary" />
                      )}
                    </div>
                    <p className="text-[11px] font-bold text-center leading-tight text-foreground">{cat.name}</p>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        )}
      </div>

      {/* Deal of the Day banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-secondary/10 via-emerald-50 to-amber-50 border border-secondary/20 p-5 md:p-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 min-w-0">
          <div className="h-12 w-12 rounded-full bg-secondary text-white flex items-center justify-center shrink-0 shadow-md">
            <Flame className="h-6 w-6" />
          </div>
          <div className="min-w-0">
            <p className="text-[10px] font-bold text-secondary uppercase tracking-widest">Aaji ka Deal · Today Only</p>
            <h3 className="text-base md:text-lg font-extrabold leading-tight">Fresh Picks at Farm Prices</h3>
            <p className="text-xs text-muted-foreground truncate">Hand-picked from Khordha, Cuttack & Puri farms today morning</p>
          </div>
        </div>
        <Link href="/products" className="shrink-0">
          <Button className="bg-secondary hover:bg-secondary/90 text-white h-10 rounded-xl font-bold">
            Shop Deals
          </Button>
        </Link>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-end justify-between mb-4">
          <div>
            <h2 className="text-lg md:text-xl font-extrabold">Today's Fresh Picks</h2>
            <p className="text-xs text-muted-foreground mt-0.5">Harvested this morning · Free delivery in 60 mins</p>
          </div>
          <Link href="/products" className="text-xs md:text-sm text-primary font-bold hover:underline">View all →</Link>
        </div>
        {featuredLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {featured.slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Delivery Areas */}
      {summary && (
        <div className="bg-secondary/5 rounded-2xl p-4 md:p-5 border border-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-4 w-4 text-secondary" />
            <h2 className="font-bold text-sm text-secondary">Delivery Areas in Bhubaneswar</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.deliveryAreas.map((area: string) => (
              <Badge key={area} variant="outline" className="text-xs border-secondary/40 text-secondary bg-white">
                {area}
              </Badge>
            ))}
          </div>
          <div className="mt-3 flex items-center gap-2">
            <Clock className="h-3.5 w-3.5 text-muted-foreground" />
            <p className="text-xs text-muted-foreground">
              Today's slots: {summary.todayDeliverySlots.join(" | ")}
            </p>
          </div>
        </div>
      )}

      {/* Stats */}
      {summary && (
        <div className="bg-gradient-to-br from-primary/5 via-amber-50 to-orange-50 rounded-2xl p-5 md:p-6 border border-primary/10">
          <h2 className="font-extrabold mb-4 text-center text-base md:text-lg">Why Bhubaneswar Greens?</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">{summary.totalProducts}+</p>
              <p className="text-[11px] text-muted-foreground font-semibold">Fresh Varieties</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">{summary.totalCategories}</p>
              <p className="text-[11px] text-muted-foreground font-semibold">Categories</p>
            </div>
            <div>
              <p className="text-2xl md:text-3xl font-extrabold text-primary">{summary.deliveryAreas.length}+</p>
              <p className="text-[11px] text-muted-foreground font-semibold">Areas Served</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function VeggieIllustration({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 320 280"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <ellipse cx="160" cy="248" rx="140" ry="14" fill="#000" opacity="0.12" />

      <g>
        <path
          d="M70 200c-22-6-36-26-32-50 4-22 24-36 46-32 6-20 28-30 48-22 14-12 36-12 50 2 18-4 36 8 40 26 16 4 26 22 22 38-4 18-22 30-40 28-2 18-20 30-38 26-10 14-30 18-44 8-14 8-34 4-44-8-2 0-4 0-8-2"
          fill="#65a30d"
        />
        <path
          d="M82 168c14-2 24 6 32 16M120 150c10 4 18 14 20 26M170 142c-2 14 6 26 18 32M210 158c-4 12 2 26 14 32"
          stroke="#3f6212"
          strokeWidth="2"
          strokeLinecap="round"
          opacity="0.5"
        />
      </g>

      <g>
        <path
          d="M126 196c-2-22 12-42 32-44 22-2 42 14 44 36 2 22-14 42-36 44-22 2-38-14-40-36z"
          fill="#dc2626"
        />
        <path
          d="M126 196c-1-12 4-24 12-32 2 14 8 26 18 34-12 4-22 4-30-2z"
          fill="#ef4444"
        />
        <path
          d="M158 156c0-6-2-10-6-14 6-2 12-2 16 2 4-2 8-2 12 0-2 6-6 10-12 12"
          fill="#16a34a"
        />
        <ellipse cx="148" cy="178" rx="6" ry="4" fill="#fca5a5" opacity="0.7" />
      </g>

      <g>
        <path
          d="M218 220c-14-4-22-18-18-32 2-8 8-14 16-16-2-12 6-22 18-22 4-10 14-16 24-12 8-12 24-12 32 0 12-2 22 8 22 20 8 4 12 14 8 22 4 10-2 22-12 26-2 10-12 16-22 14-6 8-18 10-26 4-8 8-22 6-30-2-4 2-8 2-12-2z"
          fill="#f97316"
        />
        <path
          d="M260 162c0-8-4-14-10-18 8-4 16-2 22 4 6-4 14-2 18 4-2 8-10 14-18 14"
          fill="#16a34a"
        />
      </g>

      <g>
        <ellipse cx="80" cy="222" rx="34" ry="22" fill="#7c2d12" />
        <ellipse cx="80" cy="218" rx="34" ry="22" fill="#a16207" />
        <path
          d="M62 210c4-4 10-6 16-4M86 206c6 0 12 2 16 6M70 224c4 2 10 2 14 0"
          stroke="#78350f"
          strokeWidth="1.5"
          strokeLinecap="round"
          opacity="0.6"
        />
        <path
          d="M76 196c-2-6 0-12 4-16 4 4 6 10 4 16"
          fill="#16a34a"
          stroke="#166534"
          strokeWidth="1"
        />
      </g>

      <g>
        <path
          d="M40 240c10-2 18-12 18-22 0-12-10-22-22-22-8 0-14 4-18 10 0 0-2 18 6 28s16 6 16 6z"
          fill="#fb923c"
        />
        <path
          d="M40 196c-2-6-2-12 2-16 6-2 12 2 14 8"
          stroke="#16a34a"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
        />
      </g>

      <g>
        <path
          d="M270 232c12-4 18-18 14-30-4-12-18-18-30-12-4 2-8 6-10 10 0 0-4 14 6 24s20 8 20 8z"
          fill="#facc15"
        />
        <path d="M278 198c2-6 0-12-4-16" stroke="#16a34a" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>

      <g>
        <circle cx="118" cy="232" r="14" fill="#dc2626" />
        <circle cx="114" cy="228" r="4" fill="#fca5a5" opacity="0.8" />
        <path d="M118 218c0-4 2-6 6-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />

        <circle cx="148" cy="240" r="10" fill="#dc2626" />
        <circle cx="146" cy="238" r="3" fill="#fca5a5" opacity="0.8" />

        <circle cx="200" cy="244" r="12" fill="#dc2626" />
        <circle cx="197" cy="241" r="3.5" fill="#fca5a5" opacity="0.8" />
      </g>

      <g>
        <path
          d="M232 246c-14-2-22-16-20-30 2-12 10-22 20-26 4-2 8-2 12 0 6-4 14-2 18 4 6 6 8 16 6 24-2 14-12 26-26 28-4 0-8 0-10 0z"
          fill="#4c1d95"
        />
        <path
          d="M232 218c-4-6 2-14 10-12-4 4-6 8-4 12 4-2 8-2 10 2-6 0-10 4-12 8-2-4-2-8-4-10z"
          fill="#16a34a"
          stroke="#166534"
          strokeWidth="1"
        />
        <ellipse
          cx="240"
          cy="232"
          rx="3"
          ry="8"
          fill="#7c3aed"
          opacity="0.5"
          transform="rotate(-20 240 232)"
        />
      </g>
    </svg>
  );
}
