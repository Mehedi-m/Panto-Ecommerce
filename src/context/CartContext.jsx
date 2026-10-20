"use client";

import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { useSession } from "next-auth/react";

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { data: session, status } = useSession();
  const [cartItems, setCartItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const toastTimeoutRef = useRef(null);

  const triggerToast = useCallback((message, type = "success") => {
    if (toastTimeoutRef.current) {
      clearTimeout(toastTimeoutRef.current);
    }
    setToast({ show: true, message, type });
    toastTimeoutRef.current = setTimeout(() => {
      setToast({ show: false, message: "", type: "success" });
    }, 3200);
  }, []);

  // Sync to database if user is authenticated, else save to localStorage
  const persistCart = useCallback(
    async (items, customUserId = null) => {
      const activeUserId = customUserId || (status === "authenticated" && session?.user ? (session.user.id || session.user.email) : null);

      if (activeUserId) {
        try {
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId: activeUserId, items }),
          });
        } catch (err) {
          console.error("Failed syncing cloud cart to database:", err);
        }
      } else {
        try {
          localStorage.setItem("guestCart", JSON.stringify(items));
        } catch (err) {
          console.error("Failed saving guest cart to local storage:", err);
        }
      }
    },
    [status, session]
  );

  // Initialize and load cart data based on auth status
  useEffect(() => {
    if (status === "loading") return;

    const loadCart = async () => {
      setIsLoading(true);

      if (status === "authenticated" && session?.user) {
        const targetUserId = session.user.id || session.user.email;

        // Check if there was an offline guest cart to merge
        let guestItems = [];
        try {
          const localData = localStorage.getItem("guestCart");
          if (localData) {
            guestItems = JSON.parse(localData);
          }
        } catch (e) {
          localStorage.removeItem("guestCart");
        }

        try {
          const res = await fetch(`/api/cart?userId=${encodeURIComponent(targetUserId)}`);
          let cloudItems = [];
          if (res.ok) {
            const data = await res.json();
            if (Array.isArray(data)) {
              cloudItems = data;
            }
          }

          // Merge guest items into cloud items if any existed
          if (guestItems.length > 0) {
            const merged = [...cloudItems];
            guestItems.forEach((gItem) => {
              const existingIdx = merged.findIndex((cItem) => cItem._id === gItem._id);
              if (existingIdx > -1) {
                merged[existingIdx].quantity = (merged[existingIdx].quantity || 1) + (gItem.quantity || 1);
              } else {
                merged.push(gItem);
              }
            });

            setCartItems(merged);
            localStorage.removeItem("guestCart");
            await persistCart(merged, targetUserId);
          } else {
            setCartItems(cloudItems);
          }
        } catch (err) {
          console.error("Failed to fetch cloud cart:", err);
        }
      } else {
        // Guest mode
        try {
          const localData = localStorage.getItem("guestCart");
          if (localData) {
            const parsed = JSON.parse(localData);
            setCartItems(Array.isArray(parsed) ? parsed : []);
          } else {
            setCartItems([]);
          }
        } catch (e) {
          localStorage.removeItem("guestCart");
          setCartItems([]);
        }
      }

      setIsLoading(false);
    };

    loadCart();
  }, [status, session, persistCart]);

  // Add Item to Cart
  const addToCart = useCallback(
    (product, quantity = 1) => {
      if (!product || !product._id) {
        console.warn("Invalid product supplied to addToCart:", product);
        return;
      }

      setCartItems((prevItems) => {
        let updated = [...prevItems];
        const existingIdx = updated.findIndex((item) => item._id === product._id);

        if (existingIdx > -1) {
          const newQty = (updated[existingIdx].quantity || 1) + quantity;
          updated[existingIdx] = {
            ...updated[existingIdx],
            quantity: newQty,
          };
        } else {
          updated.push({
            _id: product._id,
            name: product.name || "Luxury Furniture Piece",
            category: product.category || "Furniture",
            price: Number(product.price) || 0,
            quantity: quantity,
            image: product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500",
          });
        }

        persistCart(updated);
        return updated;
      });

      triggerToast(`🛒 Added "${product.name || "Item"}" to cart!`, "success");
    },
    [persistCart, triggerToast]
  );

  // Update Item Quantity
  const updateQuantity = useCallback(
    (productId, delta) => {
      setCartItems((prevItems) => {
        const updated = prevItems.map((item) => {
          if (item._id === productId) {
            const nextQty = Math.max(1, (item.quantity || 1) + delta);
            return { ...item, quantity: nextQty };
          }
          return item;
        });

        persistCart(updated);
        return updated;
      });
    },
    [persistCart]
  );

  // Remove Item from Cart
  const removeFromCart = useCallback(
    (productId, name) => {
      setCartItems((prevItems) => {
        const updated = prevItems.filter((item) => item._id !== productId);
        persistCart(updated);
        return updated;
      });

      if (name) {
        triggerToast(`🗑️ Removed "${name}" from cart`, "success");
      }
    },
    [persistCart, triggerToast]
  );

  // Clear Entire Cart
  const clearCart = useCallback(async () => {
    setCartItems([]);
    if (status === "authenticated" && session?.user) {
      const targetUserId = session.user.id || session.user.email;
      await persistCart([], targetUserId);
    } else {
      localStorage.removeItem("guestCart");
    }
  }, [status, session, persistCart]);

  // Derived Totals
  const cartCount = cartItems.reduce((acc, item) => acc + (Number(item.quantity) || 1), 0);
  const subtotal = cartItems.reduce((acc, item) => acc + (Number(item.price) || 0) * (Number(item.quantity) || 1), 0);
  const shipping = cartItems.length > 0 ? 25.0 : 0.0;
  const total = subtotal + shipping;

  return (
    <CartContext.Provider
      value={{
        cartItems,
        cartCount,
        subtotal,
        shipping,
        total,
        isLoading,
        toast,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        triggerToast,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
