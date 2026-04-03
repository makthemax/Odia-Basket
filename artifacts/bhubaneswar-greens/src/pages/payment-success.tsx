import { useSearch, Link } from "wouter";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, Leaf } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PaymentSuccess() {
  const search = useSearch();
  const params = new URLSearchParams(search);
  const orderNumber = params.get("orderNumber") ?? "";
  const orderId = params.get("orderId") ?? "";

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
        className="text-center max-w-md mx-auto px-4 space-y-6"
      >
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="h-24 w-24 rounded-full bg-secondary/20 flex items-center justify-center">
              <CheckCircle className="h-14 w-14 text-secondary" />
            </div>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              className="absolute -top-2 -right-2"
            >
              <Leaf className="h-6 w-6 text-primary" />
            </motion.div>
          </div>
        </motion.div>

        <div>
          <h1 className="text-3xl font-extrabold text-secondary">Order Confirmed!</h1>
          <p className="text-muted-foreground mt-2">Aapana tarkari rasta re achi! Your fresh vegetables are on their way.</p>
        </div>

        {orderNumber && (
          <div className="bg-primary/5 border border-primary/20 rounded-2xl p-4">
            <p className="text-xs text-muted-foreground">Order Number</p>
            <p className="text-xl font-bold text-primary mt-1">{orderNumber}</p>
            <p className="text-xs text-muted-foreground mt-1">Save this for tracking your order</p>
          </div>
        )}

        <div className="bg-card border border-card-border rounded-2xl p-4 text-sm text-left space-y-2">
          <p className="font-semibold">What happens next?</p>
          <p className="text-muted-foreground">Our team will confirm your order shortly and pack your fresh vegetables.</p>
          <p className="text-muted-foreground">Expected delivery: Today or as per your slot.</p>
        </div>

        <div className="flex flex-col gap-3">
          {orderId && (
            <Link href={`/orders/${orderId}`}>
              <Button className="w-full gap-2">
                <Package className="h-4 w-4" /> Track Your Order
              </Button>
            </Link>
          )}
          <Link href="/products">
            <Button variant="outline" className="w-full gap-2">
              Continue Shopping <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
