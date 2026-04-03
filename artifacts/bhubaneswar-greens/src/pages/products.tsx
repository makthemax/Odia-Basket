import { useState, useEffect } from "react";
import { useSearch } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useListProducts, useListCategories } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

function ProductCard({ product }: { product: any }) {
  const { addItem } = useCart();
  const { toast } = useToast();

  const handleAdd = () => {
    addItem(product);
    toast({ title: `${product.name} added!`, description: "Aapana cart update hela!" });
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      className="bg-card rounded-2xl overflow-hidden border border-card-border shadow-sm hover:shadow-md transition-shadow"
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
          {product.isSeasonal && (
            <Badge className="absolute top-2 left-2 bg-amber-500 text-white text-[10px]">Seasonal</Badge>
          )}
          {!product.inStock && (
            <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
              <Badge variant="destructive" className="text-sm">Astock Nahi</Badge>
            </div>
          )}
          {product.discountPercent > 0 && product.inStock && (
            <Badge className="absolute top-2 right-2 bg-primary text-primary-foreground text-[10px]">{product.discountPercent}% OFF</Badge>
          )}
        </div>
      </Link>
      <div className="p-3">
        <p className="text-[11px] text-muted-foreground font-medium">{product.nameOdia}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-semibold text-sm mt-0.5 hover:text-primary transition-colors">{product.name}</h3>
        </Link>
        {product.farmName && (
          <p className="text-[10px] text-muted-foreground mt-0.5">{product.farmName}</p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div>
            <span className="text-base font-bold text-primary">Rs.{product.price}</span>
            <span className="text-xs text-muted-foreground ml-1">/{product.unit}</span>
          </div>
          {product.inStock ? (
            <Button size="sm" onClick={handleAdd} className="h-8 text-xs px-3">
              Add to Cart
            </Button>
          ) : (
            <Button size="sm" disabled className="h-8 text-xs px-3">Unavailable</Button>
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

  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<number | undefined>(initialCategory);

  const { data: categories = [] } = useListCategories();
  const { data: products = [], isLoading } = useListProducts(
    selectedCategory ? { categoryId: selectedCategory } : {}
  );

  const filtered = search
    ? products.filter((p: any) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.nameOdia.includes(search)
      )
    : products;

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Sabji Bazar</h1>
        <p className="text-sm text-muted-foreground">Fresh organic vegetables, delivered to your door</p>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for vegetables..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="pl-9 pr-9"
        />
        {search && (
          <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        )}
      </div>

      {/* Category Tabs */}
      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
        <button
          onClick={() => setSelectedCategory(undefined)}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${!selectedCategory ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
        >
          All
        </button>
        {categories.map((cat: any) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id === selectedCategory ? undefined : cat.id)}
            className={`flex-shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${selectedCategory === cat.id ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-muted/80"}`}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Results count */}
      {!isLoading && (
        <p className="text-xs text-muted-foreground">
          {filtered.length} products found
          {selectedCategory && categories.find((c: any) => c.id === selectedCategory) && ` in ${categories.find((c: any) => c.id === selectedCategory)?.name}`}
        </p>
      )}

      {/* Products Grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="aspect-[3/4] rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-lg font-semibold">Kichhi milila nahi!</p>
          <p className="text-sm text-muted-foreground mt-1">No products found for "{search}"</p>
          <Button variant="outline" className="mt-4" onClick={() => { setSearch(""); setSelectedCategory(undefined); }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <motion.div layout className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
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
