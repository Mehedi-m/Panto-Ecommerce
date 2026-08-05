"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function CartPage() {
  const router = useRouter();

  // Core Cart & Auth States
  const [cartItems, setCartItems] = useState([]);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Premium UI Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Evaluate authentication state and sync either MongoDB or Guest Local Storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    const userIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    
    setIsLoggedIn(userIsLoggedIn);
    if (storedUserId) setUserId(storedUserId);
    
    if (userIsLoggedIn && storedUserId) {
      // 1. Authenticated Loop: Pull data from remote instance
      const fetchUserCart = async () => {
        try {
          const res = await fetch(`/api/cart?userId=${storedUserId}`);
          if (res.ok) {
            const data = await res.json();
            setCartItems(data || []);
          }
        } catch (err) {
          console.error("Error staging cloud cart records:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserCart();
    } else {
      // 2. Guest Loop: Pull data from local state layer setup by Shop Page
      const localCart = localStorage.getItem("guestCart");
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error("Malformed guest cart cache cleared:", e);
          localStorage.removeItem("guestCart");
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Sync state mutations back to the database matrix or localized guest storage cache
  const syncCartMutations = async (updatedCart) => {
    setCartItems(updatedCart);

    if (isLoggedIn && userId) {
      try {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items: updatedCart }),
        });
      } catch (err) {
        console.error("Database connection failure during state synchronization:", err);
      }
    } else {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
    }
  };

  const handleUpdateQuantity = (productId, delta) => {
    const updated = cartItems.map((item) => {
      if (item._id === productId) {
        const targetQty = item.quantity + delta;
        return { ...item, quantity: Math.max(1, targetQty) }; // Keep quantity at minimum 1
      }
      return item;
    });
    syncCartMutations(updated);
  };

  const handleRemoveItem = (productId, name) => {
    const updated = cartItems.filter((item) => item._id !== productId);
    syncCartMutations(updated);
    triggerToast(`🗑️ Removed "${name}" from cart`, "success");
  };

  // Pricing Calculations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shipping = cartItems.length > 0 ? 25.0 : 0.0;
  const total = subtotal + shipping;

  // UPDATED: Smooth routing to the comprehensive checkout workspace
  const handleCheckoutSequence = () => {
    if (cartItems.length === 0) {
      triggerToast("Your cart ecosystem is currently empty", "error");
      return;
    }

    triggerToast("🚀 Securing your transaction pathway...", "success");
    
    // Luxury 800ms design lag to let the user process the toast message affirmation
    setTimeout(() => {
      router.push("/checkout");
    }, 800);
  };

  return (
    <>
      {/* SOLID HIGH-CONTRAST NAVBAR CONTAINER */}
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A]">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      {/* Main Layout Area */}
      <section className="pt-40 pb-24 bg-[#FBFBFB] min-h-screen w-full text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <h1 className="text-3xl font-extrabold tracking-tight mb-2">Your Shopping Cart</h1>
          <p className="text-gray-400 text-sm mb-12">
            {isLoggedIn ? "Synced securely to your account profile." : "Browsing as Guest. Items saved locally."}
          </p>

          {isLoading ? (
            <div className="text-center py-24 font-medium text-gray-400 animate-pulse">
              Staging order layout matrix...
            </div>
          ) : cartItems.length === 0 ? (
            /* EMPTY STATE PANELS */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-24 bg-white border border-gray-100/70 rounded-[28px] shadow-sm max-w-2xl mx-auto px-6"
            >
              <div className="text-5xl mb-6">🛒</div>
              <h2 className="text-xl font-bold mb-2">Your cart is currently empty</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto">
                Looks like you haven't added any luxury furniture artifacts to your collection yet.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-sm font-bold px-8 py-3.5 rounded-full shadow-md transition-all duration-300 outline-none select-none cursor-pointer"
              >
                Return To Catalog
              </button>
            </motion.div>
          ) : (
            /* ACTIVE CART GRID LAYOUT MAP */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* Product Listing Card Block (Left Column) */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-6">
                <AnimatePresence mode="popLayout">
                  {cartItems.map((item) => (
                    <motion.div
                      layout
                      key={item._id}
                      initial={{ opacity: 0, scale: 0.98 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, x: -30 }}
                      transition={{ duration: 0.25 }}
                      className="bg-white rounded-2xl border border-gray-100 p-4 sm:p-6 shadow-sm hover:shadow-md transition-shadow flex gap-4 sm:gap-6 items-center"
                    >
                      {/* Product Thumbnail Box Area */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAFAFA] rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-50">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          priority
                          className="object-contain p-2"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Descriptions and Meta Block */}
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base truncate pr-4 text-[#0D1B2A]">
                          {item.name}
                        </h3>
                        
                        <div className="flex items-center gap-4 mt-3">
                          {/* Premium Micro-Stepper Controls */}
                          <div className="flex items-center bg-[#F7F7F7] border border-black/5 rounded-xl p-1 shadow-inner">
                            <button
                              onClick={() => handleUpdateQuantity(item._id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#E58A44] font-bold rounded-lg transition-colors cursor-pointer text-sm"
                            >
                              —
                            </button>
                            <span className="w-8 text-center text-xs font-bold select-none text-[#0D1B2A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => handleUpdateQuantity(item._id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#E58A44] font-bold rounded-lg transition-colors cursor-pointer text-sm"
                            >
                              +
                            </button>
                          </div>

                          {/* Line item single-unit tracking indicator */}
                          <span className="text-xs text-gray-400 font-medium">
                            ${item.price} each
                          </span>
                        </div>
                      </div>

                      {/* Line Item Total Action Hub (Right side) */}
                      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                        <button
                          onClick={() => handleRemoveItem(item._id, item.name)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg cursor-pointer"
                          title="Remove item"
                        >
                          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="font-bold text-base sm:text-lg text-[#0D1B2A] tracking-tight">
                          ${(item.price * item.quantity).toFixed(2)}
                        </div>
                      </div>

                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>

              {/* Order Calculations Breakdown Panel (Right Column) */}
              <div className="lg:col-span-5 xl:col-span-4 bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm lg:sticky lg:top-36">
                <h2 className="text-lg font-bold border-b border-gray-100 pb-4 mb-6">
                  Order Summary
                </h2>

                <div className="flex flex-col gap-4 text-sm font-medium text-gray-600 mb-6 border-b border-gray-100 pb-6">
                  <div className="flex justify-between items-center">
                    <span>Subtotal</span>
                    <span className="text-[#0D1B2A] font-bold">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Flat Shipping</span>
                    <span className="text-[#0D1B2A] font-bold">${shipping.toFixed(2)}</span>
                  </div>
                </div>

                <div className="flex justify-between items-baseline mb-8">
                  <span className="font-bold text-base">Estimated Total</span>
                  <div className="text-2xl font-extrabold text-[#0D1B2A] tracking-tight">
                    <span className="text-sm font-bold mr-0.5">$</span>
                    {total.toFixed(2)}
                  </div>
                </div>

                <button
                  onClick={handleCheckoutSequence}
                  className="w-full bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-sm font-bold py-4 rounded-2xl shadow-md transition-all duration-200 active:scale-[0.99] outline-none select-none cursor-pointer uppercase tracking-wider text-center"
                >
                  Proceed To Checkout
                </button>
              </div>

            </div>
          )}
        </div>
      </section>

      <Footer />

      {/* LUXURY SLIDEOUT INLINE TOAST SYSTEM */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs uppercase font-bold tracking-wider shadow-xl backdrop-blur-md select-none ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-[#0D1B2A] border-gray-800 text-white"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}