"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const PILLARS = [
  {
    number: "01",
    title: "Structural Integrity",
    description: "Every joint, screw, and dowel is engineered to endure. We construct furniture that doesn't just look good, but remains architecturally sound for decades.",
  },
  {
    number: "02",
    title: "Premium Materials",
    description: "From sustainably sourced European white oak to high-resilience performance textiles, we select materials that age gracefully and resist wear.",
  },
  {
    number: "03",
    title: "Minimalist Philosophy",
    description: "We strip away the noise to focus on clean silhouettes, proportional balance, and functional elegance that elevates any modern showroom.",
  },
];

const STATS = [
  { value: "12+", label: "Years of Craft" },
  { value: "45k+", label: "Spaces Transformed" },
  { value: "100%", label: "Sustainable Timber" },
];

export default function AboutPage() {
  return (
    <>
      {/* Navigation Header */}
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A]">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="bg-[#FBFBFB] min-h-screen w-full pt-40 pb-24 text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* ================= HERO SECTION ================= */}
          <section className="mb-20 text-center max-w-3xl mx-auto">
            <motion.span
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-4 py-1.5 rounded-full"
            >
              Our Philosophy
            </motion.span>
            
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight mt-6 mb-6 leading-tight"
            >
              Crafting spaces. <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D1B2A] to-[#E58A44]">
                Defining permanent comfort.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-gray-500 text-base md:text-lg leading-relaxed font-medium"
            >
              We don’t believe in temporary trends or disposable design. We curate architectural furniture pieces designed to serve as the timeless foundation of your home.
            </motion.p>
          </section>

          {/* ================= BRAND NARRATIVE (SPLIT) ================= */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center mb-28">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 space-y-6"
            >
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">
                Born in the workshop, engineered for the modern home.
              </h2>
              <p className="text-gray-500 text-sm leading-relaxed">
                What started as a boutique design studio focused on custom timber joinery has grown into a premium catalog recognized for clean geometries and understated luxury. 
              </p>
              <p className="text-gray-500 text-sm leading-relaxed">
                Every chair, sofa, and light fixture is scrutinized through months of prototyping. We balance classical ergonomic rules with experimental materials to build statements that command a room without shouting.
              </p>
              
              {/* Micro-stats Display */}
              <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/60">
                {STATS.map((stat, i) => (
                  <div key={i}>
                    <p className="text-xl font-black text-[#E58A44]">{stat.value}</p>
                    <p className="text-[10px] uppercase tracking-wider font-bold text-gray-400 mt-1">{stat.label}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Premium Immersive Image Visual */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="lg:col-span-7 h-[450px] relative rounded-[32px] overflow-hidden shadow-md border border-gray-100"
            >
              <Image 
                src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1000" 
                alt="Minimalist curated living environment featuring premium oak furniture"
                fill
                priority
                className="object-cover group-hover:scale-102 transition-transform duration-500"
                sizes="(max-width: 1024px) 100vw, 60vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0D1B2A]/20 to-transparent pointer-events-none" />
            </motion.div>
          </section>

          {/* ================= CORE PILLARS GRID ================= */}
          <section className="border-t border-gray-200/60 pt-20 w-full">
            <div className="mb-12">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Our Commitments</span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight mt-1">The Framework of Excellence</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
              {PILLARS.map((pillar, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="bg-white p-8 rounded-[24px] border border-gray-100/80 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group"
                >
                  <div>
                    <span className="text-xs font-black text-[#E58A44]/40 group-hover:text-[#E58A44] transition-colors duration-300 font-mono tracking-wider block mb-6">
                      // {pillar.number}
                    </span>
                    <h3 className="text-lg font-bold mb-3 tracking-tight group-hover:text-[#E58A44] transition-colors duration-200">
                      {pillar.title}
                    </h3>
                    <p className="text-gray-500 text-xs leading-relaxed font-medium">
                      {pillar.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>
          </section>

        </div>
      </main>

      {/* Footer System Component */}
      <Footer />
    </>
  );
}