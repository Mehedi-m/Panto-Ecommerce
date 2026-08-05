"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.message || "Something went wrong.");
      } else {
        setSuccess("Account successfully created! Redirecting to login...");
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      }
    } catch (err) {
      setError("Failed to register. Please check your network connection.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans text-[#1A1A1A]">
      
      {/* LEFT SIDE: CONTAINER FORM */}
      <div className="flex items-center justify-center px-8 py-12 md:px-16 lg:px-24">
        <div className="w-full max-w-md">
          
          <Link href="/" className="text-2xl font-black tracking-tight text-[#0D1B2A] flex items-center gap-2 mb-12">
            <span className="text-[#E58A44]">🪑</span> Panto
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Create Account</h1>
          <p className="text-sm text-gray-500 mb-8">
            Already have an account?{" "}
            <Link href="/login" className="text-[#1E3A27] font-semibold underline underline-offset-4 hover:text-[#E58A44] transition-colors">
              Sign in
            </Link>
          </p>

          {error && <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 rounded-xl font-medium">{error}</div>}
          {success && <div className="p-4 mb-4 text-sm text-green-600 bg-green-50 rounded-xl font-medium">{success}</div>}

          <form onSubmit={handleRegister} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Full Name</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className="w-full px-4 py-3.5 bg-gray-50/60 rounded-xl border border-gray-200/80 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/5 transition-all outline-none text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">E-mail</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@gmail.com"
                className="w-full px-4 py-3.5 bg-gray-50/60 rounded-xl border border-gray-200/80 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/5 transition-all outline-none text-sm text-gray-900"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3.5 bg-gray-50/60 rounded-xl border border-gray-200/80 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/5 transition-all outline-none text-sm text-gray-900"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A27] hover:bg-[#15291C] disabled:bg-gray-400 text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors mt-4 active:scale-[0.99]"
            >
              {loading ? "Creating Profile..." : "Register Now"}
            </button>
          </form>
        </div>
      </div>

      {/* RIGHT SIDE: HERO BANNER MATCHING LOGIN PAGE */}
      <div className="hidden lg:flex relative bg-[#1E3A27] items-center justify-center p-12 overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative">
          <div className="relative w-full h-56 bg-gray-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?w=500&auto=format&fit=crop&q=80"
              alt="Premium Panto Interior Style"
              fill
              priority
              className="object-contain p-4"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-[#0D1B2A] leading-snug">Designed for absolute functional performance</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Join thousands of interior enthusiasts crafting high-end premium architectural configurations across their homes.
          </p>
        </div>
      </div>
    </main>
  );
}