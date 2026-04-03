import { Link } from "wouter";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, Menu, Leaf, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function Navbar() {
  const { itemCount } = useCart();

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl tracking-tight text-primary">
          <Leaf className="h-6 w-6" />
          <span>Bhubaneswar Greens</span>
        </Link>
        <div className="flex flex-1 items-center justify-end space-x-4">
          <nav className="flex items-center space-x-2 hidden md:flex">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors px-4 py-2">
              Sabji Bazar
            </Link>
            <Link href="/orders" className="text-sm font-medium hover:text-primary transition-colors px-4 py-2">
              Aaji r Order
            </Link>
          </nav>
          <div className="flex items-center gap-2">
            <Link href="/cart">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                <span className="sr-only">Aapana Cart</span>
                {itemCount > 0 && (
                  <Badge 
                    className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-[10px]"
                    variant="destructive"
                  >
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
