"use client";

import { useEffect, useState, useRef } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react"; // Import NextAuth hook
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const CATEGORIES = ["All", "Chair", "Bed", "Sofa", "Lamp"];

const SORT_OPTIONS = [
  { label: "Default Sorting", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: Highest Rated", value: "rating-desc" },
];

export default function ShopPage() {
  const router = useRouter();
  const dropdownRef = useRef(null);
  const { data: session, status } = useSession(); // Access real auth state
  
  // Core Component States
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(6); 
  const [isSortOpen, setIsSortOpen] = useState(false); 
  const [cartItems, setCartItems] = useState([]);

  // Premium UI Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Close sorting dropdown on click outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fetch product roster from native MongoDB endpoint API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/experince");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Error loading shop catalog data:", err);
      }
    };
    fetchProducts();
  }, []);

  // Sync online cart records if authenticated, fallback to local guest cart if not
  useEffect(() => {
    if (status === "loading") return; // Wait until NextAuth resolves the session status

    if (status === "authenticated" && session?.user) {
      // Use user ID if available, fallback to email as identifier
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

  // 1. FILTER LOGIC
  const filteredProducts = products.filter((product) => {
    if (activeCategory === "All") return true;
    return product.category?.toLowerCase() === activeCategory.toLowerCase();
  });

  // 2. SORTING LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return a.price - b.price;
    if (sortBy === "price-desc") return b.price - a.price;
    if (sortBy === "rating-desc") return (b.rating || 0) - (a.rating || 0);
    return 0;
  });

  // 3. PAGINATION SLICE 
  const displayedProducts = sortedProducts.slice(0, visibleCount);

  const handleCategoryChange = (cat) => {
    setActiveCategory(cat);
    setVisibleCount(6); 
  };

  const handleLoadMore = () => {
    setVisibleCount((prevCount) => prevCount + 6); 
  };

  const buildUpdatedCartItems = (product) => {
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
        image: product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400"
      });
    }
    return updated;
  };

  const handleAddToCart = async (product, e) => {
    e.stopPropagation(); 
    const updatedCart = buildUpdatedCartItems(product);
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
      console.error("Failed syncing payload modification matrix to database instance:", err);
    }
  };

  const handleBuyNow = async (product, e) => {
    e.stopPropagation(); 

    // Prevent interactions while NextAuth is checking the active session state
    if (status === "loading") return;

    const updatedCart = buildUpdatedCartItems(product);

    // Guest Flow: If user state is explicitly unauthenticated, cash out locally and reroute to login
    if (status !== "authenticated" || !session?.user) {
      localStorage.setItem("guestCart", JSON.stringify(updatedCart));
      router.push("/login?redirect=/checkout");
      return;
    }

    // Authenticated Flow: Pushes item to remote database and forwards directly to checkout view
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
      console.error("Failed handling execution stream forwarding setup:", err);
      router.push("/checkout"); 
    }
  };

  const currentSortLabel = SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Default Sorting";

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] ">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <section className="pt-40 pb-24 bg-[#FBFBFB] min-h-screen w-full">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-200/60 pb-8 mb-12">
            <div className="bg-[#F7F7F7] p-1 rounded-full flex gap-1 items-center self-start overflow-x-auto max-w-full scrollbar-none border border-black/5 shadow-inner">
              {CATEGORIES.map((cat) => {
                const isActive = activeCategory === cat;
                return (
                  <button
                    key={cat}
                    onClick={() => handleCategoryChange(cat)}
                    className="relative px-6 py-2.5 rounded-full text-sm font-semibold transition-colors duration-300 whitespace-nowrap outline-none select-none cursor-pointer"
                    style={{ color: isActive ? "#0D1B2A" : "#333333" }}
                  >
                    {isActive && (
                      <motion.span
                        layoutId="activeCategoryIndicator"
                        className="absolute inset-0 bg-white rounded-full shadow-sm z-0"
                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                      />
                    )}
                    <span className="relative z-10">{cat}</span>
                  </button>
                );
              })}
            </div>

            <div className="relative min-w-[240px]" ref={dropdownRef}>
              <button
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="w-full bg-white text-[#0D1B2A] py-3.5 px-5 rounded-2xl text-sm font-semibold border border-gray-200 flex items-center justify-between shadow-sm hover:border-gray-300 transition-all duration-200 active:scale-[0.98] group outline-none cursor-pointer"
              >
                <span>{currentSortLabel}</span>
                <svg 
                  className={`h-4 w-4 stroke-current fill-none transition-transform duration-300 ${isSortOpen ? "rotate-180 text-[#E58A44]" : "text-[#0D1B2A]"}`} 
                  strokeWidth="2.5" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                </svg>
              </button>

              <AnimatePresence>
                {isSortOpen && (
                  <motion.ul
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15 }}
                    className="absolute right-0 left-0 mt-2 bg-white border border-gray-100 rounded-2xl shadow-xl overflow-hidden z-30 py-1.5"
                  >
                    {SORT_OPTIONS.map((opt) => (
                      <li key={opt.value}>
                        <button
                          onClick={() => {
                            setSortBy(opt.value);
                            setIsSortOpen(false);
                          }}
                          className={`w-full text-left px-5 py-3 text-sm font-medium transition-colors duration-150 cursor-pointer ${
                            sortBy === opt.value
                              ? "bg-[#E58A44]/10 text-[#E58A44] font-bold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {opt.label}
                        </button>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </AnimatePresence>
            </div>
          </div>

          <div className="w-full">
            <AnimatePresence mode="popLayout">
              {displayedProducts.length === 0 ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-20 text-gray-400 font-medium"
                >
                  No products found in this category.
                </motion.div>
              ) : (
                <motion.div 
                  layout
                  className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full"
                >
                  {displayedProducts.map((product) => (
                    <motion.div
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.3 }}
                      style={{ willChange: "transform, opacity" }}
                      key={product._id}
                      onClick={() => router.push(`/shop/${product._id}`)}
                      className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-[460px] group border border-gray-100/60 cursor-pointer"
                    >
                      
                      <div className="w-full h-[52%] bg-[#FAFAFA] relative flex items-center justify-center overflow-hidden">
                        <Image
                          src={product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400"}
                          alt={product.name}
                          fill
                          priority
                          className="object-contain p-6 group-hover:scale-105 transition-transform duration-300"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>

                      <div className="p-6 flex flex-col justify-between flex-grow bg-white">
                        <div>
                          <span className="text-gray-400 text-xs tracking-wide block">
                            {product.category}
                          </span>
                          <h3 className="text-[#0D1B2A] font-bold text-lg leading-tight mt-1 line-clamp-2 min-h-[44px]">
                            {product.name}
                          </h3>

                          <div className="flex items-center gap-0.5 mt-2">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <svg
                                key={i}
                                className={`w-4 h-4 ${
                                  i < Math.floor(product.rating || 5)
                                    ? "text-[#FFB13B] fill-current"
                                    : "text-gray-200 fill-current"
                                }`}
                                viewBox="0 0 20 20"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                            <span className="text-xs font-semibold text-gray-400 ml-1 mt-0.5">
                              ({product.rating || "5.0"})
                            </span>
                          </div>
                        </div>

                        <div className="pt-3 flex items-center justify-between border-t border-gray-100">
                          <div className="flex items-baseline font-bold text-[#0D1B2A]">
                            <span className="text-xs font-semibold mr-0.5">$</span>
                            <span className="text-xl tracking-tight">{product.price}</span>
                          </div>

                          <div className="flex items-center gap-2">
                            <button
                              onClick={(e) => handleBuyNow(product, e)}
                              className="bg-gray-50 hover:bg-[#0D1B2A] text-gray-600 hover:text-white text-[10px] font-bold px-3 py-2 rounded-xl transition-all duration-200 uppercase tracking-wider border border-gray-100 cursor-pointer"
                            >
                              Buy Now
                            </button>
                            
                            <button
                              onClick={(e) => handleAddToCart(product, e)}
                              className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md cursor-pointer"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                              </svg>
                            </button>
                          </div>
                        </div>

                      </div>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {visibleCount < sortedProducts.length && (
              <div className="flex justify-center items-center mt-16 w-full">
                <button
                  onClick={handleLoadMore}
                  className="bg-white text-[#0D1B2A] font-bold text-sm px-8 py-4 rounded-full border border-gray-200 shadow-sm hover:shadow-md hover:border-gray-300 transition-all duration-200 flex items-center gap-2 group active:scale-95 select-none cursor-pointer"
                >
                  <span>View More Items</span>
                  <svg 
                    className="w-4 h-4 text-gray-400 group-hover:text-[#E58A44] group-hover:translate-y-0.5 transition-all duration-200 fill-none stroke-current" 
                    strokeWidth="2.5" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </button>
              </div>
            )}
          </div>

        </div>
      </section>
      
      <Footer />

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