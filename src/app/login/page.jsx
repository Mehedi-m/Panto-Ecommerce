"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (res.error) {
        setError(res.error);
      } else {
        router.push("/shop");
        router.refresh();
      }
    } catch (err) {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full grid grid-cols-1 lg:grid-cols-2 bg-white font-sans text-[#1A1A1A]">
      
      {/* LEFT SIDE: FORM */}
      <div className="flex items-center justify-center px-8 py-12 md:px-16 lg:px-24">
        <div className="w-full max-w-md">
          {/* Brand Identity */}
          <Link href="/" className="text-2xl font-black tracking-tight text-[#0D1B2A] flex items-center gap-2 mb-12">
            Panto
          </Link>

          <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">Sign in</h1>
          <p className="text-sm text-gray-500 mb-8">
            Don’t have an account?{" "}
            <Link href="/signup" className="text-[#1E3A27] font-semibold underline underline-offset-4 hover:text-[#E58A44] transition-colors">
              Create now
            </Link>
          </p>

          {error && <div className="p-4 mb-4 text-sm text-red-600 bg-red-50 rounded-xl font-medium">{error}</div>}

          <form onSubmit={handleLogin} className="space-y-5">
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
  <div className="relative">
    <input
      type={showPassword ? "text" : "password"}
      required
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      placeholder="@#*%"
      className="w-full px-4 py-3.5 bg-gray-50/60 rounded-xl border border-gray-200/80 focus:border-[#1E3A27] focus:bg-white focus:ring-2 focus:ring-[#1E3A27]/5 transition-all outline-none text-sm text-gray-900 pr-12"
    />
    <button
      type="button"
      onClick={() => setShowPassword(!showPassword)}
      className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-gray-600 transition-colors focus:outline-none"
      aria-label={showPassword ? "Hide password" : "Show password"}
    >
      {showPassword ? (
        /* Clean Eye-Slash Minimal Vector Path Icon */
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.822 7.822L21 21m-2.228-2.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
        </svg>
      ) : (
        /* Clean Visible Eye Vector Path Icon */
        <svg className="w-5 h-5 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
      )}
    </button>
  </div>
</div>

            <div className="flex items-center justify-between text-sm pt-1">
              <label className="flex items-center gap-2 text-gray-500 font-medium cursor-pointer select-none">
                <input type="checkbox" className="w-4 h-4 rounded border-gray-300 text-[#1E3A27] focus:ring-[#1E3A27]" />
                Remember me
              </label>
              <Link href="#" className="font-semibold text-gray-600 hover:text-[#E58A44] underline underline-offset-2">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#1E3A27] hover:bg-[#15291C] disabled:bg-gray-400 text-white font-semibold text-sm py-4 rounded-xl shadow-md transition-colors mt-2 active:scale-[0.99]"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Social Sign-In Splitter */}
          <div className="relative flex py-6 items-center">
            <div className="flex-grow border-t border-gray-200"></div>
            <span className="flex-shrink mx-4 text-xs font-bold uppercase tracking-widest text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-200"></div>
          </div>

          <div className="space-y-3">
            <button
              onClick={() => signIn("google", { callbackUrl: "/shop" })}
              className="w-full flex items-center justify-center gap-3 bg-white border border-gray-200 hover:bg-gray-50 text-gray-700 text-sm font-semibold py-3.5 rounded-xl transition-all shadow-sm active:scale-[0.99]"
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="#EA4335" d="M12 5.04c1.66 0 3.2.57 4.42 1.69l3.3-3.3C17.74 1.58 15.06 1 12 1 7.35 1 3.37 3.65 1.39 7.56l3.87 3C6.18 7.56 8.84 5.04 12 5.04z"/>
                <path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.29 1.48-1.14 2.73-2.4 3.58l3.73 2.88c2.18-2.01 3.7-4.98 3.7-8.61z"/>
                <path fill="#FBBC05" d="M5.26 14.12A7.15 7.15 0 0 1 4.8 12c0-.74.13-1.46.36-2.12L1.29 6.88A11.83 11.83 0 0 0 0 12c0 1.84.42 3.58 1.17 5.14l4.09-3.02z"/>
                <path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.73-2.88c-1.04.7-2.37 1.12-4.23 1.12-3.16 0-5.82-2.52-6.74-5.52L1.3 15.84A11.88 11.88 0 0 0 12 23z"/>
              </svg>
              Continue with Google
            </button>
          </div>
        </div>
      </div>

      {/* RIGHT SIDE: FURNITURE PROMO CAROUSEL HERO */}
      <div className="hidden lg:flex relative bg-orange-200 items-center justify-center p-12 overflow-hidden">
        {/* Subtle geometric structural patterns */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-white/5 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />
        

        {/* Dynamic Inner Premium Graphic Card Container */}
        <div className="w-full max-w-md bg-white rounded-3xl p-8 shadow-2xl relative mt-4">
          <div className="relative w-full h-56 bg-gray-50 rounded-2xl overflow-hidden mb-6 flex items-center justify-center">
            <Image
              src="https://images.unsplash.com/photo-1592078615290-033ee584e267?w=500&auto=format&fit=crop&q=80"
              alt="Premium Panto Chair Lounge"
              fill
              priority
              className="object-contain p-4"
            />
          </div>
          
          <h2 className="text-2xl font-bold text-[#0D1B2A] leading-snug">Bring sleek luxury back to your living space</h2>
          <p className="text-sm text-gray-500 mt-2 leading-relaxed">
            Discover comfort engineered perfectly to give your studio workspace all-around modern facilities.
          </p>

          <div className="mt-6 pt-5 border-t border-gray-100 flex items-center justify-between">
            <Link href="/shop" className="bg-gray-800 hover:bg-[#E58A44] text-white text-xs font-bold px-5 py-3 rounded-xl transition-colors">
              Explore Catalog
            </Link>
            <div className="text-right">
              <span className="text-[10px] text-gray-400 font-bold block uppercase tracking-wider">Starting at</span>
              <span className="text-lg font-black text-gray-800">$299.00</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}