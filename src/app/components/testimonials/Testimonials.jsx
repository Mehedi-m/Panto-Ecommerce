"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";

const BACKDROP_COVERS = [
  "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1540518614846-7eded433c457?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=600&q=80",
  "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80"
];

const fadeInScrollVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: { 
    opacity: 1, 
    y: 0, 
    transition: { duration: 0.6, ease: "easeOut" } 
  }
};

export default function Testimonials() {
  const [data, setData] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [itemsPerPage, setItemsPerPage] = useState(3);

  // 1. DYNAMIC RESPONSIVE TRACKER (Fixes sliding width bugs across screens)
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(1); // Mobile
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(2); // Tablet
      } else {
        setItemsPerPage(3); // Desktop
      }
    };

    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // 2. SAFE API FETCH
  useEffect(() => {
    const loadReviews = async () => {
      try {
        const res = await fetch("/api/testimonials");
        if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
        const json = await res.json();
        if (Array.isArray(json)) {
          setData(json);
        }
      } catch (err) {
        console.error("Failed to load testimonials:", err);
      }
    };
    loadReviews();
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev === 0 ? Math.max(0, data.length - itemsPerPage) : prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev >= data.length - itemsPerPage ? 0 : prev + 1));
  };

  // Prevent rendering markup on empty database payloads
  if (!data || data.length === 0) return null;

  return (
    <section className="py-24 bg-white overflow-hidden w-full">
      <div className="max-w-7xl mx-auto px-6 md:px-12 relative">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <span className="text-orange-500 font-semibold text-xs tracking-[0.3em] uppercase block">
            Testimonials
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-3 tracking-tight">
            Our Client Reviews
          </h2>
        </div>

        {/* Carousel Window Frame Mask */}
        <motion.div 
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={fadeInScrollVariants}
          className="relative items-center flex w-full group px-2"
        >
          {/* Left Arrow Button */}
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="absolute -left-2 z-30 bg-white hover:bg-orange-500 text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-800"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
            </svg>
          </button>

          {/* Dynamic Motion Slide Windows */}
          <div className="w-full overflow-hidden py-6">
            <motion.div
              animate={{ x: `-${currentIndex * (100 / itemsPerPage)}%` }}
              transition={{ type: "spring", stiffness: 140, damping: 20 }}
              className="flex gap-6 w-full"
            >
              {data.map((item, idx) => {
                const cardCover = BACKDROP_COVERS[idx % BACKDROP_COVERS.length];

                return (
                  <div
                    key={item._id || idx}
                    className="w-full sm:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] shrink-0 relative h-[500px] rounded-[28px] bg-gray-100 shadow-lg"
                  >
                    {/* Background Graphic Element */}
                    <div className="absolute inset-0 w-full h-full rounded-[28px] overflow-hidden">
                      <Image
                        src={cardCover}
                        alt="Interior design mockup cover"
                        fill
                        priority={idx < 3}
                        className="object-cover pointer-events-none filter brightness-95"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      />
                    </div>

                    {/* Review Meta Overlay Box */}
                    <div className="absolute bottom-5 left-5 right-5 bg-white rounded-2xl p-6 pt-12 flex flex-col items-center justify-between min-h-[220px] shadow-xl">
                      
                      {/* Avatar Photo Frame with Structural Fallback Checkers */}
                      <div className="absolute -top-10 left-1/2 -translate-x-1/2 w-20 h-20 rounded-full border-[4px] border-white shadow-md overflow-hidden bg-gray-200">
                        <Image
                          src={item.profileImage || "https://randomuser.me/api/portraits/legacy/35.jpg"}
                          alt={item.name || "Customer Reviewer"}
                          fill
                          className="object-cover"
                          sizes="80px"
                        />
                      </div>

                      {/* Descriptive Typography Segment */}
                      <div className="text-center w-full">
                        <h4 className="text-[17px] font-bold text-gray-800 tracking-tight">
                          {item.name || "Anonymous Guest"}
                        </h4>
                        <p className="text-gray-400 text-xs mt-0.5 font-light">
                          {item.role || "Verified Buyer"}
                        </p>
                        <p className="text-gray-500 text-xs md:text-[13px] leading-relaxed mt-4 font-light px-1 line-clamp-3">
                          “{item.review || "No written review comments provided."}”
                        </p>
                      </div>

                      {/* Metric Stars Array Generation Engine */}
                      <div className="flex gap-1 mt-4">
                        {Array.from({ length: 5 }).map((_, starIdx) => (
                          <svg
                            key={starIdx}
                            className={`w-4 h-4 ${
                              starIdx < (Number(item.rating) || 5)
                                ? "text-orange-500 fill-current"
                                : "text-gray-200 fill-current"
                            }`}
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>

          {/* Right Arrow Button */}
          <button
            onClick={handleNext}
            disabled={currentIndex >= data.length - itemsPerPage}
            className="absolute -right-2 z-30 bg-white hover:bg-orange-500 text-gray-800 hover:text-white w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-all duration-300 disabled:opacity-30 disabled:hover:bg-white disabled:hover:text-gray-800"
          >
            <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
            </svg>
          </button>
        </motion.div>

      </div>
    </section>
  );
}