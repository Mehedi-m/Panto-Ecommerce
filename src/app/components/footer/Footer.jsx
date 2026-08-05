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
            <h3 className="text-2xl font-black tracking-tight text-[#0D1B2A]">
              Panto
            </h3>
            <p className="text-gray-500 mt-5 text-[15px] leading-7 font-medium opacity-80">
              The advantage of hiring a workspace with us is that gives you 
              comfortable service and all-around facilities.
            </p>
          </div>

          {/* Column 2: Services */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6">
              Services
            </h4>
            <ul className="space-y-4">
              {["Email Marketing", "Campaigns", "Branding"].map((item) => (
                <li key={item}>
                  <Link 
                    href={`/services/${item.toLowerCase().replace(" ", "-")}`}
                    className="text-gray-600 hover:text-[#E58A44] text-[15px] transition-all duration-200 font-semibold inline-block hover:translate-x-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Furniture */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6">
              Furniture
            </h4>
            <ul className="space-y-4">
              {["Beds", "Chair", "All"].map((item) => (
                <li key={item}>
                  <Link 
                    href={item === "All" ? "/shop" : `/shop?category=${item.toLowerCase()}`}
                    className="text-gray-600 hover:text-[#E58A44] text-[15px] transition-all duration-200 font-semibold inline-block hover:translate-x-1"
                  >
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Follow Us */}
          <div>
            <h4 className="text-[#E58A44] font-bold text-xs tracking-widest uppercase mb-6">
              Follow Us
            </h4>
            <ul className="space-y-4">
              
              {/* Facebook */}
              <li>
                <a 
                  href="https://facebook.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#1877F2] text-[15px] transition-all duration-200 font-semibold group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 fill-current text-[#0D1B2A] group-hover:text-[#1877F2] transition-colors" viewBox="0 0 24 24">
                    <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" />
                  </svg>
                  Facebook
                </a>
              </li>

              {/* Twitter */}
              <li>
                <a 
                  href="https://twitter.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#1DA1F2] text-[15px] transition-all duration-200 font-semibold group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 fill-current text-[#0D1B2A] group-hover:text-[#1DA1F2] transition-colors" viewBox="0 0 24 24">
                    <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z"/>
                  </svg>
                  Twitter
                </a>
              </li>

              {/* Instagram */}
              <li>
                <a 
                  href="https://instagram.com" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 text-gray-600 hover:text-[#E1306C] text-[15px] transition-all duration-200 font-semibold group hover:translate-x-1"
                >
                  <svg className="w-5 h-5 stroke-current text-[#0D1B2A] group-hover:text-[#E1306C] transition-colors fill-none" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                  </svg>
                  Instagram
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Bottom Metadata Row */}
        <div className="border-t border-gray-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-gray-400 font-medium">
          <div>
            Copyright © {new Date().getFullYear()}
          </div>
          
          <div className="text-gray-500">
            Developed by <span className="font-bold text-[#0D1B2A]">Md. Mehedi Hasan</span> with <span className="font-bold text-[#0D1B2A]">Next.js</span> 
            <span className="text-[#E58A44]"> ❤</span>
          </div>
          
          <div className="flex items-center gap-8">
            <Link href="/terms" className="hover:text-[#E58A44] transition-colors duration-200">
              Terms & Conditions
            </Link>
            <Link href="/privacy" className="hover:text-[#E58A44] transition-colors duration-200">
              Privacy Policy
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
}