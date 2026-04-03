import { useState } from "react";
import { useLocation } from "wouter";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Phone, User, CreditCard, Banknote, Smartphone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";

const LOCALITIES = [
  "Saheed Nagar", "Kharavela Nagar", "Janpath", "Nayapalli",
  "Mancheswar", "Unit 4", "Chandrasekharpur", "Bapuji Nagar",
  "Patia", "Jagamara", "Acharya Vihar", "Bomikhal",
  "Rasulgarh", "Laxmisagar", "Vani Vihar"
];

const checkoutSchema = z.object({
  customerName: z.string().min(2, "Name is required"),
  phone: z.string().min(10, "Valid phone number required"),
  address: z.string().min(10, "Full address is required"),
  locality: z.string().min(1, "Please select your area"),
  pincode: z.string().length(6, "Valid 6-digit pincode required"),
  paymentMethod: z.enum(["cod", "upi", "card"]),
  notes: z.string().optional(),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

export default function Checkout() {
  const [, navigate] = useLocation();
  const { items, totalPrice, clearCart } = useCart();
  const { toast } = useToast();
  const createOrder = useCreateOrder();
  const [selectedPayment, setSelectedPayment] = useState<"cod" | "upi" | "card">("cod");

  const cartItems = Object.values(items);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod" },
  });

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const onSubmit = async (data: CheckoutForm) => {
    const orderItems = cartItems.map(({ product, quantity }) => ({
      productId: product.id,
      quantity,
      priceAtOrder: product.price,
    }));

    try {
      const result = await createOrder.mutateAsync({
        data: {
          ...data,
          paymentMethod: selectedPayment,
          items: orderItems,
          totalAmount: totalPrice,
        },
      });

      clearCart();
      navigate(`/payment-success?orderId=${result.id}&orderNumber=${result.orderNumber}`);
    } catch (err) {
      toast({ title: "Order failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Checkout</h1>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        {/* Delivery Details */}
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> Delivery Details
          </h2>

          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2 md:col-span-1 space-y-1">
              <Label htmlFor="customerName" className="flex items-center gap-1">
                <User className="h-3 w-3" /> Your Name
              </Label>
              <Input id="customerName" {...register("customerName")} placeholder="Full name" />
              {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
            </div>

            <div className="col-span-2 md:col-span-1 space-y-1">
              <Label htmlFor="phone" className="flex items-center gap-1">
                <Phone className="h-3 w-3" /> Phone Number
              </Label>
              <Input id="phone" {...register("phone")} placeholder="10-digit mobile number" type="tel" />
              {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="address">Full Address</Label>
            <Input id="address" {...register("address")} placeholder="House no, Street, Landmark" />
            {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label htmlFor="locality">Area / Locality</Label>
              <select
                id="locality"
                {...register("locality")}
                className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              >
                <option value="">Select area</option>
                {LOCALITIES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
              </select>
              {errors.locality && <p className="text-xs text-destructive">{errors.locality.message}</p>}
            </div>
            <div className="space-y-1">
              <Label htmlFor="pincode">Pincode</Label>
              <Input id="pincode" {...register("pincode")} placeholder="751001" maxLength={6} />
              {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="notes">Delivery Notes (optional)</Label>
            <Input id="notes" {...register("notes")} placeholder="Any special instructions..." />
          </div>
        </div>

        {/* Payment Method */}
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
          <h2 className="font-semibold flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" /> Payment Method
          </h2>
          <div className="grid grid-cols-3 gap-3">
            {[
              { value: "cod" as const, label: "Cash on Delivery", icon: Banknote, sub: "Pay when delivered" },
              { value: "upi" as const, label: "UPI", icon: Smartphone, sub: "GPay, PhonePe, Paytm" },
              { value: "card" as const, label: "Card", icon: CreditCard, sub: "Debit / Credit card" },
            ].map(({ value, label, icon: Icon, sub }) => (
              <button
                key={value}
                type="button"
                onClick={() => setSelectedPayment(value)}
                className={`flex flex-col items-center gap-1.5 p-3 rounded-xl border-2 text-sm font-medium transition-all ${
                  selectedPayment === value
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border text-muted-foreground hover:border-primary/40"
                }`}
              >
                <Icon className="h-5 w-5" />
                <span className="text-xs font-semibold">{label}</span>
                <span className="text-[9px] text-center leading-tight">{sub}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Order Summary */}
        <div className="bg-card border border-card-border rounded-2xl p-5 space-y-3">
          <h2 className="font-semibold">Order Summary</h2>
          <div className="space-y-2">
            {cartItems.map(({ product, quantity }) => (
              <div key={product.id} className="flex justify-between text-sm">
                <span className="text-muted-foreground">{product.name} x{quantity}</span>
                <span>Rs.{(product.price * quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <Separator />
          <div className="flex justify-between font-bold">
            <span>Total</span>
            <span className="text-primary">Rs.{totalPrice.toFixed(2)}</span>
          </div>
          <p className="text-xs text-center text-muted-foreground">+ Free delivery anywhere in Bhubaneswar</p>
        </div>

        <Button type="submit" className="w-full gap-2" size="lg" disabled={createOrder.isPending}>
          {createOrder.isPending ? (
            <><Loader2 className="h-4 w-4 animate-spin" /> Placing order...</>
          ) : (
            `Place Order — Rs.${totalPrice.toFixed(2)}`
          )}
        </Button>
      </form>
    </div>
  );
}
