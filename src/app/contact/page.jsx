"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

const FAQS = [
  {
    q: "Can I schedule a private consultation at your showroom?",
    a: "Yes! Our design concierges host private walkthrough sessions where you can feel upholstery swatches, inspect solid timber joinery, and review custom CAD layouts.",
  },
  {
    q: "Do you deliver and assemble across Bangladesh?",
    a: "We offer white-glove nationwide delivery. Our logistics team handles delicate transport, on-site unpacking, precision placement, and debris removal.",
  },
  {
    q: "Can I customize wood finishes, dimensions, and fabrics?",
    a: "Absolutely. Over 80% of our architectural catalog can be tailored with bespoke dimensions, European white oak or Burmese teak finishes, and commercial-grade bouclé, velvet, or top-grain leather.",
  },
  {
    q: "What warranty coverage is included with my furniture?",
    a: "Every Panto original includes a 5-year structural warranty covering timber stability, joints, and mechanical hardware, paired with complimentary 1-year finish care.",
  },
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    category: "General Inquiry",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [activeFaq, setActiveFaq] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate luxury API communication latency
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setForm({
        name: "",
        email: "",
        phone: "",
        category: "General Inquiry",
        message: "",
      });
    }, 700);
  };

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white/90 backdrop-blur-md border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="pt-36 pb-24 bg-[#FBFBFB] min-h-screen w-full text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          {/* Header Section */}
          <section className="text-center max-w-3xl mx-auto mb-16">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xs font-bold uppercase tracking-widest text-[#E58A44] bg-[#E58A44]/10 px-4 py-1.5 rounded-full inline-block mb-4"
            >
              Get In Touch
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-4xl md:text-6xl font-black tracking-tight leading-tight mb-4"
            >
              Let&apos;s Build Something <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#0D1B2A] to-[#E58A44]">
                Remarkable Together
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-gray-500 text-sm md:text-base leading-relaxed"
            >
              Have an interior design project, custom commission question, or showroom inquiry?
              Our concierge team is standing by to guide your vision.
            </motion.p>
          </section>

          {/* Core Content Grid: Contact Details & Form */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start mb-24">
            {/* Left Column: Direct Studio & Showroom Info */}
            <div className="lg:col-span-5 flex flex-col gap-6">
              {/* Showroom Card */}
              <div className="bg-white rounded-[28px] p-8 border border-gray-100 shadow-sm flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#E58A44] font-mono block mb-2">
                    Flagship Studio & Showroom
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mb-3">Panto Design Gallery</h3>
                  <p className="text-gray-500 text-xs leading-relaxed mb-6 font-medium">
                    Road 11, Block D, Banani <br />
                    Dhaka 1213, Bangladesh
                  </p>

                  <div className="space-y-3 pt-4 border-t border-gray-100 text-xs font-medium text-gray-600">
                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gray-50 text-base flex items-center justify-center">
                        📞
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Direct Phone</span>
                        <a href="tel:+8801786910873" className="hover:text-[#E58A44] transition-colors font-semibold">
                          +880 1786 910 873
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gray-50 text-base flex items-center justify-center">
                        ✉️
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Concierge Email</span>
                        <a href="mailto:concierge@panto.com" className="hover:text-[#E58A44] transition-colors font-semibold">
                          concierge@panto.com
                        </a>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="w-8 h-8 rounded-xl bg-gray-50 text-base flex items-center justify-center">
                        🕒
                      </span>
                      <div>
                        <span className="text-[10px] text-gray-400 block uppercase font-bold">Showroom Hours</span>
                        <span>Sun - Thu: 9:00 AM – 8:00 PM | Fri - Sat: 10:00 AM – 6:00 PM</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Showroom Perks Banner */}
              <div className="bg-[#0D1B2A] text-white rounded-[28px] p-8 shadow-xl relative overflow-hidden">
                <div className="absolute top-0 right-0 w-48 h-48 bg-[#E58A44]/15 rounded-full blur-2xl pointer-events-none" />
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#E58A44] block mb-2 font-mono">
                  Bespoke Commissions
                </span>
                <h3 className="text-lg font-bold mb-2">Architectural Interior Consulting</h3>
                <p className="text-gray-400 text-xs leading-relaxed mb-4">
                  Planning a residential estate or commercial headquarters? Schedule a dedicated session with our lead furniture architect.
                </p>
                <div className="flex items-center gap-2 text-xs font-semibold text-[#E58A44]">
                  <span>Dedicated material testing included</span>
                  <span>→</span>
                </div>
              </div>
            </div>

            {/* Right Column: Interactive Contact Form */}
            <div className="lg:col-span-7 bg-white rounded-[32px] p-8 md:p-10 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold mb-2">Send an Inquiry</h2>
              <p className="text-gray-400 text-xs mb-8">
                Fill in your details below and a design consultant will respond within 24 hours.
              </p>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mb-8 p-5 bg-green-50 border border-green-200 rounded-2xl text-xs text-green-800 flex items-start gap-3"
                >
                  <span className="text-xl leading-none">✓</span>
                  <div>
                    <h4 className="font-bold mb-1">Message Received!</h4>
                    <p>
                      Thank you for contacting Panto. One of our design concierge specialists has received your inquiry and will reach out shortly.
                    </p>
                  </div>
                </motion.div>
              )}

              <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={form.name}
                      onChange={handleInputChange}
                      placeholder="e.g. Tanvir Hasan"
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E58A44] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleInputChange}
                      placeholder="e.g. tanvir@domain.com"
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E58A44] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Phone Number (Optional)
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-[#E58A44] transition-colors"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                      Inquiry Category *
                    </label>
                    <select
                      name="category"
                      value={form.category}
                      onChange={handleInputChange}
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-[#E58A44] transition-colors text-gray-700 font-medium"
                    >
                      <option value="General Inquiry">General Inquiry</option>
                      <option value="Custom Furniture Commission">Custom Furniture Commission</option>
                      <option value="Showroom Private Appointment">Showroom Private Appointment</option>
                      <option value="Order & Delivery Status">Order & Delivery Status</option>
                      <option value="Commercial / Interior Partnership">Commercial / Interior Partnership</option>
                    </select>
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">
                    Your Message *
                  </label>
                  <textarea
                    name="message"
                    required
                    rows="5"
                    value={form.message}
                    onChange={handleInputChange}
                    placeholder="Describe your furniture requirements, room dimensions, or any specific questions..."
                    className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl p-4 text-sm focus:outline-none focus:border-[#E58A44] transition-colors resize-none placeholder:text-gray-300"
                  />
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-xs font-bold uppercase tracking-wider py-4 rounded-xl shadow-md transition-all duration-200 cursor-pointer disabled:bg-gray-400 disabled:cursor-not-allowed mt-2"
                >
                  {isSubmitting ? "Dispatching Message..." : "Send Message"}
                </button>
              </form>
            </div>
          </div>

          {/* Interactive FAQ Accordion Section */}
          <section className="border-t border-gray-200/60 pt-20">
            <div className="text-center max-w-xl mx-auto mb-12">
              <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400 font-mono block mb-2">
                Common Questions
              </span>
              <h2 className="text-2xl md:text-3xl font-bold tracking-tight">Frequently Asked Questions</h2>
            </div>

            <div className="max-w-3xl mx-auto flex flex-col gap-4">
              {FAQS.map((faq, idx) => {
                const isOpen = activeFaq === idx;
                return (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm transition-shadow hover:shadow-md"
                  >
                    <button
                      onClick={() => setActiveFaq(isOpen ? null : idx)}
                      className="w-full text-left p-6 flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="font-bold text-sm md:text-base text-[#0D1B2A]">{faq.q}</span>
                      <span className={`text-xl font-mono text-[#E58A44] transition-transform duration-200 ${isOpen ? "rotate-45" : ""}`}>
                        +
                      </span>
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="px-6 pb-6 text-xs md:text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3"
                        >
                          {faq.a}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </>
  );
}
