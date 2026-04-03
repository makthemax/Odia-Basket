import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart, Zap, MapPin, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGetProduct } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(Number(id), {
    query: { enabled: !!id },
  });

  const handleAddToCart = () => {
    if (!product) return;
    addItem(product, quantity);
    toast({ title: `${product.name} added to cart`, description: `${quantity} ${product.unit} added. Aapana cart update hela!` });
  };

  const handleBuyNow = () => {
    if (!product) return;
    addItem(product, quantity);
    navigate("/checkout");
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="aspect-square rounded-3xl bg-muted animate-pulse" />
        <div className="h-6 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-1/3 rounded bg-muted animate-pulse" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold">Product milila nahi!</p>
        <Link href="/products"><Button variant="outline" className="mt-4">Back to Shop</Button></Link>
      </div>
    );
  }

  return (
    <div>
      <Link href="/products" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-4">
        <ArrowLeft className="h-4 w-4" /> Back to Sabji Bazar
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Image */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="relative"
        >
          <div className="aspect-square rounded-3xl overflow-hidden bg-muted">
            {product.imageUrl && (
              <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
            )}
          </div>
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isSeasonal && <Badge className="bg-amber-500 text-white">Seasonal</Badge>}
            {product.discountPercent > 0 && <Badge className="bg-primary text-white">{product.discountPercent}% OFF</Badge>}
            {!product.inStock && <Badge variant="destructive">Astock Nahi</Badge>}
          </div>
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div>
            <p className="text-primary/80 font-medium text-sm">{product.nameOdia}</p>
            <h1 className="text-2xl font-extrabold mt-1">{product.name}</h1>
            {product.categoryName && (
              <Badge variant="outline" className="mt-2 text-xs">{product.categoryName}</Badge>
            )}
          </div>

          <div className="flex items-end gap-2">
            <span className="text-3xl font-extrabold text-primary">Rs.{product.price}</span>
            <span className="text-muted-foreground mb-1">/{product.unit}</span>
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          <Separator />

          {/* Farm Info */}
          {(product.farmName || product.origin) && (
            <div className="space-y-2">
              {product.farmName && (
                <div className="flex items-center gap-2 text-sm">
                  <Leaf className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">Farm:</span>
                  <span className="font-medium">{product.farmName}</span>
                </div>
              )}
              {product.origin && (
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-secondary" />
                  <span className="text-muted-foreground">Origin:</span>
                  <span className="font-medium">{product.origin}</span>
                </div>
              )}
            </div>
          )}

          {product.inStock ? (
            <>
              {/* Quantity */}
              <div>
                <p className="text-sm font-medium mb-2">Quantity ({product.unit})</p>
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => Math.max(1, q - 1))}
                    className="h-9 w-9"
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <span className="text-lg font-semibold w-8 text-center">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => setQuantity(q => q + 1)}
                    className="h-9 w-9"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 gap-2" onClick={handleAddToCart}>
                  <ShoppingCart className="h-4 w-4" /> Add to Cart
                </Button>
                <Button className="flex-1 gap-2" onClick={handleBuyNow}>
                  <Zap className="h-4 w-4" /> Buy Now
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Total: <span className="font-semibold text-foreground">Rs.{(product.price * quantity).toFixed(2)}</span>
              </p>
            </>
          ) : (
            <div className="p-4 bg-destructive/10 rounded-xl text-sm text-destructive font-medium text-center">
              Ehi product ahebe nahi — Astock Nahi
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
