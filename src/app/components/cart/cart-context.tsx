"use client";
import { Cart } from "@/app/libraries/mobileshop/type";
import { createContext, useMemo } from "react";

type CartContextType = {
  cartPromise: Promise<Cart | undefined>;
};

type CartProviderProps = Readonly<{
  children: React.ReactNode;
  cartPromise: Promise<Cart | undefined>;
}>;

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children, cartPromise }: CartProviderProps) {
  const contextValue = useMemo(() => ({ cartPromise }), [cartPromise]);
  return (
    <CartContext.Provider value={contextValue}>{children}</CartContext.Provider>
  );
}
