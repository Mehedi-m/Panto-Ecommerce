"use client";

import { useEffect } from "react";

export default function GlobalError({ error, reset }) {
  useEffect(() => {
    console.error("Critical Root Layout Error:", error);
  }, [error]);

  const errorMessage =
    error?.message ||
    (typeof error === "string" ? error : "An unexpected critical system exception occurred.");

  const handleReset = () => {
    if (typeof reset === "function") {
      try {
        reset();
      } catch (e) {
        window.location.reload();
      }
    } else {
      window.location.reload();
    }
  };

  return (
    <html lang="en">
      <body className="min-h-screen bg-[#FBFBFB] flex flex-col items-center justify-center p-6 text-[#0D1B2A] font-sans">
        <div className="max-w-md w-full text-center flex flex-col items-center">
          <div className="w-20 h-20 bg-orange-50 text-orange-500 rounded-3xl flex items-center justify-center text-3xl mb-6 shadow-sm border border-orange-100">
            ⚠️
          </div>

          <span className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-3.5 py-1.5 rounded-full inline-block mb-3">
            System Level Fault
          </span>

          <h1 className="text-3xl font-black tracking-tight mb-3">
            Critical Environment Error
          </h1>

          <p className="text-gray-500 text-sm max-w-sm mx-auto leading-relaxed mb-6">
            The application root framework encountered an unhandled exception.
          </p>

          <div className="w-full p-4 bg-white border border-gray-200 rounded-2xl text-left font-mono text-[11px] text-gray-600 shadow-sm mb-8 overflow-hidden">
            <span className="text-red-500 font-semibold uppercase tracking-wider block mb-1 text-[9px]">
              Root Diagnostic:
            </span>
            <p className="break-words max-h-24 overflow-y-auto">{errorMessage}</p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3 w-full">
            <button
              onClick={handleReset}
              className="w-full sm:w-1/2 bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl transition-all duration-200 cursor-pointer shadow-md"
            >
              Reboot App
            </button>
            <button
              onClick={() => {
                window.location.href = "/";
              }}
              className="w-full sm:w-1/2 bg-white hover:bg-gray-50 text-[#0D1B2A] font-bold text-xs uppercase tracking-wider py-4 px-6 rounded-xl border border-gray-200 transition-all duration-200 cursor-pointer"
            >
              Return Home
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
