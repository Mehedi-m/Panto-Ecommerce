"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

export default function Material() {
  const [images, setImages] = useState([]);
  const [gridState, setGridState] = useState({ indices: [0, 1, 2], slotToUpdate: 0 });

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

  useEffect(() => {
    if (images.length <= 1) return;
    
    const interval = setInterval(() => {
      setGridState((prev) => {
        const { indices, slotToUpdate } = prev;
        let nextIdx = (indices[slotToUpdate] + 1) % images.length;
        
        if (images.length > 3) {
          while (indices.includes(nextIdx)) nextIdx = (nextIdx + 1) % images.length;
        } else {
          while (nextIdx === indices[slotToUpdate]) nextIdx = (nextIdx + 1) % images.length;
        }
        
        const newIndices = [...indices];
        newIndices[slotToUpdate] = nextIdx;
        return { indices: newIndices, slotToUpdate: (slotToUpdate + 1) % 3 };
      });
    }, 15000); // 15 Second rotation cycle
    
    return () => clearInterval(interval);
  }, [images]);

  const fadeInVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.15, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <section className="py-24 bg-[#F7F7F7]  overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">
          
          {/* Left Column Content */}
          <div className="order-2 lg:order-1">
            <span className="text-orange-500 uppercase tracking-[0.2em] text-xs font-bold block">
              Materials
            </span>
            <h2 className="text-4xl md:text-5xl font-bold text-[#1E1E1E] mt-4 leading-[1.15] max-w-md">
              Very Serious Materials For Making Furniture
            </h2>
            <p className="text-gray-500 text-sm md:text-base mt-6 leading-relaxed max-w-sm ">
              Because panto was very serious about designing furniture for our
              environment, using a very expensive and famous capital but at a
              relatively low price
            </p>
            <button className="mt-8 text-orange-500  font-medium text-sm flex items-center gap-3 group transition-opacity hover:opacity-80">
              More Info 
              <span className="inline-block transition-transform group-hover:translate-x-1.5 tracking-tighter">
                —→
              </span>
            </button>
          </div>

          {/* Right Column Multi-Image Grid with Shadows */}
          <div className="order-1 lg:order-2 flex items-center justify-center gap-6 relative">
            <div className="flex flex-col gap-6 w-1/2 max-w-[240px]">
              
              {/* Top Left Image Container Slot */}
              <motion.div 
                custom={0}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className="relative aspect-[1.1/1] w-full rounded-[24px] bg-gray-100 shadow-2xl min-h-[150px]"
              >
                <div className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {images.length > 0 && (
                      <motion.div
                        key={gridState.indices[0]}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={images[gridState.indices[0]]?.image}
                          alt="Modern workspace lounge"
                          fill
                          priority
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>

              {/* Bottom Left Image Container Slot */}
              <motion.div 
                custom={1}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className="relative aspect-[3/4] w-full rounded-[24px] bg-gray-100 shadow-2xl min-h-[200px]"
              >
                <div className="absolute inset-0 w-full h-full rounded-[24px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {images.length > 0 && (
                      <motion.div
                        key={gridState.indices[1]}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={images[gridState.indices[1]]?.image}
                          alt="Minimalist sofa composition"
                          fill
                          priority
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>

            {/* Right Main Focus Area Container Slot */}
            <div className="absolute -right-20 top-10 w-72 h-72 bg-gray-200 rounded-3xl" />
            <div className="relative w-1/2 max-w-[340px] aspect-[4/5] min-h-[300px]">
              <div className="absolute -right-16 -top-10 bottom-0 w-72 h-72 bg-gray-200 rounded-3xl -z-10" />
              <motion.div 
                custom={2}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                variants={fadeInVariants}
                className="relative w-full h-full rounded-[32px] bg-gray-100 shadow-2xl drop-shadow-2xl"
              >
                <div className="absolute inset-0 w-full h-full rounded-[32px] overflow-hidden">
                  <AnimatePresence mode="wait">
                    {images.length > 0 && (
                      <motion.div
                        key={gridState.indices[2]}
                        initial={{ opacity: 0, scale: 1.02 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.98 }}
                        transition={{ duration: 0.6 }}
                        className="absolute inset-0 w-full h-full"
                      >
                        <Image
                          src={images[gridState.indices[2]]?.image}
                          alt="Elegant dining space setup"
                          fill
                          priority
                          className="object-cover"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </motion.div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}