"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/context/CartContext";

export default function Navbar({ textColor = "text-white" }) {
  const pathname = usePathname();
  const { data: session, status, update: syncSession } = useSession();
  const { cartCount, toast } = useCart();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Sync session on profile updates
  useEffect(() => {
    const handleGlobalSync = async () => {
      if (typeof syncSession === "function") {
        await syncSession();
      }
    };

    window.addEventListener("panto-profile-updated", handleGlobalSync);
    return () => window.removeEventListener("panto-profile-updated", handleGlobalSync);
  }, [syncSession]);

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
    <>
      <nav className="relative z-50 flex justify-between items-center px-6 md:px-10 py-5">
        {/* Brand Logo */}
        <Link
          href="/"
          className={`text-2xl font-black tracking-tight transition-colors hover:text-orange-500 ${textColor}`}
        >
          Panto
        </Link>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 text-sm backdrop-blur-md p-3 px-6 rounded-full text-gray-500 bg-white/70 border border-gray-200/60 shadow-sm">
          {navLinks.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className={`transition-colors hover:text-[#E58A44] font-medium ${
                  pathname === link.href ? "text-[#E58A44] font-bold" : "text-gray-700"
                }`}
              >
                {link.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Action Group */}
        <div className="flex items-center gap-4 relative">
          {/* Dynamic Auth Section */}
          {status === "authenticated" ? (
            <div className="relative">
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center bg-orange-500 text-white font-bold text-sm tracking-wide shadow-sm border border-gray-200 hover:ring-2 hover:ring-orange-500/20 transition-all focus:outline-none select-none cursor-pointer"
                aria-label="User Account Menu"
              >
                {session.user?.image && !imageError ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt="User avatar profile"
                    className="w-full h-full object-cover"
                    onError={() => setImageError(true)}
                  />
                ) : (
                  <span>
                    {session.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                  </span>
                )}
              </button>

              {/* Account Dropdown Panel */}
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
                        View Profile & Orders
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
            <Link
              href="/login"
              className={`text-sm font-semibold transition-colors hover:text-orange-500 ${textColor}`}
            >
              Login
            </Link>
          )}

          {/* Cart Icon with Live Badge */}
          <Link
            href="/cart"
            className={`relative w-10 h-10 bg-white/10 hover:bg-gray-100/20 border border-gray-200/30 shadow-sm cursor-pointer rounded-full flex items-center justify-center transition-all duration-200 group ${textColor}`}
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

            {cartCount > 0 && (
              <span className="absolute -top-1.5 -right-1.5 bg-[#E58A44] text-white text-[10px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center shadow-md animate-in zoom-in-50 duration-200">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>

          {/* Mobile Menu Hamburger Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className={`md:hidden w-10 h-10 flex items-center justify-center rounded-full bg-white/10 border border-gray-200/30 ${textColor}`}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? (
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg className="w-5 h-5 stroke-current" fill="none" viewBox="0 0 24 24" strokeWidth="2.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Drawer Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white/95 backdrop-blur-xl border-b border-gray-200 text-[#0D1B2A] px-6 py-4 shadow-xl overflow-hidden relative z-40"
          >
            <ul className="flex flex-col gap-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`block py-3 px-4 rounded-xl text-sm font-semibold transition-colors ${
                      pathname === link.href
                        ? "bg-[#E58A44]/10 text-[#E58A44]"
                        : "text-gray-700 hover:bg-gray-50 hover:text-[#0D1B2A]"
                    }`}
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
              {status === "unauthenticated" && (
                <li className="pt-2 border-t border-gray-100">
                  <Link
                    href="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block py-3 px-4 text-center rounded-xl bg-[#0D1B2A] text-white text-sm font-bold"
                  >
                    Sign In
                  </Link>
                </li>
              )}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Global Interactive Toast Notification */}
      <AnimatePresence>
        {toast?.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs uppercase font-bold tracking-wider shadow-2xl backdrop-blur-md select-none ${
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