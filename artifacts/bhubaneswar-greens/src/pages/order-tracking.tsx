import { useParams, Link } from "wouter";
import { motion } from "framer-motion";
import { ArrowLeft, Clock, CheckCircle, Package, Truck, Home, XCircle, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useGetOrder } from "@workspace/api-client-react";

const STEPS = [
  { status: "pending", label: "Order Placed", sub: "Your order has been received", icon: CheckCircle },
  { status: "confirmed", label: "Confirmed", sub: "Seller confirmed your order", icon: CheckCircle },
  { status: "packed", label: "Packed", sub: "Vegetables packed fresh for you", icon: Package },
  { status: "out_for_delivery", label: "Out for Delivery", sub: "Our delivery partner is on the way", icon: Truck },
  { status: "delivered", label: "Delivered", sub: "Enjoy your fresh pariba!", icon: Home },
];

const STATUS_ORDER = ["pending", "confirmed", "packed", "out_for_delivery", "delivered"];

export default function OrderTracking() {
  const { id } = useParams<{ id: string }>();
  const { data: order, isLoading } = useGetOrder(Number(id), {
    query: { enabled: !!id },
  });

  if (isLoading) {
    return (
      <div className="max-w-xl mx-auto space-y-4">
        <div className="h-8 w-48 rounded bg-muted animate-pulse" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
        <div className="h-40 rounded-2xl bg-muted animate-pulse" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="text-center py-16">
        <p className="text-lg font-semibold">Order milila nahi!</p>
        <Link href="/orders"><Button variant="outline" className="mt-4">Back to Orders</Button></Link>
      </div>
    );
  }

  const currentStatusIndex = STATUS_ORDER.indexOf(order.status);
  const isCancelled = order.status === "cancelled";

  return (
    <div className="max-w-xl mx-auto space-y-5">
      <Link href="/orders" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to Orders
      </Link>

      {/* Header */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold">Order Tracking</h1>
            <p className="text-sm text-muted-foreground mt-1">{order.orderNumber}</p>
          </div>
          {order.estimatedDelivery && !isCancelled && (
            <div className="text-right">
              <p className="text-xs text-muted-foreground">Estimated Delivery</p>
              <p className="text-sm font-semibold text-primary">{order.estimatedDelivery}</p>
            </div>
          )}
        </div>

        <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
          <MapPin className="h-3.5 w-3.5" />
          <span>{order.locality}, Bhubaneswar — {order.pincode}</span>
        </div>
      </div>

      {/* Stepper */}
      {!isCancelled ? (
        <div className="bg-card border border-card-border rounded-2xl p-5">
          <h2 className="font-semibold mb-5">Delivery Status</h2>
          <div className="relative">
            {/* Vertical line */}
            <div className="absolute left-5 top-5 bottom-5 w-0.5 bg-border" />
            <div
              className="absolute left-5 top-5 w-0.5 bg-primary transition-all duration-700"
              style={{ height: `${Math.min(currentStatusIndex / (STEPS.length - 1), 1) * 100}%` }}
            />
            <div className="space-y-6">
              {STEPS.map((step, index) => {
                const isCompleted = currentStatusIndex >= index;
                const isCurrent = currentStatusIndex === index;
                const Icon = step.icon;
                return (
                  <motion.div
                    key={step.status}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-start gap-4 relative"
                  >
                    <div className={`relative z-10 h-10 w-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                      isCompleted
                        ? "bg-primary border-primary text-primary-foreground"
                        : "bg-background border-border text-muted-foreground"
                    } ${isCurrent ? "ring-4 ring-primary/20" : ""}`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="pt-1.5">
                      <p className={`text-sm font-semibold ${isCompleted ? "text-foreground" : "text-muted-foreground"}`}>
                        {step.label}
                        {isCurrent && <span className="ml-2 text-xs text-primary font-normal">(Current)</span>}
                      </p>
                      <p className="text-xs text-muted-foreground">{step.sub}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-5 flex items-center gap-3">
          <XCircle className="h-8 w-8 text-destructive" />
          <div>
            <p className="font-semibold text-destructive">Order Cancelled</p>
            <p className="text-xs text-muted-foreground">This order has been cancelled.</p>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-card border border-card-border rounded-2xl p-5">
        <h2 className="font-semibold mb-4">Items Ordered</h2>
        <div className="space-y-3">
          {order.items.map((item: any) => (
            <div key={item.id} className="flex justify-between text-sm">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-xs text-muted-foreground">{item.quantity} {item.unit} x Rs.{item.priceAtOrder}</p>
              </div>
              <p className="font-medium">Rs.{(item.quantity * item.priceAtOrder).toFixed(2)}</p>
            </div>
          ))}
        </div>
        <Separator className="my-3" />
        <div className="flex justify-between font-bold">
          <span>Total</span>
          <span className="text-primary">Rs.{Number(order.totalAmount).toFixed(2)}</span>
        </div>
      </div>

      {/* Customer Info */}
      <div className="bg-card border border-card-border rounded-2xl p-5 space-y-2 text-sm">
        <h2 className="font-semibold mb-3">Delivery Info</h2>
        <p><span className="text-muted-foreground">Name: </span>{order.customerName}</p>
        <p><span className="text-muted-foreground">Phone: </span>{order.phone}</p>
        <p><span className="text-muted-foreground">Address: </span>{order.address}</p>
        <p><span className="text-muted-foreground">Payment: </span>{order.paymentMethod.toUpperCase()}</p>
        {order.notes && <p><span className="text-muted-foreground">Notes: </span>{order.notes}</p>}
      </div>
    </div>
  );
}
