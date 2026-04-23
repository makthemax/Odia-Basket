import { useState } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, X, Star, Zap, Flame, SlidersHorizontal, Sprout } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

function ProductCard({ product }: { product: any }) {
  const { addItem, items, updateQuantity } = useCart();
  const { toast } = useToast();
  const inCart = items[product.id]?.quantity ?? 0;

  const handleAdd = () => {
    addItem(product);
    toast({ title: `${product.name} added!`, description: "Aapana cart update hela!" });
  };

  const discount = product.discountPercent ?? 0;
  const mrp = discount > 0 ? Math.round(product.price / (1 - discount / 100)) : null;
  const rating = (4.0 + ((product.id * 7) % 10) / 10).toFixed(1);
  const ratingCount = 80 + ((product.id * 31) % 900);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow flex flex-col"
    >
      <Link href={`/products/${product.id}`}>
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          {product.imageUrl && (
            <img
              src={product.imageUrl}
              alt={product.name}
              className="w-full h-full object-cover transition-transform hover:scale-105 duration-300"
            />
          )}
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
              <Badge variant="destructive" className="text-sm">Astock Nahi</Badge>
            </div>
          )}
        </div>
      </Link>
      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1">
          <span className="inline-flex items-center gap-0.5 bg-emerald-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded">
            {rating} <Star className="h-2.5 w-2.5 fill-white" />
          </span>
          <span className="text-[10px] text-muted-foreground">({ratingCount})</span>
        </div>
        <p className="text-[11px] text-muted-foreground font-medium truncate">{product.nameOdia}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm leading-tight line-clamp-1 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.farmName && (
          <p className="text-[10px] text-muted-foreground mt-0.5 truncate">📍 {product.farmName}</p>
        )}
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
          {!product.inStock ? (
            <Button size="sm" disabled variant="outline" className="w-full h-9 text-xs">Out of stock</Button>
          ) : inCart > 0 ? (
            <div className="flex items-center justify-between gap-1 bg-secondary text-white rounded-lg h-9 px-1">
              <button
                onClick={() => updateQuantity(product.id, inCart - 1)}
                className="h-7 w-8 rounded-md hover:bg-white/15 font-bold text-base transition-colors"
              >
                −
              </button>
              <span className="text-sm font-bold">{inCart}</span>
              <button
                onClick={() => updateQuantity(product.id, inCart + 1)}
                className="h-7 w-8 rounded-md hover:bg-white/15 font-bold text-base transition-colors"
              >
                +
              </button>
            </div>
          ) : (
            <Button
              size="sm"
              onClick={handleAdd}
              variant="outline"
              className="w-full h-9 text-xs font-bold border-secondary/40 text-secondary hover:bg-secondary hover:text-white"
            >
              ADD
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const searchStr = useSearch();
  const params = new URLSearchParams(searchStr);
  const initialCategory = params.get("category") ? Number(params.get("category")) : undefined;
  const initialSearch = params.get("search") ?? "";

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);
  const [sortBy, setSortBy] = useState<"relevance" | "price-low" | "price-high" | "discount">("relevance");

  const { data: categories = [] } = useListCategories();
  const { data: products = [], isLoading } = useListProducts(
    selectedCategory ? { categoryId: selectedCategory } : {}
  );

  const filtered = (search
    ? products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameOdia.includes(search)
      )
    : products
  ).slice().sort((a: any, b: any) => {
    if (sortBy === "price-low") return a.price - b.price;
    if (sortBy === "price-high") return b.price - a.price;
    if (sortBy === "discount") return (b.discountPercent ?? 0) - (a.discountPercent ?? 0);
    return 0;
  });

  return (
    <div className="space-y-5">
      {/* Hero strip */}
      <div className="rounded-2xl bg-gradient-to-r from-primary/10 via-amber-50 to-emerald-50 border border-primary/15 p-4 md:p-5 flex items-center justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-xl md:text-2xl font-extrabold flex items-center gap-2">
            <Sprout className="h-6 w-6 text-secondary" /> Sabji Bazar
          </h1>
          <p className="text-xs md:text-sm text-muted-foreground mt-0.5">Fresh from Odisha's farms · Delivered in 60 mins</p>
        </div>
        <Badge className="hidden sm:flex bg-secondary text-white border-0 gap-1 shrink-0">
          <Zap className="h-3 w-3" /> Express delivery on
        </Badge>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder='Search "palanga saag", "alu", "tomato"…'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9 h-11 rounded-xl"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 md:mx-0 md:px-0">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${!selectedCategory ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-foreground border-border hover:border-primary/40"}`}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)}
            className={`shrink-0 px-4 py-2 rounded-full text-xs md:text-sm font-bold transition-all border ${selectedCategory === cat.id ? "bg-primary text-primary-foreground border-primary shadow-sm" : "bg-card text-foreground border-border hover:border-primary/40"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Result count + Sort */}
      {!isLoading && (
        <div className="flex items-center justify-between gap-3 -mt-1">
          <p className="text-xs text-muted-foreground">
            <span className="font-bold text-foreground">{filtered.length}</span> products found
            {selectedCategory && categories.find((c: any) => c.id === selectedCategory) && ` in ${categories.find((c: any) => c.id === selectedCategory)?.name}`}
          </p>
          <div className="flex items-center gap-2 text-xs">
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent font-semibold text-foreground focus:outline-none cursor-pointer"
            >
              <option value="relevance">Sort: Relevance</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="discount">Biggest Discount</option>
            </select>
          </div>
        </div>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 bg-muted/30 rounded-2xl">
          <p className="text-4xl mb-2">🌱</p>
          <p className="text-lg font-bold">Kichhi milila nahi!</p>
          <p className="text-sm text-muted-foreground mt-1">No products found{search ? ` for "${search}"` : ""}</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory(undefined); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-4">
          <AnimatePresence>
            {filtered.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
