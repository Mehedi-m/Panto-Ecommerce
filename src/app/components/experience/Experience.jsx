"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

export default function Experience() {
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  // Fetch images from API
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const res = await fetch("/api/experince");
        const data = await res.json();
        setImages(data);
      } catch (error) {
        console.error(error);
      }
    };

    fetchImages();
  }, []);

  // Change image every 15 seconds (matching your interval timer value)
  useEffect(() => {
    if (!images.length) return;

    const interval = setInterval(() => {
      setCurrentImage((prev) =>
        prev === images.length - 1 ? 0 : prev + 1
      );
    }, 15000);

    return () => clearInterval(interval);
  }, [images]);

  return (
    <section className="py-24 bg-[#F7F7F7] overflow-hidden">
      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* Image Section */}
          <div className="relative">
            
            {/* Decorative Shapes */}
            <div className="absolute -left-16 -top-10 w-72 h-72 bg-gray-200 rounded-3xl" />
            <div className="absolute -right-10 top-26 w-72 h-72 bg-gray-200 rounded-3xl" />

            {/* Outer Container: Handles the deep shadow and layout sizing */}
            <div className="relative z-10 rounded-3xl shadow-2xl h-[550px] w-full bg-gray-200">
              
              {/* Inner Container: Handles masking (overflow-hidden) and keeps shadow intact */}
              <div className="absolute inset-0 w-full h-full rounded-3xl overflow-hidden">
                <AnimatePresence mode="wait">
                  {images.length > 0 && (
                    <motion.div
                      key={currentImage}
                      initial={{
                        opacity: 0,
                        scale: 1,
                      }}
                      animate={{
                        opacity: 1,
                        scale: 1.08,
                      }}
                      exit={{
                        opacity: 0,
                      }}
                      transition={{
                        opacity: {
                          duration: 1.5,
                        },
                        scale: {
                          duration: 30,
                          ease: "linear",
                        },
                      }}
                      className="absolute inset-0 w-full h-full"
                    >
                      <Image
                        src={images[currentImage]?.image}
                        alt="Premium Furniture Design"
                        fill
                        priority
                        className="object-cover"
                      />
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

            </div>
          </div>

          {/* Content Section */}
          <div>
            <p className="text-orange-500 uppercase tracking-[5px] font-semibold text-sm">
              Experiences
            </p>

            <h2 className="text-5xl text-gray-800 font-bold mt-4 leading-tight">
              We Provide You The Best Experience
            </h2>

            <p className="text-gray-500 mt-6 leading-8 text-lg font-light">
              You don't have to worry about the result because all of these
              interiors are made by professionals with premium quality
              materials and elegant modern designs that bring luxury and
              comfort into your living space.
            </p>

            <Link
              href="/about"
              className="inline-flex mt-8 text-orange-500 font-medium hover:translate-x-2 transition-transform duration-300 items-center gap-2"
            >
              More Info <span>→</span>
            </Link>
          </div>

        </div>
      </div>
    </section>
  );
}