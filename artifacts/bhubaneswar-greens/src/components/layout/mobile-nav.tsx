import { Link, useLocation } from "wouter";
import { Home, Store, ShoppingCart, PackageSearch, HelpCircle } from "lucide-react";
import { useCart } from "@/hooks/use-cart";
import { useTourTrigger } from "@/components/tour-context";

export function MobileNav() {
  const [location] = useLocation();
  const { itemCount } = useCart();
  const showTour = useTourTrigger();

  const navItems = [
    { href: "/", label: "Home", icon: Home },
    { href: "/products", label: "Shop", icon: Store },
    { href: "/cart", label: "Cart", icon: ShoppingCart, count: itemCount },
    { href: "/orders", label: "Orders", icon: PackageSearch },
  ];

  return (
    <div className="fixed bottom-0 z-50 w-full border-t bg-background md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around px-2">
        {navItems.map((item) => {
          const isActive = location === item.href || (item.href !== "/" && location.startsWith(item.href));
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`flex flex-col items-center justify-center w-full h-full space-y-1 ${isActive ? 'text-primary' : 'text-muted-foreground'}`}
            >
              <div className="relative">
                <Icon className="h-5 w-5" />
                {item.count ? (
                  <span className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground text-[10px] font-bold h-4 w-4 flex items-center justify-center rounded-full">
                    {item.count}
                  </span>
                ) : null}
              </div>
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={showTour}
          className="flex flex-col items-center justify-center w-full h-full space-y-1 text-muted-foreground"
        >
          <HelpCircle className="h-5 w-5" />
          <span className="text-[10px] font-medium">Guide</span>
        </button>
      </div>
    </div>
  );
}
