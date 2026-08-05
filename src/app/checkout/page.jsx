"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function CheckoutPage() {
  const router = useRouter();

  // Core Cart & Validation States
  const [cartItems, setCartItems] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);
  const [orderId, setOrderId] = useState(""); 

  // Form Fields State (Tailored for Bangladesh Layout Ecosystem)
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    address: "",
    apartment: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
    phone: "",
    paymentMethod: "cod", 
    transactionId: "",
  });

  // Promotional Codes System
  const [promoInput, setPromoInput] = useState("");
  const [appliedDiscount, setAppliedDiscount] = useState(0); 

  // Premium UI Notification State
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Sync structural shopping state on client hydration layout pass
  useEffect(() => {
    const userIsLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const storedUserId = localStorage.getItem("userId");
    
    setIsLoggedIn(userIsLoggedIn);
    if (storedUserId) setUserId(storedUserId);

    if (userIsLoggedIn && storedUserId) {
      const fetchUserCart = async () => {
        try {
          const res = await fetch(`/api/cart?userId=${storedUserId}`);
          if (res.ok) {
            const data = await res.json();
            setCartItems(data || []);
          }
        } catch (err) {
          console.error("Failed fetching database payload vector:", err);
        } finally {
          setIsLoading(false);
        }
      };
      fetchUserCart();
    } else {
      const localCart = localStorage.getItem("guestCart");
      if (localCart) {
        try {
          setCartItems(JSON.parse(localCart));
        } catch (e) {
          console.error("Failed parsing guest cart index matrix:", e);
        }
      }
      setIsLoading(false);
    }
  }, []);

  // Form Value Change Handler
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Financial Summary Computations
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const shippingCosts = cartItems.length > 0 ? 120.0 : 0.0; 

  // Promotional Code Logic 
  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoInput.trim().toUpperCase() === "LUXURY10") {
      if (subtotal >= 1000) {
        setAppliedDiscount(subtotal * 0.1); 
        triggerToast("🏷️ Promotional code 'LUXURY10' applied successfully!", "success");
      } else {
        triggerToast("Code 'LUXURY10' requires a minimum order value of ৳1000", "error");
      }
    } else {
      triggerToast("Invalid promotional voucher or coupon sequence", "error");
    }
  };

  const grandTotal = Math.max(0, subtotal + shippingCosts - appliedDiscount);

  // Core Checkout Processing Flow linked with native driver backend endpoint
  const handleOrderSubmission = async (e) => {
    if (e) e.preventDefault();
    
    // Core Required Fields Verification Guard
    if (!form.email || !form.firstName || !form.lastName || !form.address || !form.phone || !form.city) {
      triggerToast("Please populate all required delivery details", "error");
      return;
    }

    // Dynamic Payment Choice Context Verification Check
    if (form.paymentMethod === "bkash" && !form.transactionId.trim()) {
      triggerToast("Please provide the bKash Transaction ID to verify your payment", "error");
      return;
    }

    setIsSubmitting(true);

    try {
      const orderPayload = {
        userId: isLoggedIn ? userId : null,
        items: cartItems.map((item) => ({
          productId: item._id,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
          category: item.category,
        })),
        shippingAddress: {
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: form.phone,
          address: form.address,
          apartment: form.apartment,
          city: form.city,
          postalCode: form.postalCode,
          country: form.country,
        },
        payment: {
          method: form.paymentMethod,
          transactionId: form.paymentMethod === "bkash" ? form.transactionId.trim() : null,
        },
        totals: {
          subtotal,
          shippingCosts,
          appliedDiscount,
          grandTotal,
        },
      };

      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderPayload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Native collection write sequence returned an execution fault.");
      }

      // Handle custom hash or use the native MongoDB object tracking ID string
      setOrderId(data.orderId || data.databaseId);

      // Clean up cart context values
      if (isLoggedIn && userId) {
        await fetch("/api/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId, items: [] }),
        });
      } else {
        localStorage.removeItem("guestCart");
      }

      setCartItems([]);
      setOrderCompleted(true);
      triggerToast("✨ Order successfully processed into ledger context!", "success");

    } catch (err) {
      console.error("Native MongoDB pipeline integration exception:", err);
      triggerToast(err.message || "A native collection channel link error occurred.", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render Post-Order Success Screen Setup Architecture
  if (orderCompleted) {
    return (
      <div className="bg-[#FBFBFB] min-h-screen w-full flex flex-col justify-between text-[#0D1B2A]">
        <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
          <Navbar textColor="text-[#0D1B2A]" />
        </header>
        
        <main className="pt-48 pb-24 flex-grow flex items-center justify-center px-6">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white border border-gray-100 rounded-[32px] p-8 md:p-12 shadow-xl max-w-xl w-full text-center"
          >
            <div className="w-20 h-20 bg-green-50 text-green-600 rounded-full flex items-center justify-center text-3xl mx-auto mb-6 shadow-inner border border-green-100">
              ✓
            </div>
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight mb-3">Thank you for your order!</h1>
            <p className="text-gray-400 text-sm mb-2">Your acquisition invoice has been indexed into system records.</p>
            <p className="text-xs bg-[#F7F7F7] inline-block font-mono font-bold text-gray-500 px-4 py-2 rounded-xl border border-black/5 mb-8">
              Order Reference: #{orderId}
            </p>
            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/profile")}
                className="bg-[#0D1B2A] hover:bg-[#E58A44] text-white font-bold text-sm px-8 py-4 rounded-full shadow-md transition-all duration-300 flex-1 cursor-pointer"
              >
                View Order History
              </button>
              <button
                onClick={() => router.push("/shop")}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm px-8 py-4 rounded-full transition-all duration-300 flex-1 cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </motion.div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A]">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="pt-40 pb-24 bg-[#FBFBFB] min-h-screen w-full text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {isLoading ? (
            <div className="text-center py-32 font-medium text-gray-400 animate-pulse">
              Staging payment gateway integration matrices...
            </div>
          ) : cartItems.length === 0 ? (
            <div className="text-center py-32 max-w-md mx-auto">
              <h2 className="text-xl font-bold mb-4">No Checkout Active</h2>
              <button onClick={() => router.push("/shop")} className="bg-[#0D1B2A] text-white font-bold text-sm px-6 py-3 rounded-full cursor-pointer">
                Return to Shop Catalog
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              
              {/* LEFT COLUMN: CONTACT, SHIPPING AND LOCALIZED PAYMENT METHOD */}
              <form onSubmit={handleOrderSubmission} className="lg:col-span-7 xl:col-span-8 flex flex-col gap-10">
                
                {/* SECTION 1: Contact Information */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0D1B2A] text-white text-xs flex items-center justify-center font-mono">1</span>
                    Contact Information
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Email Address *</label>
                      <input
                        type="email"
                        name="email"
                        required
                        value={form.email}
                        onChange={handleInputChange}
                        placeholder="name@domain.com"
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        required
                        value={form.phone}
                        onChange={handleInputChange}
                        placeholder="01XXXXXXXXX"
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                  </div>
                </div>

                {/* SECTION 2: Shipping Destination Information */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#0D1B2A] text-white text-xs flex items-center justify-center font-mono">2</span>
                    Shipping Destination Address
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">First Name *</label>
                      <input
                        type="text"
                        name="firstName"
                        required
                        value={form.firstName}
                        onChange={handleInputChange}
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Last Name *</label>
                      <input
                        type="text"
                        name="lastName"
                        required
                        value={form.lastName}
                        onChange={handleInputChange}
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors"
                      />
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Street Address *</label>
                    <input
                      type="text"
                      name="address"
                      required
                      value={form.address}
                      onChange={handleInputChange}
                      placeholder="House No, Road No, Area Block"
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                    />
                  </div>

                  <div className="flex flex-col gap-1.5 mb-4">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Apartment, Floor, Unit, etc. (Optional)</label>
                    <input
                      type="text"
                      name="apartment"
                      value={form.apartment}
                      onChange={handleInputChange}
                      placeholder="Flat 5B, 4th Floor"
                      className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City / District *</label>
                      <input
                        type="text"
                        name="city"
                        required
                        value={form.city}
                        onChange={handleInputChange}
                        placeholder="e.g. Dhaka"
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Postal / ZIP Code *</label>
                      <input
                        type="text"
                        name="postalCode"
                        required
                        value={form.postalCode}
                        onChange={handleInputChange}
                        placeholder="1212"
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300"
                      />
                    </div>
                    <div className="flex flex-col gap-1.5">
                      <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country *</label>
                      <select
                        name="country"
                        value={form.country}
                        onChange={handleInputChange}
                        className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-300 transition-colors text-gray-700 font-medium"
                      >
                        <option value="Bangladesh">Bangladesh</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* SECTION 3: Localized Payment Architecture Framework */}
                <div className="bg-white rounded-3xl border border-gray-100 p-6 md:p-8 shadow-sm">
                  <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                    <h2 className="text-lg font-bold flex items-center gap-2">
                      <span className="w-6 h-6 rounded-full bg-[#0D1B2A] text-white text-xs flex items-center justify-center font-mono">3</span>
                      Select Payment Methodology
                    </h2>
                    <span className="text-[10px] text-gray-400 font-mono tracking-wider flex items-center gap-1 bg-[#FBFBFB] border border-black/5 px-2.5 py-1 rounded-lg">
                      🔒 SECURE INTEGRITY
                    </span>
                  </div>

                  {/* Payment Methods Selection Box Array */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                    <label 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        form.paymentMethod === "cod" 
                          ? "border-[#E58A44] bg-orange-50/20" 
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="cod"
                          checked={form.paymentMethod === "cod"}
                          onChange={handleInputChange}
                          className="accent-[#E58A44]"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#0D1B2A]">Cash on Delivery</span>
                          <span className="text-[10px] text-gray-400">Pay cash upon item hand-over</span>
                        </div>
                      </div>
                      <span className="text-lg">📦</span>
                    </label>

                    <label 
                      className={`flex items-center justify-between p-4 rounded-xl border transition-all cursor-pointer ${
                        form.paymentMethod === "bkash" 
                          ? "border-[#E58A44] bg-orange-50/20" 
                          : "border-gray-100 hover:border-gray-200"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <input 
                          type="radio" 
                          name="paymentMethod" 
                          value="bkash"
                          checked={form.paymentMethod === "bkash"}
                          onChange={handleInputChange}
                          className="accent-[#E58A44]"
                        />
                        <div className="flex flex-col">
                          <span className="text-sm font-bold text-[#0D1B2A]">bKash Payment</span>
                          <span className="text-[10px] text-gray-400">Manual verification loop</span>
                        </div>
                      </div>
                      <span className="text-xs font-bold bg-[#E2136E] text-white px-2 py-0.5 rounded-md font-sans">bKash</span>
                    </label>
                  </div>

                  {/* Conditional Rendering: Custom Transaction input for bKash fields configuration */}
                  <AnimatePresence>
                    {form.paymentMethod === "bkash" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        className="overflow-hidden bg-[#FBFBFB] border border-dashed border-gray-200 rounded-2xl p-4 md:p-5 flex flex-col gap-4"
                      >
                        <div className="text-xs text-gray-600 leading-relaxed">
                          📌 Please complete your payment or process the structural delivery charges to our official bKash Send-Money address vector: 
                          <div className="mt-1.5 font-mono text-sm font-extrabold text-[#E2136E] bg-white border border-black/5 px-3 py-1.5 inline-block rounded-xl">
                            📱 01786910873
                          </div>
                        </div>

                        <div className="flex flex-col gap-1.5">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">bKash Transaction ID (TxnID) *</label>
                          <input
                            type="text"
                            name="transactionId"
                            required
                            value={form.transactionId}
                            onChange={handleInputChange}
                            placeholder="e.g. BAX7N8K90P"
                            className="w-full bg-white border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors placeholder:text-gray-300 font-mono font-bold uppercase tracking-widest text-[#0D1B2A]"
                          />
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </form>

              {/* RIGHT COLUMN: STICKY ORDER BREAKDOWN & PROMO CODE SUB-SYSTEM */}
              <div className="lg:col-span-5 xl:col-span-4 lg:sticky lg:top-36 flex flex-col gap-6">
                
                {/* Line Items View Summary Module */}
                <div className="bg-white border border-gray-100 rounded-[28px] p-6 shadow-sm max-h-[310px] overflow-y-auto scrollbar-none">
                  <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400 mb-4 border-b border-gray-50 pb-2">
                    Review Artifact Selection ({cartItems.reduce((acc, i) => acc + i.quantity, 0)})
                  </h3>
                  <div className="flex flex-col gap-4">
                    {cartItems.map((item) => (
                      <div key={item._id} className="flex gap-4 items-center">
                        <div className="w-14 h-14 bg-[#FAFAFA] rounded-xl border border-gray-100 p-1 flex-shrink-0 relative">
                          <Image src={item.image} alt={item.name} fill className="object-contain p-1" sizes="56px" />
                          <span className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-[#0D1B2A] text-white text-[10px] font-bold flex items-center justify-center shadow-md">
                            {item.quantity}
                          </span>
                        </div>
                        <div className="min-w-0 flex-grow">
                          <h4 className="font-bold text-xs truncate text-[#0D1B2A]">{item.name}</h4>
                          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">{item.category}</span>
                        </div>
                        <span className="font-bold text-xs text-[#0D1B2A] flex-shrink-0">৳{(item.price * item.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Integrated Voucher / Coupon Interaction Module */}
                <div className="bg-white border border-gray-100 rounded-[28px] p-5 shadow-sm">
                  <form onSubmit={handleApplyPromo} className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Promotional Code"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      className="flex-grow bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider focus:outline-none focus:border-gray-200 text-[#0D1B2A]"
                    />
                    <button
                      type="submit"
                      className="bg-gray-50 hover:bg-[#0D1B2A] text-gray-600 hover:text-white border border-gray-100 text-[10px] font-bold px-4 py-2.5 rounded-xl uppercase tracking-wider transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  </form>
                  <p className="text-[10px] text-gray-400 mt-2 pl-1 font-medium">Try <span className="font-bold text-[#E58A44]">LUXURY10</span> for 10% off (Min. subtotal ৳1,000).</p>
                </div>

                {/* Transaction Ledger Pricing Details Accumulator Card */}
                <div className="bg-white border border-gray-100 rounded-[28px] p-6 sm:p-8 shadow-sm">
                  <h2 className="text-base font-bold border-b border-gray-100 pb-4 mb-4">Summary Totals</h2>
                  <div className="flex flex-col gap-3 text-xs font-semibold text-gray-500 mb-5 border-b border-gray-100 pb-5">
                    <div className="flex justify-between items-center">
                      <span>Subtotal</span>
                      <span className="text-[#0D1B2A] font-bold">৳{subtotal.toFixed(2)}</span>
                    </div>
                    {appliedDiscount > 0 && (
                      <div className="flex justify-between items-center text-green-600">
                        <span>Voucher Discount</span>
                        <span>-৳{appliedDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center">
                      <span>Freight & Delivery Charge</span>
                      <span className="text-[#0D1B2A] font-bold">৳{shippingCosts.toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="flex justify-between items-baseline mb-6">
                    <span className="font-extrabold text-sm uppercase tracking-wider">Grand Total</span>
                    <div className="text-2xl font-extrabold text-[#0D1B2A] tracking-tight">
                      <span className="text-xs font-bold mr-0.5">৳</span>
                      {grandTotal.toFixed(2)}
                    </div>
                  </div>

                  <button
                    onClick={handleOrderSubmission}
                    disabled={isSubmitting}
                    className="w-full bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-xs font-bold py-4 rounded-2xl shadow-md transition-all duration-200 uppercase tracking-wider flex items-center justify-center gap-2 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                  >
                    {isSubmitting ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                        </svg>
                        Verifying Ledger Record...
                      </span>
                    ) : (
                      `Complete Secure Order (৳${grandTotal.toFixed(2)})`
                    )}
                  </button>
                </div>

              </div>

            </div>
          )}
        </div>
      </main>

      <Footer />

      {/* LUXURY SLIDEOUT INLINE TOAST SYSTEM */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs uppercase font-bold tracking-wider shadow-xl backdrop-blur-md select-none ${
              toast.type === "error"
                ? "bg-red-50 border-red-200 text-red-800"
                : "bg-[#0D1B2A] border-gray-800 text-white"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}