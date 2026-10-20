"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import bgImage from "@/utils/bg-image.jpg";
import Navbar from "../navbar/Navbar";

const texts = [
  "Search furniture...",
  "Search chairs...",
  "Search tables...",
  "Search sofas...",
];

export default function Hero() {
  const router = useRouter();
  const [placeholder, setPlaceholder] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [searchQuery, setSearchQuery] = useState("");

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      router.push("/shop");
    }
  };

  useEffect(() => {
    let charIndex = 0;

    const typing = setInterval(() => {
      const currentText = texts[textIndex];

      setPlaceholder(currentText.slice(0, charIndex + 1));

      charIndex++;

      if (charIndex === currentText.length) {
        clearInterval(typing);

        setTimeout(() => {
          setTextIndex((prev) => (prev + 1) % texts.length);
          setPlaceholder("");
        }, 1500);
      }
    }, 100);

    return () => clearInterval(typing);
  }, [textIndex]);
  return (
    <section
      className="relative min-h-screen bg-cover bg-center"
      style={{
        backgroundImage: `url(${bgImage.src})`,
      }}
    >
      <div className="absolute inset-0 bg-black/30" />

      <Navbar />

      <div className="relative z-10 flex flex-col items-center text-center mt-20 px-4">
        <h1 className="text-4xl md:text-6xl font-bold text-white  leading-tight">
          Make Your Interior More <br />
          Minimalistic & Modern
        </h1>

        <p className="mt-6 text-gray-300 max-w-xl">
          Turn your room into a lot more minimalist and modern with ease and speed.
        </p>

        <form
          onSubmit={handleSearchSubmit}
          className="mt-10 flex items-center bg-white/10 backdrop-blur-md rounded-full px-4 py-2 w-[320px] md:w-[420px] border border-white/20 focus-within:border-orange-500 transition-colors"
        >
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={placeholder}
            className="bg-transparent flex-1 outline-none text-white px-2 placeholder:text-gray-300 text-sm"
          />

          <button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 p-2 rounded-full text-white transition-colors cursor-pointer"
            aria-label="Search Catalog"
          >
            <Search size={18} />
          </button>
        </form>
      </div>

      <div className="absolute top-[60%] left-[20%] w-4 h-4 bg-white rounded-full animate-pulse" />
      <div className="absolute top-[40%] right-[20%] w-4 h-4 bg-white rounded-full animate-pulse" />

      {/* White Fade Effect */}
      <div className="absolute bottom-0 left-0 w-full h-40 bg-linear-to-t from-white via-white/30 to-transparent" />
    </section>
  );
}


