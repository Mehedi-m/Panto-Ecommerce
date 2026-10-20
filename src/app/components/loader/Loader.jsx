"use client";

import { useState, useEffect } from "react";
import ChairLoader from "./ChairLoader";

export default function Loader({ children }) {
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    // Elegant quick initial brand impression (700ms) on first mount
    const timer = setTimeout(() => {
      setIsInitialLoading(false);
    }, 700);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {isInitialLoading && <ChairLoader />}
      <div
        className={
          isInitialLoading
            ? "opacity-0 pointer-events-none"
            : "opacity-100 transition-opacity duration-500 ease-in-out"
        }
      >
        {children}
      </div>
    </>
  );
}