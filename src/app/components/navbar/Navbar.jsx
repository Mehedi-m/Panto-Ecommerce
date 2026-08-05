"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

export default function Navbar({ textColor = "text-white" }) {
  const pathname = usePathname();
  
  // 🎯 Pull the native update method out and rename it to syncSession
  const { data: session, status, update: syncSession } = useSession();
  
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // 🔄 FORCE SYNC FALLBACK: Listens for a manual broadcast if NextAuth client lags
  useEffect(() => {
    const handleGlobalSync = async () => {
      console.log("🔔 Navbar caught update event! Syncing global session state...");
      if (typeof syncSession === "function") {
        await syncSession();
      }
    };

    window.addEventListener("panto-profile-updated", handleGlobalSync);
    return () => window.removeEventListener("panto-profile-updated", handleGlobalSync);
  }, [syncSession]);

  // Reset the image error state whenever the user session changes
  useEffect(() => {
    setImageError(false);
  }, [session]);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Shop", href: "/shop" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="relative z-50 flex justify-between items-center px-10 py-6">
      {/* Brand Logo - Uses Dynamic Text Color */}
      <Link
        href="/"
        className={`text-2xl font-bold transition-colors hover:text-orange-500 ${textColor}`}
      >
        Panto
      </Link>

      {/* Nav Links Box */}
      <ul className="hidden md:flex gap-8 text-sm backdrop-blur-md p-3 rounded-full text-gray-400 border border-gray-200/60 shadow-sm">
        {navLinks.map((link) => (
          <li key={link.href}>
            <Link
              href={link.href}
              className={`transition-colors hover:text-orange-500 ${
                pathname === link.href ? "text-orange-500 font-semibold" : ""
              }`}
            >
              {link.name}
            </Link>
          </li>
        ))}
      </ul>

      {/* Action Group: Dynamic Authentication state + Premium Cart Icon */}
      <div className="flex items-center gap-5 relative">
        
        {/* Dynamic Auth Section */}
        {status === "authenticated" ? (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-orange-500 text-white font-bold text-sm tracking-wide shadow-sm border border-gray-200 hover:ring-2 hover:ring-orange-500/20 transition-all focus:outline-none select-none cursor-pointer"
            >
              {session.user?.image && !imageError ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img 
                  src={session.user.image} 
                  alt="User avatar profile" 
                  className="w-full h-full object-cover"
                  onError={() => setImageError(true)} // Gracefully handles broken images on error
                />
              ) : (
                <span>
                  {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </span>
              )}
            </button>

            {/* Dropdown Card Utility Panel */}
            {dropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setDropdownOpen(false)} />
                <div className="absolute right-0 mt-3 w-64 bg-white rounded-2xl shadow-xl border border-gray-100 p-4 text-[#1A1A1A] z-20 animate-in fade-in slide-in-from-top-2 duration-150">
                  <div className="pb-3 border-b border-gray-100">
                    <p className="font-bold text-sm text-gray-900 truncate">{session.user?.name}</p>
                    <p className="text-xs text-gray-400 truncate mt-0.5">{session.user?.email}</p>
                  </div>
                  
                  <div className="flex flex-col gap-1 mt-3">
                    <Link
                      href="/profile"
                      onClick={() => setDropdownOpen(false)}
                      className="text-xs font-semibold text-gray-600 hover:text-orange-500 hover:bg-gray-50 px-3 py-2 rounded-lg transition-colors text-left"
                    >
                      View Profile
                    </Link>
                    
                    <button
                      onClick={() => {
                        setDropdownOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      className="text-xs font-bold text-red-500 hover:bg-red-50 px-3 py-2 rounded-lg transition-colors text-left w-full cursor-pointer"
                    >
                      Logout
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ) : (
          /* Login Link - Uses Dynamic Text Color */
          <Link
            href="/login"
            className={`text-sm font-medium transition-colors hover:text-orange-500 ${textColor}`}
          >
            Login
          </Link>
        )}

        {/* Premium Cart SVG Link */}
        <Link
          href="/cart"
          className={`w-10 h-10 bg-white/10 hover:bg-gray-100/20 border border-gray-200/30 shadow-sm cursor-pointer rounded-full flex items-center justify-center transition-all duration-200 group ${textColor}`}
          aria-label="View Cart"
        >
          <svg
            className="w-5 h-5 transition-transform duration-200 group-hover:scale-105 stroke-current fill-none"
            strokeWidth="2"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z"
            />
          </svg>
        </Link>
      </div>
    </nav>
  );
}