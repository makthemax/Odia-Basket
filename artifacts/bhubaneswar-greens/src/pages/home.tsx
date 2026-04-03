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
            Gharaku Fresh <br /> Tarkari!
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
        <Leaf className="absolute right-4 bottom-4 h-32 w-32 text-white/10 rotate-12" />
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
