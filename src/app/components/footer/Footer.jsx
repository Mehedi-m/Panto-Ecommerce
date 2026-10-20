"use client";

import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[#F7F7F7] text-[#0D1B2A] pt-20 pb-12 overflow-hidden border-t border-gray-200/50">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Main Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12 lg:gap-8 pb-16">
          {/* Column 1: Brand Info */}
          <div className="lg:col-span-2 max-w-sm">
            <Link href="/" className="text-2xl font-black tracking-tight text-[#0D1B2A] hover:text-[#E58A44] transition-colors inline-block">
              Panto
            </Link>
            <p className="text-gray-500 mt-5 text-[15px] leading-7 font-medium">
              The advantage of designing your living space with Panto is permanent craftsmanship,
              architectural minimalism, and comfortable all-around modern facilities.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6 font-mono">
              Explore
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Showroom Catalog", href: "/shop" },
                { name: "About Our Studio", href: "/about" },
                { name: "Contact Concierge", href: "/contact" },
                { name: "My Orders & Profile", href: "/profile" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-[#E58A44] text-[15px] transition-all duration-200 font-medium inline-block hover:translate-x-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Furniture */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6 font-mono">
              Collections
            </h4>
            <ul className="space-y-4">
              {[
                { name: "Chairs", href: "/shop?category=chair" },
                { name: "Beds", href: "/shop?category=bed" },
                { name: "Sofas", href: "/shop?category=sofa" },
                { name: "Lamps", href: "/shop?category=lamp" },
                { name: "View All Products", href: "/shop" },
              ].map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-gray-600 hover:text-[#E58A44] text-[15px] transition-all duration-200 font-medium inline-block hover:translate-x-1"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6 font-mono">
              Connect
            </h4>
            <ul className="space-y-4">
              {/* Facebook */}
              <li>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#1877F2] text-[15px] transition-all duration-200 font-medium group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 fill-current text-[#0D1B2A] group-hover:text-[#1877F2] transition-colors" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a
                  href="https://instagram.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#E1306C] text-[15px] transition-all duration-200 font-medium group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 stroke-current text-[#0D1B2A] group-hover:text-[#E1306C] transition-colors fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </li>

              {/* Twitter / X */}
              <li>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#0D1B2A] text-[15px] transition-all duration-200 font-medium group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 fill-current text-[#0D1B2A] group-hover:text-black transition-colors" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                  X (Twitter)
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Metadata Row */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-gray-400 font-medium">
          <div>
            Copyright © {new Date().getFullYear()} Panto Luxury Furniture. All rights reserved.
          </div>

          <div className="text-gray-500">
            Crafted with excellence by <span className="font-bold text-[#0D1B2A]"><a href="https://mehedi-portfolio-chi.vercel.app">Md. Mehedi Hasan</a></span>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/about" className="hover:text-[#E58A44] transition-colors duration-200">
              Showroom Philosophy
            </Link>
            <Link href="/contact" className="hover:text-[#E58A44] transition-colors duration-200">
              Support & Inquiries
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}