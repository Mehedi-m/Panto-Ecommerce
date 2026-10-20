"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation"; // Imported for programmatic routing
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

const CATEGORIES = ["Chair", "Bed", "Sofa", "Lamp"];

export default function BestSellers() {
  const router = useRouter(); // Initialize the router
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Chair");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/experince");
        const data = await res.json();
        if (Array.isArray(data)) setProducts(data);
      } catch (err) {
        console.error("Error connecting to products endpoint:", err);
      }
    };
    fetchProducts();
  }, []);

  const filteredProducts = products
    .filter((p) => p.category?.toLowerCase() === activeCategory.toLowerCase())
    .slice(0, 4);

  const handlePrevCategory = () => {
    const currentIndex = CATEGORIES.indexOf(activeCategory);
    const prevIndex = currentIndex === 0 ? CATEGORIES.length - 1 : currentIndex - 1;
    setActiveCategory(CATEGORIES[prevIndex]);
  };

  const handleNextCategory = () => {
    const currentIndex = CATEGORIES.indexOf(activeCategory);
    const nextIndex = currentIndex === CATEGORIES.length - 1 ? 0 : currentIndex + 1;
    setActiveCategory(CATEGORIES[nextIndex]);
  };

  const handleAddToCart = (product, e) => {
    e.stopPropagation(); // Prevents navigating to details page
    addToCart(product);
  };

  const handleBuyNow = (product, e) => {
    e.stopPropagation(); // Prevents navigating to details page
    addToCart(product);
    router.push("/checkout");
  };

  return (
    <section className="py-24 bg-[#FBFBFB] w-full overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        
        {/* Section Title */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-[#1E1E1E] tracking-tight mb-8">
          Best Selling Product
        </h2>

        {/* Category Pills Control Bar */}
        <div className="flex justify-center mb-16">
          <div className="bg-[#EEEEEE]/60 p-1.5 rounded-full flex gap-1 items-center">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all duration-300 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-white text-[#1E1E1E] shadow-sm"
                    : "text-gray-400 hover:text-gray-900"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Slider Frame */}
        <div className="relative flex items-center w-full">
          
          {/* Slider Prev Arrow */}
          <button
            onClick={handlePrevCategory}
            className="absolute left-0 z-20 bg-white text-gray-800 hover:bg-[#E58A44] hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform -translate-x-4 lg:-translate-x-6 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Cards Display Grid */}
          <div className="w-full min-h-[500px] px-2">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeCategory}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.35, ease: "easeInOut" }}
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full"
              >
                {filteredProducts.map((product) => (
                  <div
                    key={product._id}
                    onClick={() => router.push(`/shop/${product._id}`)} // Routes to details page dynamically
                    className="bg-white rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-300 flex flex-col h-[480px] group border border-gray-100/60 cursor-pointer"
                  >
                    
                    {/* UPPER HALF: Image Container */}
                    <div className="w-full h-[52%] bg-[#FAFAFA] relative flex items-center justify-center overflow-hidden">
                      <Image
                        src={product.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=400"}
                        alt={product.name}
                        fill
                        priority
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-w: 640px) 100vw, (max-w: 1024px) 50vw, 25vw"
                      />
                    </div>

                    {/* LOWER HALF: Description context metadata */}
                    <div className="p-6 flex flex-col justify-between flex-grow bg-white">
                      <div>
                        <span className="text-gray-400 text-xs tracking-wide block">
                          {product.category}
                        </span>
                        <h3 className="text-[#0D1B2A] font-bold text-[17px] leading-tight mt-1 line-clamp-2 min-h-[44px]">
                          {product.name}
                        </h3>

                        {/* Star Rating Layout */}
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
                        </div>
                      </div>

                      {/* Functional Footer Actions */}
                      <div className="pt-2 flex items-center justify-between border-t border-gray-50">
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
                            className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white w-10 h-10 rounded-full flex items-center justify-center transition-colors duration-200 shadow-md active:scale-95 transform cursor-pointer"
                          >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3.5" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>
                      </div>

                    </div>
                  </div>
                ))}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Slider Next Arrow */}
          <button
            onClick={handleNextCategory}
            className="absolute right-0 z-20 bg-white text-gray-800 hover:bg-[#E58A44] hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 transform translate-x-4 lg:translate-x-6 cursor-pointer"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>

        </div>
        
        {/* Footer Link Anchor */}
        <div className="text-center mt-16">
          <a href="/shop" className="inline-flex items-center gap-2 text-sm font-semibold text-[#E58A44] hover:gap-3 transition-all duration-200">
            View All
            <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5l6 6m0 0l-6 6m6-6H3.5" />
            </svg>
          </a>
        </div>

      </div>
    </section>
  );
}