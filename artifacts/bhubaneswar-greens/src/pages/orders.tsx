import { useState } from "react";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { Search, Package, Clock, CheckCircle, Truck, ChevronRight } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useListOrders } from "@workspace/api-client-react";

const STATUS_CONFIG: Record<string, { label: string; color: string; icon: any }> = {
  pending: { label: "Pending", color: "bg-yellow-100 text-yellow-700", icon: Clock },
  confirmed: { label: "Confirmed", color: "bg-blue-100 text-blue-700", icon: CheckCircle },
  packed: { label: "Packed", color: "bg-purple-100 text-purple-700", icon: Package },
  out_for_delivery: { label: "On the way!", color: "bg-orange-100 text-orange-700", icon: Truck },
  delivered: { label: "Delivered", color: "bg-green-100 text-green-700", icon: CheckCircle },
  cancelled: { label: "Cancelled", color: "bg-red-100 text-red-700", icon: Package },
};

export default function Orders() {
  const [phone, setPhone] = useState("");
  const [searchPhone, setSearchPhone] = useState("");

  const { data: orders = [], isLoading } = useListOrders(
    searchPhone ? { phone: searchPhone } : undefined
  );

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchPhone(phone);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Aaji r Order</h1>
        <p className="text-sm text-muted-foreground">Track your orders by entering your phone number</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="tel"
            placeholder="Enter your 10-digit phone number"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="pl-9"
          />
        </div>
        <Button type="submit">Track</Button>
      </form>

      {!searchPhone ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium">Enter your phone number to see your orders</p>
          <p className="text-sm text-muted-foreground mt-1">Use the same number you placed the order with</p>
        </div>
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-muted animate-pulse" />
          ))}
        </div>
      ) : orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="h-12 w-12 text-muted-foreground/40 mx-auto mb-3" />
          <p className="font-medium">Kona order milila nahi!</p>
          <p className="text-sm text-muted-foreground mt-1">No orders found for {searchPhone}</p>
          <Link href="/products">
            <Button variant="outline" className="mt-4">Start Shopping</Button>
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {orders.map((order: any) => {
            const config = STATUS_CONFIG[order.status] ?? STATUS_CONFIG.pending;
            const Icon = config.icon;
            return (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Link href={`/orders/${order.id}`}>
                  <div className="flex gap-4 p-4 bg-card rounded-2xl border border-card-border hover:shadow-md transition-shadow cursor-pointer">
                    <div className={`h-10 w-10 rounded-full flex items-center justify-center ${config.color} flex-shrink-0`}>
                      <Icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-bold text-sm">{order.orderNumber}</p>
                        <Badge className={`${config.color} border-0 text-xs`}>{config.label}</Badge>
                      </div>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {order.items.length} item{order.items.length !== 1 ? "s" : ""} · Rs.{Number(order.totalAmount).toFixed(2)}
                      </p>
                      <p className="text-xs text-muted-foreground">{order.locality}, Bhubaneswar</p>
                      <p className="text-xs text-muted-foreground mt-0.5">
                        {new Date(order.createdAt).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
                      </p>
                    </div>
                    <ChevronRight className="h-4 w-4 text-muted-foreground flex-shrink-0 self-center" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}
    </div>
  );
}
