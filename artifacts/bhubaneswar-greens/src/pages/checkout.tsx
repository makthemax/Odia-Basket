import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Loader2, MapPin, Phone, User, CreditCard, Banknote, Smartphone, ShieldCheck, Tag, ArrowLeft, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { useCreateOrder } from "@workspace/api-client-react";
import { useCart } from "@/hooks/use-cart";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

const LOCALITIES = [
  "Saheed Nagar", "Kharavela Nagar", "Janpath", "Nayapalli",
  "Mancheswar", "Unit 4", "Chandrasekharpur", "Bapuji Nagar",
  "Patia", "Jagamara", "Acharya Vihar", "Bomikhal",
  "Rasulgarh", "Laxmisagar", "Vani Vihar"
];

const FREE_DELIVERY_THRESHOLD = 199;
const COUPON_CODE = "FRESH50";
const COUPON_DISCOUNT = 50;

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
  const [couponApplied, setCouponApplied] = useState(true);

  const cartItems = Object.values(items);

  const { register, handleSubmit, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { paymentMethod: "cod" },
  });

  if (cartItems.length === 0) {
    navigate("/cart");
    return null;
  }

  const itemCount = cartItems.reduce((a, c) => a + c.quantity, 0);
  const totalSavings = cartItems.reduce((acc, { product, quantity }) => {
    const d = product.discountPercent ?? 0;
    if (d <= 0) return acc;
    const mrp = Math.round(product.price / (1 - d / 100));
    return acc + (mrp - product.price) * quantity;
  }, 0);
  const deliveryFee = totalPrice >= FREE_DELIVERY_THRESHOLD ? 0 : 25;
  const couponDiscount = couponApplied && totalPrice >= 100 ? COUPON_DISCOUNT : 0;
  const grandTotal = Math.max(0, totalPrice + deliveryFee - couponDiscount);

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
          totalAmount: grandTotal,
        },
      });

      clearCart();
      navigate(`/payment-success?orderId=${result.id}&orderNumber=${result.orderNumber}`);
    } catch (err) {
      toast({ title: "Order failed", description: "Please try again.", variant: "destructive" });
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-28 md:pb-0">
      {/* Top bar with back link & step indicator */}
      <div className="flex items-center justify-between mb-5">
        <Link href="/cart" className="text-xs md:text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
          <ArrowLeft className="h-4 w-4" /> Back to cart
        </Link>
        <div className="flex items-center gap-1.5 text-[10px] md:text-xs">
          <span className="flex items-center gap-1 text-muted-foreground"><Check className="h-3 w-3 text-secondary" /> Cart</span>
          <span className="text-muted-foreground">›</span>
          <span className="font-bold text-primary">Checkout</span>
          <span className="text-muted-foreground">›</span>
          <span className="text-muted-foreground">Confirmation</span>
        </div>
      </div>

      <h1 className="text-2xl md:text-3xl font-extrabold mb-1">Order Confirmation</h1>
      <p className="text-sm text-muted-foreground mb-6">
        Almost done! Just a few details and your fresh pariba is on its way.
      </p>

      <form onSubmit={handleSubmit(onSubmit)} className="grid md:grid-cols-[1fr_360px] gap-5">
        <div className="space-y-5">
          {/* Delivery Details */}
          <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">1</div>
              Delivery Details
            </h2>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2 md:col-span-1 space-y-1">
                <Label htmlFor="customerName" className="flex items-center gap-1 text-xs">
                  <User className="h-3 w-3" /> Your Name
                </Label>
                <Input id="customerName" {...register("customerName")} placeholder="Full name" className="h-10 rounded-lg" />
                {errors.customerName && <p className="text-xs text-destructive">{errors.customerName.message}</p>}
              </div>

              <div className="col-span-2 md:col-span-1 space-y-1">
                <Label htmlFor="phone" className="flex items-center gap-1 text-xs">
                  <Phone className="h-3 w-3" /> Phone Number
                </Label>
                <Input id="phone" {...register("phone")} placeholder="10-digit mobile number" type="tel" className="h-10 rounded-lg" />
                {errors.phone && <p className="text-xs text-destructive">{errors.phone.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="address" className="text-xs">Full Address</Label>
              <Input id="address" {...register("address")} placeholder="House no, Street, Landmark" className="h-10 rounded-lg" />
              {errors.address && <p className="text-xs text-destructive">{errors.address.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <Label htmlFor="locality" className="text-xs">Area / Locality</Label>
                <select
                  id="locality"
                  {...register("locality")}
                  className="w-full h-10 px-3 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="">Select area</option>
                  {LOCALITIES.map(loc => <option key={loc} value={loc}>{loc}</option>)}
                </select>
                {errors.locality && <p className="text-xs text-destructive">{errors.locality.message}</p>}
              </div>
              <div className="space-y-1">
                <Label htmlFor="pincode" className="text-xs">Pincode</Label>
                <Input id="pincode" {...register("pincode")} placeholder="751001" maxLength={6} className="h-10 rounded-lg" />
                {errors.pincode && <p className="text-xs text-destructive">{errors.pincode.message}</p>}
              </div>
            </div>

            <div className="space-y-1">
              <Label htmlFor="notes" className="text-xs">Delivery Notes (optional)</Label>
              <Input id="notes" {...register("notes")} placeholder='e.g., "Ring bell twice", "Leave at gate"' className="h-10 rounded-lg" />
            </div>

            <div className="flex items-center gap-2 text-[11px] text-emerald-700 bg-emerald-50 rounded-lg p-2.5">
              <MapPin className="h-3.5 w-3.5 shrink-0" />
              <span className="font-medium">Delivering today between 5 PM – 8 PM in Bhubaneswar</span>
            </div>
          </div>

          {/* Payment Method */}
          <div className="bg-card border border-card-border rounded-2xl p-5 space-y-4">
            <h2 className="font-bold flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-primary text-white flex items-center justify-center text-xs font-bold">2</div>
              Payment Method
            </h2>
            <div className="space-y-2">
              {[
                { value: "cod" as const, label: "Cash on Delivery", icon: Banknote, sub: "Pay when delivered · No charges", badge: "Most Popular" },
                { value: "upi" as const, label: "UPI", icon: Smartphone, sub: "GPay, PhonePe, Paytm, BHIM", badge: "Instant" },
                { value: "card" as const, label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay accepted", badge: null },
              ].map(({ value, label, icon: Icon, sub, badge }) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setSelectedPayment(value)}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl border-2 text-left transition-all ${
                    selectedPayment === value
                      ? "border-primary bg-primary/5"
                      : "border-border hover:border-primary/40"
                  }`}
                >
                  <div className={`h-10 w-10 rounded-lg flex items-center justify-center shrink-0 ${selectedPayment === value ? "bg-primary text-white" : "bg-muted text-muted-foreground"}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{label}</p>
                      {badge && (
                        <Badge className="bg-amber-100 text-amber-800 border-0 text-[9px] px-1.5 py-0">
                          {badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-[11px] text-muted-foreground">{sub}</p>
                  </div>
                  <div className={`h-5 w-5 rounded-full border-2 flex items-center justify-center ${selectedPayment === value ? "border-primary bg-primary" : "border-border"}`}>
                    {selectedPayment === value && <Check className="h-3 w-3 text-white" />}
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Summary */}
        <div className="md:sticky md:top-32 self-start space-y-3">
          {/* Coupon */}
          <div className={`rounded-2xl border p-3 flex items-center gap-3 ${couponApplied ? "bg-emerald-50 border-emerald-200" : "bg-card border-card-border"}`}>
            <div className={`h-9 w-9 rounded-lg flex items-center justify-center shrink-0 ${couponApplied ? "bg-emerald-600 text-white" : "bg-amber-100 text-amber-700"}`}>
              <Tag className="h-4 w-4" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold">
                {couponApplied ? `Coupon ${COUPON_CODE} applied` : "Apply coupon"}
              </p>
              <p className="text-[10px] text-muted-foreground truncate">
                {couponApplied ? `Saving ₹${COUPON_DISCOUNT} on this order` : "Use FRESH50 to save ₹50"}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setCouponApplied(!couponApplied)}
              className="text-[10px] font-bold text-primary hover:underline shrink-0"
            >
              {couponApplied ? "Remove" : "Apply"}
            </button>
          </div>

          {/* Bill */}
          <div className="bg-card border border-card-border rounded-2xl p-4 space-y-3">
            <h2 className="font-bold">Bill Details</h2>

            <div className="space-y-2 max-h-40 overflow-y-auto pr-1">
              {cartItems.map(({ product, quantity }) => (
                <div key={product.id} className="flex justify-between text-xs">
                  <span className="text-muted-foreground truncate pr-2">{product.name} <span className="text-foreground font-bold">× {quantity}</span></span>
                  <span className="shrink-0">₹{(product.price * quantity).toFixed(0)}</span>
                </div>
              ))}
            </div>

            <Separator />

            <div className="space-y-1.5 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Item total ({itemCount})</span>
                <span>₹{totalPrice.toFixed(0)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Delivery</span>
                {deliveryFee === 0 ? (
                  <span className="text-secondary font-bold">FREE</span>
                ) : (
                  <span>₹{deliveryFee}</span>
                )}
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-emerald-700">
                  <span>Coupon ({COUPON_CODE})</span>
                  <span className="font-bold">− ₹{couponDiscount}</span>
                </div>
              )}
              {totalSavings > 0 && (
                <div className="flex justify-between text-emerald-700 text-xs">
                  <span>Product savings</span>
                  <span className="font-bold">− ₹{totalSavings}</span>
                </div>
              )}
            </div>

            <Separator />

            <div className="flex justify-between font-extrabold text-base">
              <span>Grand Total</span>
              <span>₹{grandTotal.toFixed(0)}</span>
            </div>

            {(totalSavings + couponDiscount) > 0 && (
              <div className="bg-emerald-50 text-emerald-800 text-xs font-bold text-center rounded-lg py-1.5">
                You're saving ₹{totalSavings + couponDiscount} on this order 🎉
              </div>
            )}

            <Button
              type="submit"
              className="w-full gap-2 h-11 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold shadow-md hidden md:flex"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? (
                <><Loader2 className="h-4 w-4 animate-spin" /> Placing order...</>
              ) : (
                <>Place Order · ₹{grandTotal.toFixed(0)}</>
              )}
            </Button>
          </div>

          <div className="flex items-center gap-2 text-[11px] text-muted-foreground bg-muted/40 rounded-xl p-3">
            <ShieldCheck className="h-4 w-4 text-secondary shrink-0" />
            <span>100% safe & secure payments. Your data is encrypted.</span>
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
              type="submit"
              className="gap-2 h-11 px-5 rounded-xl bg-primary hover:bg-primary/90 text-white font-bold"
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Place Order"}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
