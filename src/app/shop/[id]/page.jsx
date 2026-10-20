"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import Navbar from "../../components/navbar/Navbar";
import Footer from "../../components/footer/Footer";
import { useCart } from "@/context/CartContext";

export default function ProductDetailsPage() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();

  // Core States
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Fetch product details from API
  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/experince");
        const data = await res.json();

        if (Array.isArray(data)) {
          const foundItem = data.find((p) => String(p._id) === String(id));
          setProduct(foundItem || null);
        }
      } catch (err) {
        console.error("Error connecting to database details route:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchProductDetails();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(product);
  };

  const handleBuyNow = () => {
    if (!product) return;
    addToCart(product);
    router.push("/checkout");
  };

  if (!loading && !product) {
    return (
      <div className="min-h-screen bg-white flex flex-col justify-between text-[#1E1E1E]">
        <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white border-b border-gray-100">
          <Navbar textColor="text-[#0D1B2A]" />
        </header>

        <main className="pt-40 pb-24 flex flex-col items-center justify-center gap-4 px-6 text-center">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center text-3xl mb-2">
            🛋️
          </div>
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-400 text-sm max-w-sm">
            We couldn&apos;t find this furniture item in our active showroom database.
          </p>
          <Link
            href="/shop"
            className="mt-4 bg-[#0D1B2A] text-white text-xs font-bold uppercase tracking-wider px-8 py-3.5 rounded-full hover:bg-[#E58A44] transition-colors"
          >
            ← Return to Catalog
          </Link>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-[#1E1E1E] flex flex-col justify-between">
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="w-full flex-grow pt-36 pb-20">
        <div className="max-w-6xl w-full mx-auto px-6 md:px-12 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Left Column: Focused Product Stage Canvas */}
          <div className="w-full flex flex-col justify-center">
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-gray-400 hover:text-gray-800 text-xs font-semibold uppercase tracking-wider transition-colors mb-6"
            >
              <span>←</span> Back to Catalog
            </Link>

            <div className="w-full aspect-square max-h-[480px] relative rounded-[32px] bg-[#FAFAFA] border border-gray-100 flex items-center justify-center p-8 shadow-sm">
              {loading ? (
                <div className="w-full h-full bg-gray-200/60 rounded-2xl animate-pulse" />
              ) : (
                <Image
                  src={product?.image || "https://images.unsplash.com/photo-1592078615290-033ee584e267?w=600"}
                  alt={product?.name || "Product"}
                  fill
                  priority
                  className="object-contain p-4"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
              )}
            </div>
          </div>

          {/* Right Column: Specification Details Panel */}
          <div className="w-full flex flex-col justify-center">
            {loading ? (
              <div className="space-y-6 max-w-lg w-full animate-pulse">
                <div className="h-4 bg-gray-200 rounded-md w-1/4" />
                <div className="h-12 bg-gray-200 rounded-xl w-3/4" />
                <div className="h-4 bg-gray-200 rounded-md w-1/3" />
                <div className="h-8 bg-gray-200 rounded-lg w-1/5 pt-2" />
                <div className="space-y-2 pt-2">
                  <div className="h-4 bg-gray-200 rounded-md w-full" />
                  <div className="h-4 bg-gray-200 rounded-md w-5/6" />
                </div>
                <div className="flex gap-4 pt-6">
                  <div className="h-12 bg-gray-200 rounded-xl flex-grow" />
                  <div className="h-12 bg-gray-200 rounded-xl flex-grow" />
                </div>
              </div>
            ) : (
              <div className="space-y-6 max-w-lg">
                <span className="text-[#E58A44] font-bold text-xs tracking-[0.2em] uppercase block">
                  Premium {product?.category} Setup
                </span>

                <h1 className="text-3xl lg:text-5xl font-black text-gray-900 tracking-tight leading-tight">
                  {product?.name}
                </h1>

                <div className="flex items-center gap-2">
                  <div className="flex text-[#FFB13B]">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <svg
                        key={i}
                        className={`w-4 h-4 ${
                          i < Math.floor(product?.rating || 5)
                            ? "fill-current"
                            : "text-gray-200 fill-current"
                        }`}
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-xs font-semibold text-gray-400 ml-1">
                    ({product?.rating || "5.0"} Customer Score)
                  </span>
                </div>

                <div className="text-3xl font-extrabold text-[#0D1B2A] flex items-baseline tracking-tight pt-1">
                  <span className="text-lg font-medium mr-0.5 text-gray-400">$</span>
                  {product?.price}
                </div>

                <p className="text-gray-500 leading-relaxed font-light text-sm lg:text-[15px]">
                  {product?.description ||
                    "Expertly crafted with hand-selected materials. Engineered to bring enduring comfort, minimalist refinement, and structural balance into your living environment."}
                </p>

                {/* Functional Action Buttons */}
                <div className="flex items-center gap-4 pt-6">
                  <button
                    onClick={handleAddToCart}
                    className="flex-grow bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-semibold px-8 py-4 rounded-2xl transition-colors duration-200 tracking-wide text-xs uppercase shadow-sm cursor-pointer text-center"
                  >
                    Add to Cart
                  </button>
                  <button
                    onClick={handleBuyNow}
                    className="flex-grow bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold px-8 py-4 rounded-2xl transition-colors duration-200 tracking-wide text-xs uppercase cursor-pointer text-center"
                  >
                    Buy Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}