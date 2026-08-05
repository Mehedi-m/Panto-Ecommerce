"use client";

import { motion } from "framer-motion";

export default function ChairLoader() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Rocking Chair SVG Container */}
      <motion.div
        animate={{ rotate: [-10, 8, -10] }}
        transition={{
          repeat: Infinity,
          duration: 2,
          ease: "easeInOut",
        }}
        style={{ transformOrigin: "50% 83%" }} // Anchors rotation to the bottom curve of the rocker
        className="text-[#E58A44]"
      >
        <svg
          width="90"
          height="90"
          viewBox="0 0 100 100"
          fill="none"
          stroke="currentColor"
          strokeWidth="3.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          {/* Backrest Frame */}
          <path d="M32 20 L40 55" />
          {/* Inner Backrest Slats */}
          <line x1="37" y1="23" x2="43" y2="55" />
          
          {/* Seat Panel */}
          <line x1="38" y1="55" x2="72" y2="55" />
          
          {/* Armrest */}
          <path d="M43 38 L68 38 L68 55" />
          
          {/* Chair Legs */}
          <line x1="46" y1="55" x2="38" y2="81" />
          <line x1="64" y1="55" x2="68" y2="80" />
          
          {/* The Rocker (Curved Bottom) */}
          <path d="M20 79 Q 52 90 84 79" />
        </svg>
      </motion.div>

      {/* Pulsing Loading Text */}
      <motion.span
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: "easeInOut",
        }}
        className="mt-6 text-xs font-bold tracking-[0.3em] text-gray-400 uppercase select-none"
      >
        Loading...
      </motion.span>
    </div>
  );
}