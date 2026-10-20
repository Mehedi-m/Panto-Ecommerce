"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useCart } from "@/context/CartContext";

export default function CartPage() {
  const router = useRouter();
  const { status } = useSession();
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    isLoading,
    subtotal,
    shipping,
    total,
    triggerToast,
  } = useCart();

  const handleCheckoutSequence = () => {
    if (cartItems.length === 0) {
      triggerToast("Your cart is currently empty", "error");
      return;
    }

    triggerToast("🚀 Preparing secure checkout...", "success");
    setTimeout(() => {
      router.push("/checkout");
    }, 400);
  };

  return (
    <>
      {/* SOLID HIGH-CONTRAST NAVBAR CONTAINER */}
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      {/* Main Layout Area */}
      <section className="pt-36 pb-24 bg-[#FBFBFB] min-h-screen w-full text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <div className="mb-10">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Your Selection
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Shopping Cart</h1>
            <p className="text-gray-400 text-sm mt-1">
              {status === "authenticated"
                ? "✨ Synced securely to your Panto account."
                : "Browsing as guest. Your selections are preserved locally."}
            </p>
          </div>

          {isLoading ? (
            <div className="text-center py-24 font-medium text-gray-400 animate-pulse">
              Loading your cart items...
            </div>
          ) : cartItems.length === 0 ? (
            /* EMPTY STATE PANELS */
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center py-20 bg-white border border-gray-100/70 rounded-[28px] shadow-sm max-w-xl mx-auto px-6"
            >
              <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center text-3xl mx-auto mb-6">
                🛒
              </div>
              <h2 className="text-2xl font-bold mb-2">Your cart is currently empty</h2>
              <p className="text-gray-400 text-sm mb-8 max-w-sm mx-auto leading-relaxed">
                Looks like you haven&apos;t added any luxury furniture artifacts to your collection yet.
              </p>
              <button
                onClick={() => router.push("/shop")}
                className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-sm font-bold px-8 py-4 rounded-full shadow-md transition-all duration-300 outline-none select-none cursor-pointer"
              >
                Explore Showroom Catalog
              </button>
            </motion.div>
          ) : (
            /* ACTIVE CART GRID LAYOUT */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              {/* Product Listing Card Block (Left Column) */}
              <div className="lg:col-span-7 xl:col-span-8 flex flex-col gap-4">
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
                      {/* Product Thumbnail */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 bg-[#FAFAFA] rounded-xl flex-shrink-0 relative overflow-hidden border border-gray-50">
                        <Image
                          src={item.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400"}
                          alt={item.name}
                          fill
                          priority
                          className="object-contain p-2"
                          sizes="96px"
                        />
                      </div>

                      {/* Product Descriptions and Controls */}
                      <div className="flex-grow min-w-0">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-gray-400 block mb-0.5">
                          {item.category}
                        </span>
                        <h3 className="font-bold text-sm sm:text-base truncate pr-4 text-[#0D1B2A]">
                          {item.name}
                        </h3>

                        <div className="flex items-center gap-4 mt-3">
                          {/* Micro-Stepper Controls */}
                          <div className="flex items-center bg-[#F7F7F7] border border-black/5 rounded-xl p-1 shadow-inner">
                            <button
                              onClick={() => updateQuantity(item._id, -1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#E58A44] font-bold rounded-lg transition-colors cursor-pointer text-sm"
                              aria-label="Decrease quantity"
                            >
                              —
                            </button>
                            <span className="w-8 text-center text-xs font-bold select-none text-[#0D1B2A]">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() => updateQuantity(item._id, 1)}
                              className="w-7 h-7 flex items-center justify-center text-gray-500 hover:text-[#E58A44] font-bold rounded-lg transition-colors cursor-pointer text-sm"
                              aria-label="Increase quantity"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs text-gray-400 font-medium">
                            ${Number(item.price).toFixed(2)} each
                          </span>
                        </div>
                      </div>

                      {/* Line Item Total Action Hub (Right side) */}
                      <div className="flex flex-col items-end justify-between self-stretch flex-shrink-0">
                        <button
                          onClick={() => removeFromCart(item._id, item.name)}
                          className="text-gray-300 hover:text-red-500 transition-colors p-1 rounded-lg cursor-pointer"
                          title="Remove item"
                          aria-label="Remove item"
                        >
                          <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>

                        <div className="font-bold text-base sm:text-lg text-[#0D1B2A] tracking-tight">
                          ${(Number(item.price) * (item.quantity || 1)).toFixed(2)}
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
                    <span>Standard Shipping</span>
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

                <div className="mt-4 text-center">
                  <button
                    onClick={() => router.push("/shop")}
                    className="text-xs text-gray-400 hover:text-[#0D1B2A] transition-colors font-semibold"
                  >
                    ← Continue Browsing Catalog
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <Footer />
    </>
  );
}