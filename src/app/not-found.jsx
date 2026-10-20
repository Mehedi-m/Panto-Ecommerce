import Link from "next/link";
import Navbar from "./components/navbar/Navbar";
import Footer from "./components/footer/Footer";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#FBFBFB] flex flex-col justify-between text-[#0D1B2A]">
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="pt-40 pb-24 flex-grow flex items-center justify-center px-6 text-center">
        <div className="max-w-md w-full flex flex-col items-center">
          <div className="w-24 h-24 rounded-3xl bg-orange-50 border border-orange-100 flex items-center justify-center text-4xl mb-6 shadow-sm">
            🪑
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-3.5 py-1.5 rounded-full inline-block mb-3 font-mono">
            404 — Room Not Found
          </span>

          <h1 className="text-3xl md:text-4xl font-black tracking-tight mb-3">
            Lost in the Showroom?
          </h1>

          <p className="text-gray-400 text-sm max-w-sm mb-8 leading-relaxed">
            The page or furniture piece you are looking for has been moved, archived, or does not exist.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <Link
              href="/"
              className="flex-1 bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all shadow-md text-center"
            >
              Return Home
            </Link>
            <Link
              href="/shop"
              className="flex-1 bg-white hover:bg-gray-50 text-[#0D1B2A] font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl border border-gray-200 transition-all text-center"
            >
              Browse Catalog
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
