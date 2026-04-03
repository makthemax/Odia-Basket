import { Link, useLocation } from "wouter";
import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Plus, Minus, ShoppingBag, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCart } from "@/hooks/use-cart";

export default function Cart() {
  const { items, updateQuantity, removeItem, totalPrice, itemCount } = useCart();
  const [, navigate] = useLocation();
  const cartItems = Object.values(items);

  if (cartItems.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4">
        <ShoppingBag className="h-16 w-16 text-muted-foreground/50" />
        <div className="text-center">
          <h2 className="text-xl font-bold">Aapana cart khali achi!</h2>
          <p className="text-sm text-muted-foreground mt-1">Add some fresh vegetables to get started.</p>
        </div>
        <Link href="/products">
          <Button className="gap-2">
            <ShoppingBag className="h-4 w-4" /> Go to Sabji Bazar
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-5">
      <div>
        <h1 className="text-2xl font-bold">Aapana Cart</h1>
        <p className="text-sm text-muted-foreground">{itemCount} item{itemCount !== 1 ? "s" : ""} in your cart</p>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {cartItems.map(({ product, quantity }) => (
            <motion.div
              key={product.id}
              layout
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="flex gap-3 p-3 bg-card rounded-2xl border border-card-border"
            >
              <div className="h-20 w-20 rounded-xl overflow-hidden bg-muted flex-shrink-0">
                {product.imageUrl && (
                  <img src={product.imageUrl} alt={product.name} className="w-full h-full object-cover" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] text-muted-foreground">{product.nameOdia}</p>
                <h3 className="font-semibold text-sm truncate">{product.name}</h3>
                <p className="text-xs text-muted-foreground">{product.unit}</p>
                <p className="text-primary font-bold mt-1">Rs.{(product.price * quantity).toFixed(2)}</p>
              </div>
              <div className="flex flex-col items-end justify-between">
                <button
                  onClick={() => removeItem(product.id)}
                  className="text-destructive/60 hover:text-destructive transition-colors p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    className="h-7 w-7 rounded-full bg-muted flex items-center justify-center hover:bg-muted/70 transition-colors"
                  >
                    <Minus className="h-3 w-3" />
                  </button>
                  <span className="text-sm font-semibold w-5 text-center">{quantity}</span>
                  <button
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center hover:bg-primary/90 transition-colors"
                  >
                    <Plus className="h-3 w-3" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <Separator />

      {/* Order Summary */}
      <div className="bg-card rounded-2xl border border-card-border p-4 space-y-3">
        <h2 className="font-semibold">Order Summary</h2>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Subtotal ({itemCount} items)</span>
            <span>Rs.{totalPrice.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Delivery charge</span>
            <span className="text-secondary font-medium">Free</span>
          </div>
        </div>
        <Separator />
        <div className="flex justify-between font-bold text-base">
          <span>Total Amount</span>
          <span className="text-primary">Rs.{totalPrice.toFixed(2)}</span>
        </div>
        <Button className="w-full gap-2" size="lg" onClick={() => navigate("/checkout")}>
          Proceed to Checkout <ArrowRight className="h-4 w-4" />
        </Button>
        <Link href="/products">
          <Button variant="outline" className="w-full text-sm">Continue Shopping</Button>
        </Link>
      </div>
    </div>
  );
}
