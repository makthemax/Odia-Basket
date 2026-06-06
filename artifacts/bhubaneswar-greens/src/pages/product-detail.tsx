import { useState } from "react";
import { useParams, Link } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Plus, Minus, ShoppingCart, Zap, MapPin, Sprout, Clock, Bell, Leaf, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useGetProduct } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { useLocation } from "wouter";
import { ProductImage } from "@/components/vegetable-illustrations";

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const [, navigate] = useLocation();
  const [quantity, setQuantity] = useState(1);
  const [isOrganic, setIsOrganic] = useState(false);
  const { addItem } = useCart();
  const { toast } = useToast();

  const { data: product, isLoading } = useGetProduct(Number(id));

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

  const organicVariant = product.organicVariant ?? null;
  const hasOrganic = organicVariant !== null && !product.isOrganic;
  const displayPrice = isOrganic && hasOrganic ? organicVariant.price : parseFloat(String(product.price));
  const activeIsComingSoon = isOrganic && hasOrganic ? organicVariant.isComingSoon : product.isComingSoon;
  const activeId = isOrganic && hasOrganic ? organicVariant.id : product.id;
  const discount = product.discountPercent ?? 0;
  const mrp = !isOrganic && discount > 0 ? Math.round(parseFloat(String(product.price)) / (1 - discount / 100)) : null;

  const cartProduct = isOrganic && hasOrganic
    ? { ...product, id: organicVariant.id, price: organicVariant.price, name: `${product.name} (Organic)` }
    : product;

  const handleAddToCart = () => {
    addItem({ ...cartProduct, price: displayPrice } as typeof product, quantity);
    toast({
      title: `${product.name}${isOrganic ? " (Organic)" : ""} added to cart`,
      description: `${quantity} ${product.unit} added. Aapana cart update hela!`,
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

  const handleBuyNow = () => {
    addItem({ ...cartProduct, price: displayPrice } as typeof product, quantity);
    navigate("/checkout");
  };

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
          <div className={`aspect-square rounded-3xl overflow-hidden transition-all duration-300 ${isOrganic ? "ring-2 ring-emerald-400 ring-offset-2" : ""}`}>
            <ProductImage
              product={product}
              className="w-full h-full"
              imgClassName="w-full h-full object-cover"
            />
          </div>
          <div className="absolute top-3 left-3 flex flex-col gap-1">
            {product.isSeasonal && !activeIsComingSoon && <Badge className="bg-amber-500 text-white">Seasonal</Badge>}
            {!isOrganic && discount > 0 && !activeIsComingSoon && <Badge className="bg-primary text-white">{discount}% OFF</Badge>}
            {isOrganic && hasOrganic && !activeIsComingSoon && (
              <Badge className="bg-emerald-600 text-white gap-1 border-0">
                <Leaf className="h-3 w-3" /> FSSAI Organic
              </Badge>
            )}
            {!product.inStock && !activeIsComingSoon && <Badge variant="destructive">Astock Nahi</Badge>}
          </div>
          {activeIsComingSoon && (
            <div className="absolute inset-0 bg-gradient-to-b from-slate-900/50 to-slate-900/80 flex flex-col items-center justify-center gap-3 rounded-3xl">
              <Clock className="h-12 w-12 text-white" />
              <div className="text-center">
                <Badge className="bg-white text-slate-800 font-bold text-sm border-0 shadow-md px-4 py-1">
                  {isOrganic ? "Organic Variant Coming Soon" : "Coming Soon"}
                </Badge>
                <p className="text-white/80 text-xs mt-2">
                  {isOrganic ? "Try the regular version while we source organic stock." : "This product will be available shortly"}
                </p>
              </div>
            </div>
          )}
        </motion.div>

        {/* Details */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="space-y-5"
        >
          <div>
            <p className="text-primary/80 font-medium text-sm">{product.nameOdia}</p>
            <h1 className="text-2xl font-extrabold mt-1">
              {product.name}
              {isOrganic && hasOrganic && (
                <span className="ml-2 text-emerald-600 text-lg font-semibold">(Organic)</span>
              )}
            </h1>
            <div className="flex flex-wrap items-center gap-2 mt-2">
              {product.categoryName && (
                <Badge variant="outline" className="text-xs">{product.categoryName}</Badge>
              )}
              {isOrganic && hasOrganic && (
                <Badge className="bg-emerald-100 text-emerald-800 border-emerald-300 text-xs gap-1">
                  <Leaf className="h-2.5 w-2.5" /> Certified Organic · #{activeId}
                </Badge>
              )}
            </div>
          </div>

          {/* Organic toggle */}
          {hasOrganic && (
            <motion.div
              layout
              className={`flex items-center justify-between rounded-2xl px-4 py-3 border transition-colors duration-300 ${
                isOrganic
                  ? "bg-emerald-50 border-emerald-300"
                  : "bg-muted/40 border-border"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl ${isOrganic ? "bg-emerald-600" : "bg-muted"}`}>
                  <Leaf className={`h-4 w-4 ${isOrganic ? "text-white" : "text-muted-foreground"}`} />
                </div>
                <div>
                  <p className={`text-sm font-bold ${isOrganic ? "text-emerald-800" : "text-foreground"}`}>
                    {isOrganic ? "Organic Selected" : "Go Organic?"}
                  </p>
                  <p className={`text-xs ${isOrganic ? "text-emerald-600" : "text-muted-foreground"}`}>
                    {isOrganic
                      ? "Zero pesticides · FSSAI certified · 18% premium"
                      : `+₹${(organicVariant!.price - parseFloat(String(product.price))).toFixed(1)} for certified organic`}
                  </p>
                </div>
              </div>
              <Switch
                checked={isOrganic}
                onCheckedChange={setIsOrganic}
                className="data-[state=checked]:bg-emerald-600"
              />
            </motion.div>
          )}

          {/* Price */}
          <div className="flex items-end gap-3">
            <motion.span
              key={`${displayPrice}-${isOrganic}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className={`text-3xl font-extrabold ${isOrganic ? "text-emerald-700" : "text-primary"}`}
            >
              ₹{displayPrice}
            </motion.span>
            <span className="text-muted-foreground mb-1">/{product.unit}</span>
            {!isOrganic && mrp && (
              <div className="flex items-center gap-1.5 mb-1">
                <span className="text-sm text-muted-foreground line-through">₹{mrp}</span>
                <Badge className="bg-secondary text-white border-0 text-xs">SAVE ₹{mrp - displayPrice}</Badge>
              </div>
            )}
          </div>

          {product.description && (
            <p className="text-sm text-muted-foreground leading-relaxed">{product.description}</p>
          )}

          {/* Organic benefits */}
          <AnimatePresence>
            {isOrganic && hasOrganic && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-4 space-y-2">
                  <p className="text-xs font-bold text-emerald-800 uppercase tracking-wide">Why Organic?</p>
                  {[
                    "Zero synthetic pesticides or fertilizers",
                    "FSSAI Organic Certification compliant",
                    "Grown using natural composting methods",
                    "Better nutrition retention, richer flavor",
                  ].map(b => (
                    <div key={b} className="flex items-start gap-2 text-xs text-emerald-700">
                      <CheckCircle2 className="h-3.5 w-3.5 mt-0.5 shrink-0" /> {b}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <Separator />

          {/* Farm Info */}
          {(product.farmName || product.origin) && (
            <div className="space-y-2">
              {product.farmName && (
                <div className="flex items-center gap-2 text-sm">
                  <Sprout className="h-4 w-4 text-secondary" />
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

          {activeIsComingSoon ? (
            <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl text-center space-y-3">
              <div className="flex items-center justify-center gap-2 text-slate-600">
                <Clock className="h-5 w-5" />
                <span className="font-bold text-base">
                  {isOrganic ? "Organic Variant Coming Soon" : "Coming Soon"}
                </span>
              </div>
              <p className="text-sm text-muted-foreground">
                {isOrganic
                  ? "Switch to regular to order now, or check back soon for organic stock."
                  : "This product isn't available yet — check back soon or explore similar items."}
              </p>
              {isOrganic ? (
                <Button variant="outline" className="gap-2 border-emerald-300 text-emerald-700" onClick={() => setIsOrganic(false)}>
                  <Leaf className="h-4 w-4" /> Switch to Regular
                </Button>
              ) : (
                <Button variant="outline" className="gap-2 border-slate-300" disabled>
                  <Bell className="h-4 w-4" /> Notify Me
                </Button>
              )}
              <div className="pt-1">
                <Link href="/products">
                  <Button variant="ghost" className="text-xs text-primary underline-offset-2 hover:underline">
                    Browse available products →
                  </Button>
                </Link>
              </div>
            </div>
          ) : product.inStock ? (
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
                <Button
                  variant="outline"
                  className={`flex-1 gap-2 ${isOrganic ? "border-emerald-400 text-emerald-700 hover:bg-emerald-600 hover:text-white" : ""}`}
                  onClick={handleAddToCart}
                >
                  <ShoppingCart className="h-4 w-4" />
                  {isOrganic ? "Add Organic" : "Add to Cart"}
                </Button>
                <Button
                  className={`flex-1 gap-2 ${isOrganic ? "bg-emerald-600 hover:bg-emerald-700" : ""}`}
                  onClick={handleBuyNow}
                >
                  <Zap className="h-4 w-4" /> Buy Now
                </Button>
              </div>

              <p className="text-xs text-center text-muted-foreground">
                Total:{" "}
                <motion.span
                  key={`${displayPrice}-${quantity}-${isOrganic}`}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`font-semibold ${isOrganic ? "text-emerald-700" : "text-foreground"}`}
                >
                  ₹{(displayPrice * quantity).toFixed(2)}
                </motion.span>
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
