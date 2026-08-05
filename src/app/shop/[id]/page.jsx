"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import NextAuth hook
import { motion, AnimatePresence } from "framer-motion"; // For premium UI alerts

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { data: session, status } = useSession(); // Access real auth state

  // Core States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState([]);

  // Premium Toast Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // 1. Fetch product details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        const res = await fetch("/api/experince");
        const data = await res.json();
        
        if (Array.isArray(data)) {
          const foundItem = data.find((p) => p._id === id);
          setProduct(foundItem);
        }
      } catch (err) {
        console.error("Error connecting to database details route:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  // 2. Sync online cart records if authenticated, fallback to local guest cart if not
  useEffect(() => {
    if (status === "loading") return;

    if (status === "authenticated" && session?.user) {
      const targetUserId = session.user.id || session.user.email;
      
      const fetchUserCart = async () => {
        try {
          const res = await fetch(`/api/cart?userId=${targetUserId}`);
          if (res.ok) {
            const data = await res.json();
            setCartItems(data || []);
          }
        } catch (err) {
          console.error("Error staging cloud cart records:", err);
        }
      };
      fetchUserCart();
    } else if (status === "unauthenticated") {
      const localCart = localStorage.getItem("guestCart");
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error("Malformed guest cart cache cleared:", e);
        }
      }
    }
  }, [status, session]);

  // Shared utility function to build updated cart list
  const buildUpdatedCartItems = () => {
    if (!product) return cartItems;
    let updated = [...cartItems];
    const existingIndex = updated.findIndex((item) => item._id === product._id);

    if (existingIndex > -1) {
      updated[existingIndex].quantity += 1;
    } else {
      updated.push({
        _id: product._id,
        name: product.name,
        category: product.category,
        price: product.price,
        quantity: 1,
        image: product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"
      });
    }
    return updated;
  };

  // Interactive Async Cart Update Action
  const handleAddToCart = async () => {
    if (!product) return;

    const updatedCart = buildUpdatedCartItems();
    setCartItems(updatedCart);

    if (status !== "authenticated" || !session?.user) {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      triggerToast(`🛒 Added "${product.name}" to guest cart!`, "success");
      return;
    }

    triggerToast(`🛒 Added "${product.name}" to cloud cart!`, "success");
    const targetUserId = session.user.id || session.user.email;

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, items: updatedCart }),
      });
    } catch (err) {
      console.error("Failed syncing cart payload modifications:", err);
    }
  };

  // Interactive Buy Now Flow Action
  const handleBuyNow = async () => {
    if (!product || status === "loading") return;

    const updatedCart = buildUpdatedCartItems();

    // Guest Flow: Save cart data locally and redirect to login page with a target path
    if (status !== "authenticated" || !session?.user) {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      router.push("/login?redirect=/checkout");
      return;
    }

    // Authenticated Flow: Push straight into database records and skip directly to checkout
    setCartItems(updatedCart);
    const targetUserId = session.user.id || session.user.email;

    try {
      await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: targetUserId, items: updatedCart }),
      });
      router.push("/checkout");
    } catch (err) {
      console.error("Failed handling execution stream redirect setup:", err);
      router.push("/checkout"); 
    }
  };

  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-4">
        <h2 className="text-xl font-bold text-gray-800">Product Not Found</h2>
        <Link href="/shop" className="text-[#E58A44] font-semibold text-sm hover:underline">
          ← Return to Shop Catalog
        </Link>
      </div>
    );
  }

  return (
    <main className="w-full min-h-screen lg:h-screen bg-white text-[#1E1E1E] lg:overflow-hidden flex flex-col pt-24 pb-8">
      <div className="max-w-6xl w-full mx-auto px-8 md:px-12 flex-grow grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        
        {/* Left Column: Focused Product Stage Canvas */}
        <div className="w-full flex flex-col justify-center h-full relative">
          <Link 
            href="/shop" 
            className="absolute -top-10 left-0 inline-flex items-center gap-2 text-gray-400 hover:text-gray-800 text-xs font-semibold uppercase tracking-wider transition-colors"
          >
            <span>←</span> Back to Shop
          </Link>

          <div className="w-full aspect-square max-h-[480px] relative rounded-[32px] bg-[#FAFAFA] border border-gray-100 flex items-center justify-center p-12 shadow-sm">
            {loading ? (
              <div className="w-full h-full bg-gray-200/60 rounded-2xl animate-pulse" />
            ) : (
              <Image
                src={product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"}
                alt={product.name}
                fill
                priority
                className="object-contain p-4"
                sizes="(max-w-6xl) 50vw"
              />
            )}
          </div>
        </div>

        {/* Right Column: Balanced Specification Details Panel */}
        <div className="w-full flex flex-col justify-center h-full">
          {loading ? (
            <div className="space-y-6 max-w-lg w-full animate-pulse">
              <div className="h-4 bg-gray-200 rounded-md w-1/4" />
              <div className="h-12 bg-gray-200 rounded-xl w-3/4" />
              <div className="h-4 bg-gray-200 rounded-md w-1/3" />
              <div className="h-8 bg-gray-200 rounded-lg w-1/5 pt-2" />
              <div className="space-y-2 pt-2">
                <div className="h-4 bg-gray-200 rounded-md w-full" />
                <div className="h-4 bg-gray-200 rounded-md w-5/6" />
              </div>
              <div className="flex gap-4 pt-6">
                <div className="h-12 bg-gray-200 rounded-xl flex-grow" />
                <div className="h-12 bg-gray-200 rounded-xl flex-grow" />
              </div>
            </div>
          ) : (
            <div className="space-y-6 max-w-lg">
              <span className="text-[#E58A44] font-bold text-xs tracking-[0.2em] uppercase block">
                Premium {product.category} Setup
              </span>

              <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 tracking-tight leading-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-2">
                <div className="flex text-[#FFB13B]">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <svg key={i} className={`w-4 h-4 ${i < Math.floor(product.rating || 5) ? "fill-current" : "text-gray-200 fill-current"}`} viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-xs font-semibold text-gray-400 ml-1 mt-0.5">
                  ({product.rating || "5.0"} Customer Score)
                </span>
              </div>

              <div className="text-3xl font-extrabold text-[#0D1B2A] flex items-baseline tracking-tight pt-2">
                <span className="text-lg font-medium mr-0.5 text-gray-400">$</span>
                {product.price}
              </div>

              <p className="text-gray-500 leading-relaxed font-light text-sm lg:text-[15px] pt-1">
                {product.description || "No specific interior material composition data provided for this document entry profile node. Designed with premium high durability base frame supports."}
              </p>

              {/* Functionalized Action Control Elements */}
              <div className="flex items-center gap-4 pt-6">
                <button 
                  onClick={handleAddToCart}
                  className="flex-grow bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-semibold px-8 py-4 rounded-xl transition-colors duration-200 tracking-wide text-xs uppercase shadow-sm cursor-pointer"
                >
                  Add to Cart
                </button>
                <button 
                  onClick={handleBuyNow}
                  className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-4 rounded-xl transition-colors duration-200 tracking-wide text-xs uppercase cursor-pointer"
                >
                  Buy Now
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Floating Action Feedback System Container */}
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
    </main>
  );
}