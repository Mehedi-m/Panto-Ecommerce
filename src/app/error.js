"use client";

import { useEffect } from "react";
import { motion } from "framer-motion";

export default function Error({ error, reset }) {
  useEffect(() => {
    console.error("Captured Application Error:", error);
  }, [error]);

  const errorMessage =
    error?.message ||
    (typeof error === "string" ? error : "An unexpected system exception occurred.");

  const errorDigest = error?.digest;

  const handleReset = () => {
    if (typeof reset === "function") {
      try {
        reset();
      } catch (e) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  const handleGoHome = () => {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  };

  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-6 text-[#0D1B2A]">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        {/* Animated Custom Broken Furniture Visual */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, type: "spring" }}
          className="w-48 h-48 mb-8 relative flex items-center justify-center text-gray-300 drop-shadow-sm"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="w-full h-full text-gray-400"
          >
            {/* Left Back Leg & Backrest Frame */}
            <path d="M6 18V4c0-.5.4-1 1-1h6c.5 0 1 .5 1 1v5" />

            {/* Detached/Broken Right Backrest Pillar */}
            <motion.path
              animate={{ rotate: -8, x: 1, y: 2 }}
              transition={{ repeat: Infinity, repeatType: "reverse", duration: 2, ease: "easeInOut" }}
              d="M14 4v3.5"
              stroke="#E58A44"
              strokeWidth="1.5"
            />

            {/* Backrest Slats */}
            <path d="M9 6h2M9 9h4" />

            {/* Seat Platform (Cracked/Snapped in Middle) */}
            <path d="M6 12h3.5l1.5 2.5 1.5-2.5H18" strokeWidth="1.5" />

            {/* Crack Highlight */}
            <path d="M11 12l-1 2m1-2l1 1.5" stroke="#E58A44" strokeWidth="1.5" />

            {/* Front Left Leg */}
            <path d="M7 12v6" />

            {/* Front Right Leg */}
            <motion.path
              initial={{ rotate: 0 }}
              animate={{ rotate: 22, x: 2, y: -1 }}
              className="origin-top"
              d="M17 12v6"
              stroke="#E58A44"
              strokeWidth="1.5"
            />

            {/* Floor indicator */}
            <path d="M4 18h14" strokeDasharray="3 3" opacity="0.5" />
          </svg>
        </motion.div>

        {/* Messaging */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
        >
          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-3.5 py-1.5 rounded-full inline-block">
            Something Snapped
          </span>
          <h1 className="text-3xl font-black tracking-tight mt-4 mb-3">
            Well, this is uncomfortable.
          </h1>
          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed">
            Looks like this page lost its structural integrity. We’re working on gluing it back together.
          </p>
        </motion.div>

        {/* Error Diagnostic Output */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="w-full mt-6 p-4 bg-white border border-gray-200/80 rounded-2xl text-left font-mono text-[11px] text-gray-500 shadow-sm overflow-hidden"
        >
          <div className="flex items-center justify-between mb-1.5">
            <span className="text-red-500 font-semibold uppercase tracking-wider text-[9px]">
              Diagnostic Feed:
            </span>
            {errorDigest && (
              <span className="text-gray-400 text-[9px] font-mono">
                ID: {errorDigest}
              </span>
            )}
          </div>
          <p className="text-gray-700 font-medium break-words max-h-24 overflow-y-auto">
            {errorMessage}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center gap-3 mt-8 w-full"
        >
          <button
            onClick={handleReset}
            className="w-full sm:w-1/2 bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-200 shadow-sm active:scale-[0.98] cursor-pointer"
          >
            Reconstruct Page
          </button>
          <button
            onClick={handleGoHome}
            className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-[#0D1B2A] font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl border border-gray-200 transition-all duration-200 active:scale-[0.98] cursor-pointer"
          >
            Back to Showroom
          </button>
        </motion.div>
      </div>
    </div>
  );
}