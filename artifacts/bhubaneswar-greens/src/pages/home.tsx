import { Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowRight, Leaf, Truck, Star, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useGetFeaturedProducts, useListCategories, useGetStoreSummary } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({ title: `${product.name} added to cart`, description: "Aapana cart update hela!" });
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-muted">
        {product.imageUrl && (
          <img
            src={product.imageUrl}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
          />
        )}
        {product.isSeasonal && (
          <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px]">Seasonal</Badge>
        )}
        {!product.inStock && (
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <Badge variant="destructive">Astock Nahi</Badge>
          </div>
        )}
        {product.discountPercent > 0 && product.inStock && (
          <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px]">{product.discountPercent}% OFF</Badge>
        )}
      </div>
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground font-medium">{product.nameOdia}</p>
        <h3 className="font-semibold text-sm mt-0.5 truncate">{product.name}</h3>
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-bold text-primary">Rs.{product.price}</span>
            <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
          </div>
          {product.inStock ? (
            <Button size="sm" onClick={handleAdd} className="h-8 text-xs px-3">
              Add
            </Button>
          ) : (
            <Button size="sm" disabled className="h-8 text-xs px-3">Out</Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

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
        className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-primary via-orange-500 to-amber-400 text-white px-6 py-10 md:py-16"
      >
        <div className="relative z-10 max-w-md">
          <Badge className="bg-white/20 text-white border-0 mb-3">Bhubaneswar's Own Sabji Store</Badge>
          <h1 className="text-3xl md:text-5xl font-extrabold leading-tight mb-3">
            Gharaku Fresh <br /> Pariba!
          </h1>
          <p className="text-white/90 text-sm md:text-base mb-6">
            Farm-fresh organic vegetables delivered straight to your home in Bhubaneswar. Directly from Odia farms, no middlemen.
          </p>
          <div className="flex gap-3">
            <Link href="/products">
              <Button variant="secondary" className="bg-white text-primary hover:bg-white/90 font-semibold">
                Shop Now <ArrowRight className="ml-1 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
        <Leaf className="absolute right-4 top-4 h-20 w-20 text-white/10 rotate-12" />
        <VeggieIllustration className="hidden sm:block absolute right-2 md:right-8 bottom-0 h-48 md:h-64 w-auto" />
      </motion.div>

      {/* Trust Badges */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { icon: Truck, title: "Gharaku Deliver", sub: "Same day delivery" },
          { icon: Leaf, title: "100% Organic", sub: "No chemicals" },
          { icon: Star, title: "Local Farmers", sub: "Direct from Odisha" },
        ].map(({ icon: Icon, title, sub }) => (
          <div key={title} className="flex flex-col items-center text-center p-3 bg-card rounded-xl border border-card-border">
            <Icon className="h-6 w-6 text-primary mb-1" />
            <p className="text-xs font-semibold">{title}</p>
            <p className="text-[10px] text-muted-foreground">{sub}</p>
          </div>
        ))}
      </div>

      {/* Delivery Areas */}
      {summary && (
        <div className="bg-secondary/10 rounded-2xl p-4 border border-secondary/20">
          <div className="flex items-center gap-2 mb-3">
            <Truck className="h-4 w-4 text-secondary" />
            <h2 className="font-semibold text-sm text-secondary">Delivery Areas in Bhubaneswar</h2>
          </div>
          <div className="flex flex-wrap gap-2">
            {summary.deliveryAreas.map((area: string) => (
              <Badge key={area} variant="outline" className="text-xs border-secondary/40 text-secondary">
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

      {/* Categories */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Shop by Category</h2>
          <Link href="/products" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        {catLoading ? (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="aspect-square rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat: any) => (
              <Link key={cat.id} href={`/products?category=${cat.id}`}>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className="flex flex-col items-center gap-2 p-3 bg-card rounded-2xl border border-card-border cursor-pointer hover:border-primary/40 transition-colors"
                >
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden">
                    {cat.imageUrl ? (
                      <img src={cat.imageUrl} alt={cat.name} className="w-full h-full object-cover rounded-full" />
                    ) : (
                      <Leaf className="h-5 w-5 text-primary" />
                    )}
                  </div>
                  <p className="text-[10px] font-semibold text-center leading-tight">{cat.name}</p>
                </motion.div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Today's Fresh Picks</h2>
          <Link href="/products" className="text-sm text-primary font-medium hover:underline">View all</Link>
        </div>
        {featuredLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {featured.slice(0, 8).map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>

      {/* Stats */}
      {summary && (
        <div className="bg-primary/5 rounded-2xl p-5 border border-primary/10">
          <h2 className="font-bold mb-4 text-center">Why Choose Bhubaneswar Greens?</h2>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-extrabold text-primary">{summary.totalProducts}+</p>
              <p className="text-xs text-muted-foreground">Varieties</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary">{summary.totalCategories}</p>
              <p className="text-xs text-muted-foreground">Categories</p>
            </div>
            <div>
              <p className="text-2xl font-extrabold text-primary">{summary.deliveryAreas.length}+</p>
              <p className="text-xs text-muted-foreground">Areas Served</p>
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

      <g opacity="0.85">
        <ellipse cx="232" cy="234" rx="10" ry="14" fill="#7c3aed" transform="rotate(-15 232 234)" />
        <ellipse cx="244" cy="240" rx="9" ry="12" fill="#7c3aed" transform="rotate(-15 244 240)" />
        <path d="M232 218c-2-4 0-8 4-8" stroke="#16a34a" strokeWidth="2" strokeLinecap="round" fill="none" />
      </g>

      <g>
        <path
          d="M50 180c-4-2-6-6-4-10 2-4 8-6 12-2 0-6 6-10 12-8 2-4 8-6 12-2 4-2 10 0 12 6 4 0 6 4 6 8-2 4-6 6-10 6-2 4-6 6-10 4-2 4-8 4-12 2-2 2-6 2-10 0-4 0-8-2-8-4z"
          fill="#fff"
          opacity="0.95"
        />
        <path
          d="M76 162c0-4 2-8 6-10M64 168c-2-2-2-6 0-8"
          stroke="#16a34a"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
      </g>
    </svg>
  );
}
