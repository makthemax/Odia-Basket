import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import type { Product } from "@workspace/api-client-react";

export interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: Record<number, CartItem>;
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  itemCount: number;
  totalPrice: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Record<number, CartItem>>({});

  const addItem = (product: Product, quantity: number = 1) => {
    setItems((prev) => {
      const existing = prev[product.id];
      if (existing) {
        return {
          ...prev,
          [product.id]: {
            ...existing,
            quantity: existing.quantity + quantity,
          },
        };
      }
      return {
        ...prev,
        [product.id]: {
          product,
          quantity,
        },
      };
    });
  };

  const removeItem = (productId: number) => {
    setItems((prev) => {
      const { [productId]: removed, ...rest } = prev;
      return rest;
    });
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) => {
      if (!prev[productId]) return prev;
      return {
        ...prev,
        [productId]: {
          ...prev[productId],
          quantity,
        },
      };
    });
  };

  const clearCart = () => setItems({});

  const itemCount = Object.values(items).reduce((acc, item) => acc + item.quantity, 0);
  const totalPrice = Object.values(items).reduce(
    (acc, item) => acc + item.product.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        itemCount,
        totalPrice,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
