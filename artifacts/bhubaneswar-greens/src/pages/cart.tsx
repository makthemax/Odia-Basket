import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, ShoppingBag, ArrowRight, Tag, Zap, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

const FREE_DELIVERY_THRESHOLD = 199;

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, itemCount } = useCart();
  const [, navigate] = useLocation();
  const cartItems = Object.values(items);

  if (cartItems.length === 0) {
    return (
      <div className="max-w-md mx-auto flex flex-col items-center justify-center py-16 gap-5 text-center">
        <div className="text-7xl">🛒</div>
        <div>
          <h2 className="text-2xl font-extrabold">Aapana cart khali achi!</h2>
          <p className="text-sm text-muted-foreground mt-1">Add some fresh vegetables to get started.</p>
        </div>
        <Link href="/products">
          <Button className="gap-2 h-11 px-6 rounded-xl bg-secondary hover:bg-secondary/90 text-white font-bold">
            <ShoppingBag className="h-4 w-4" /> Go to Sabji Bazar
          </Button>
        </Link>
      </div>
    );
  }

  const totalSavings = cartItems.reduce((acc, { product, quantity }) => {
    const d = product.discountPercent ?? 0;
    if (d <= 0) return acc;
    const mrp = Math.round(product.price / (1 - d / 100));
    return acc + (mrp - product.price) * quantity;
  }, 0);

  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : 25;
  const grandTotal = totalPrice + deliveryFee;
  const remainingForFreeDelivery = Math.max(0, FREE_DELIVERY_THRESHOLD - totalPrice);

  return (
    <div className="max-w-5xl mx-auto pb-28 md:pb-0">
      <div className="flex items-center justify-between mb-5">
        <div>
          <h1 className="text-2xl font-extrabold">Aapana Cart</h1>
          <p className="text-sm text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""} · You're saving ₹{totalSavings}</p>
        </div>
        <Badge className="bg-emerald-100 text-emerald-800 border-0 gap-1 hidden sm:flex">
          <Zap className="h-3 w-3" /> Delivery in 60 min
        </Badge>
      </div>

      {/* Free delivery progress */}
      {remainingForFreeDelivery > 0 ? (
        <div className="bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-3 mb-5 flex items-center gap-3">
          <Truck className="h-5 w-5 text-amber-700 shrink-0" />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-amber-900">
              Add <span className="font-extrabold">₹{remainingForFreeDelivery}</span> more for FREE delivery!
            </p>
            <div className="h-1.5 bg-amber-200/70 rounded-full mt-1.5 overflow-hidden">
              <div
                className="h-full bg-amber-500 transition-all"
                style={{ width: `${Math.min(100, (totalPrice / FREE_DELIVERY_THRESHOLD) * 100)}%` }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-3 mb-5 flex items-center gap-3">
          <Truck className="h-5 w-5 text-emerald-700" />
          <p className="text-xs font-bold text-emerald-900">Yay! You've unlocked FREE delivery 🎉</p>
        </div>
      )}

      <div className="grid md:grid-cols-[1fr_360px] gap-5">
        {/* Cart items */}
        <div className="space-y-3">
          <AnimatePresence>
            {cartItems.map(({ product, quantity }) => {
              const d = product.discountPercent ?? 0;
              const mrp = d > 0 ? Math.round(product.price / (1 - d / 100)) : null;
              return (
                <motion.div
                  key={product.id}
                  layout
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="flex gap-3 p-3 bg-card rounded-2xl border border-card-border shadow-sm"
                >
                  <div className="h-24 w-24 rounded-xl overflow-hidden bg-muted shrink-0 relative">
                    {product.imageUrl && (
                      <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                    )}
                    {d > 0 && (
                      <div className="absolute top-0 left-0 bg-secondary text-white text-[9px] font-bold px-1.5 py-0.5 rounded-br-md">
                        {d}% OFF
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0 flex flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="text-[10px] text-muted-foreground">{product.nameOdia}</p>
                        <h3 className="font-bold text-sm truncate">{product.name}</h3>
                        <p className="text-[11px] text-muted-foreground">{product.unit}{product.farmName ? ` · ${product.farmName}` : ""}</p>
                      </div>
                      <button
                        onClick={() => removeItem(product.id)}
                        className="text-muted-foreground hover:text-destructive transition-colors p-1 shrink-0"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex items-end justify-between gap-2">
                      <div>
                        <div className="flex items-baseline gap-1.5">
                          <span className="text-base font-extrabold">₹{(product.price * quantity).toFixed(0)}</span>
                          {mrp && (
                            <span className="text-xs text-muted-foreground line-through">₹{(mrp * quantity).toFixed(0)}</span>
                          )}
                        </div>
                        <p className="text-[10px] text-muted-foreground">₹{product.price} × {quantity}</p>
                      </div>
                      <div className="flex items-center bg-secondary text-white rounded-lg overflow-hidden">
                        <button
                          onClick={() => updateQuantity(product.id, quantity - 1)}
                          className="h-8 w-8 hover:bg-white/15 font-bold text-base transition-colors"
                        >
                          −
                        </button>
                        <span className="text-sm font-bold w-7 text-center">{quantity}</span>
                        <button
                          onClick={() => updateQuantity(product.id, quantity + 1)}
                          className="h-8 w-8 hover:bg-white/15 font-bold text-base transition-colors"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>

          <Link href="/products">
            <Button variant="outline" className="w-full text-sm rounded-xl h-10">
              + Add more items
            </Button>
          </Link>
        </div>

        {/* Sticky Order Summary */}
        <div className="md:sticky md:top-32 self-start space-y-3">
          {/* Coupon */}
          <div className="bg-card rounded-2xl border border-card-border p-3 flex items-center gap-3">
            <div className="h-9 w-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
              <Tag className="h-4 w-4" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-bold">Apply Coupon</p>
              <p className="text-[10px] text-muted-foreground">Code <span className="font-bold text-secondary">FRESH50</span> auto-applied at checkout</p>
            </div>
          </div>

          <div className="bg-card rounded-2xl border border-card-border p-4 space-y-3">
            <h2 className="font-bold flex items-center justify-between">
              <span>Bill Details</span>
              <Badge className="bg-emerald-100 text-emerald-800 border-0 text-[10px]">
                Saved ₹{totalSavings}
              </Badge>
            </h2>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item total ({itemCount})</span>
                <span className="font-medium">₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery charge</span>
                {deliveryFee === 0 ? (
                  <span className="text-secondary font-bold">FREE</span>
                ) : (
                  <span className="font-medium">₹{deliveryFee}</span>
                )}
              </div>
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Total savings</span>
                  <span className="font-bold">− ₹{totalSavings}</span>
                </div>
              )}
            </div>
            <Separator />
            <div className="flex justify-between font-extrabold text-base">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>
            <Button
              className="w-full gap-2 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md hidden md:flex"
              onClick={() => navigate("/checkout")}
            >
              Proceed to Checkout <ArrowRight className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 rounded-xl p-3">
            <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
            <span>Secure checkout · Pay on delivery available · 100% organic guarantee</span>
          </div>
        </div>
      </div>

      {/* Sticky bottom CTA on mobile */}
      <div className="md:hidden fixed bottom-16 left-0 right-0 bg-background border-t border-border p-3 z-40 shadow-[0_-4px_12px_rgba(0,0,0,0.06)]">
        <div className="max-w-md mx-auto flex items-center gap-3">
          <div className="flex-1">
            <p className="text-[10px] text-muted-foreground">Total · {itemCount} item{itemCount !== 1 ? "s" : ""}</p>
            <p className="text-lg font-extrabold leading-tight">₹{grandTotal.toFixed(0)}</p>
          </div>
          <Button
            className="gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
            onClick={() => navigate("/checkout")}
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
