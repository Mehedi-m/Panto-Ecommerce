"use client";

import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import ChairLoader from "./ChairLoader";

export default function Loader({ children }) {
  const pathname = usePathname();
  const [prevPathname, setPrevPathname] = useState(pathname);
  const [isLoading, setIsLoading] = useState(true);

  // RENDERING PHASE STATE UPDATE (Prevents page flashing)
  // If the pathname changes, instantly lock the loader before the browser paints
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsLoading(true);
  }

  useEffect(() => {
    // Start a fresh 2-second clock whenever the pathname changes
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);

    // Clean up the timer if the user clicks another link rapidly
    return () => clearTimeout(timer);
  }, [pathname]);

  return (
    <>
      {/* Fixed full-screen rocking chair overlay */}
      {isLoading && <ChairLoader />}
      
      {/* Smoothly fade-in content after the 2 seconds mark */}
      <div 
        className={
          isLoading 
            ? "opacity-0 pointer-events-none" 
            : "opacity-100 transition-opacity duration-700 ease-in-out"
        }
      >
        {children}
      </div>
    </>
  );
}