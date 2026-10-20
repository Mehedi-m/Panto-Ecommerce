"use client";
import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/context/CartContext";

export function AuthProvider({ children }) {
  return (
    <SessionProvider>
      <CartProvider>
        {children}
      </CartProvider>
    </SessionProvider>
  );
}