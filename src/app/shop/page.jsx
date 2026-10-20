"use client";

import { useEffect, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["All", "Chair", "Bed", "Sofa", "Lamp"];

const SORT_OPTIONS = [
  { label: "Default Sorting", value: "default" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Rating: Highest Rated", value: "rating-desc" },
];

function ShopContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const dropdownRef = useRef(null);
  const { addToCart } = useCart();

  // Core Component States
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("default");
  const [visibleCount, setVisibleCount] = useState(6);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const [loadingProducts, setLoadingProducts] = useState(true);

  // Sync category and search query from URL params if provided
  useEffect(() => {
    const catParam = searchParams.get("category");
    if (catParam) {
      const matched = CATEGORIES.find(
        (c) => c.toLowerCase() === catParam.toLowerCase()
      );
      if (matched) setActiveCategory(matched);
    }

    const queryParam = searchParams.get("search");
    if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [searchParams]);

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

  // Fetch product roster from MongoDB API
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoadingProducts(true);
        const res = await fetch("/api/experince");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Error loading shop catalog data:", err);
      } finally {
        setLoadingProducts(false);
      }
    };
    fetchProducts();
  }, []);

  // 1. FILTER LOGIC (Category + Search Query)
  const filteredProducts = products.filter((product) => {
    const matchesCategory =
      activeCategory === "All" ||
      product.category?.toLowerCase() === activeCategory.toLowerCase();

    const matchesSearch =
      !searchQuery.trim() ||
      product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category?.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // 2. SORTING LOGIC
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === "price-asc") return Number(a.price) - Number(b.price);
    if (sortBy === "price-desc") return Number(b.price) - Number(a.price);
    if (sortBy === "rating-desc") return (Number(b.rating) || 0) - (Number(a.rating) || 0);
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

  const handleAddToCart = (product, e) => {
    e.stopPropagation();
    addToCart(product);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation();
    addToCart(product);
    router.push("/checkout");
  };

  const currentSortLabel =
    SORT_OPTIONS.find((o) => o.value === sortBy)?.label || "Default Sorting";

  return (
    <section className="pt-36 pb-24 bg-[#FBFBFB] min-h-screen w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Page Title & Search Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
              Curated Catalog
            </span>
            <h1 className="text-3xl md:text-5xl font-black text-[#0D1B2A] tracking-tight">
              Furniture Collection
            </h1>
            <p className="text-gray-400 text-sm mt-2">
              Discover {products.length} luxury architectural furniture artifacts designed to last.
            </p>
          </div>

          {/* Quick Search Bar */}
          <div className="w-full md:w-80 relative">
            <input
              type="text"
              placeholder="Search furniture..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-white border border-gray-200 rounded-2xl px-4 py-3 pl-10 text-sm text-[#0D1B2A] placeholder-gray-400 focus:outline-none focus:border-[#E58A44] transition-all shadow-sm"
            />
            <svg
              className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 fill-none stroke-current"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
              />
            </svg>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 text-xs font-bold"
              >
                ✕
              </button>
            )}
          </div>
        </div>

        {/* Filter and Sorting Controls */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 border-b border-gray-200/60 pb-8 mb-12">
          {/* Category Tabs */}
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

          {/* Sort Dropdown */}
          <div className="relative min-w-[220px]" ref={dropdownRef}>
            <button
              onClick={() => setIsSortOpen(!isSortOpen)}
              className="w-full bg-white text-[#0D1B2A] py-3 px-5 rounded-2xl text-sm font-semibold border border-gray-200 flex items-center justify-between shadow-sm hover:border-gray-300 transition-all duration-200 active:scale-[0.98] outline-none cursor-pointer"
            >
              <span>{currentSortLabel}</span>
              <svg
                className={`h-4 w-4 stroke-current fill-none transition-transform duration-300 ${
                  isSortOpen ? "rotate-180 text-[#E58A44]" : "text-[#0D1B2A]"
                }`}
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

        {/* Product Cards Grid */}
        <div className="w-full">
          {loadingProducts ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
              {[1, 2, 3, 4, 5, 6].map((n) => (
                <div
                  key={n}
                  className="bg-white rounded-[28px] h-[460px] p-6 flex flex-col justify-between border border-gray-100 animate-pulse"
                >
                  <div className="w-full h-1/2 bg-gray-100 rounded-2xl" />
                  <div className="space-y-3">
                    <div className="h-4 bg-gray-100 rounded-md w-1/4" />
                    <div className="h-6 bg-gray-100 rounded-md w-3/4" />
                    <div className="h-4 bg-gray-100 rounded-md w-1/2" />
                  </div>
                  <div className="h-10 bg-gray-100 rounded-xl" />
                </div>
              ))}
            </div>
          ) : displayedProducts.length === 0 ? (
            <div className="text-center py-20 bg-white border border-gray-100 rounded-3xl p-8 max-w-md mx-auto">
              <span className="text-4xl block mb-3">🔍</span>
              <h3 className="font-bold text-lg text-gray-800">No products found</h3>
              <p className="text-gray-400 text-sm mt-1 mb-6">
                No items match your active filters or search keyword.
              </p>
              <button
                onClick={() => {
                  setActiveCategory("All");
                  setSearchQuery("");
                }}
                className="bg-[#0D1B2A] text-white text-xs font-bold px-6 py-3 rounded-full hover:bg-[#E58A44] transition-colors"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 w-full">
              {displayedProducts.map((product) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3 }}
                  key={product._id}
                  onClick={() => router.push(`/shop/${product._id}`)}
                  className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-[460px] group border border-gray-100/60 cursor-pointer"
                >
                  {/* Image Stage */}
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

                  {/* Product Details */}
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
                          aria-label={`Add ${product.name} to cart`}
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
            </div>
          )}

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
  );
}

export default function ShopPage() {
  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <Suspense
        fallback={
          <div className="pt-40 min-h-screen bg-[#FBFBFB] flex items-center justify-center text-gray-400 animate-pulse font-medium">
            Loading Catalog...
          </div>
        }
      >
        <ShopContent />
      </Suspense>

      <Footer />
    </>
  );
}