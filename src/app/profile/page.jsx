"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "../components/navbar/Navbar";
import Footer from "../components/footer/Footer";

export default function ProfilePage() {
  // Pulling 'update' from useSession to hot-reload navbar layout details dynamically
  const { data: session, status, update } = useSession();
  const router = useRouter();

  // Navigation Panel Tab State
  const [activeTab, setActiveTab] = useState("profile"); 
  const [isLoadingPayload, setIsLoadingPayload] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  
  // Account State Schema aligned to your NextAuth database footprints
  const [profile, setProfile] = useState({
    name: "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "Bangladesh",
  });
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const triggerToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3500);
  };

  // Enforce NextAuth Gatekeeping
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (status === "authenticated") {
      fetchUserDatabaseData();
    }
  }, [status, router]);

  const fetchUserDatabaseData = async () => {
    try {
      setIsLoadingPayload(true);
      
      const [profileRes, ordersRes] = await Promise.all([
        fetch("/api/profile"),
        fetch("/api/orders")
      ]);

      if (profileRes.ok) {
        const profileData = await profileRes.json();
        setProfile((prev) => ({ ...prev, ...profileData }));
      }
      if (ordersRes.ok) {
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      }
    } catch (err) {
      triggerToast("Error linking to MongoDB sync node.", "error");
    } finally {
      setIsLoadingPayload(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setIsUpdating(true);
    const response = await fetch("/api/profile", {
  method: "PUT",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(profile),
});

if (response.ok) {
  // 1. Tell NextAuth to update its current file's token session context
  await update({ name: profile.name, image: profile.image });
  
  // 2. 🔥 THE MAGIC PUNCH: Broadcast a global window event to update the Navbar instantly!
  window.dispatchEvent(new Event("panto-profile-updated"));
}

    try {
      const response = await fetch("/api/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });

      if (response.ok) {
        // 🔥 CRITICAL: Updates the client-side NextAuth session cookie on the fly.
        // This forces your Navbar component to instantly show the new name!
        await update({ name: profile.name });
        
        triggerToast("✨ Profile updated and session synchronized!", "success");
      } else {
        throw new Error("Mutation rejected");
      }
    } catch (err) {
      triggerToast("Write pipeline failed.", "error");
    } finally {
      setIsUpdating(false);
    }
  };

  if (status === "loading" || (status === "authenticated" && isLoadingPayload)) {
    return (
      <div className="bg-[#FBFBFB] min-h-screen w-full flex items-center justify-center text-gray-400 font-medium animate-pulse">
        Establishing secure session handshake with MongoDB...
      </div>
    );
  }

  return (
    <>
      {/* Navbar receives black text parameters to pop on the light profile background */}
      <header className="fixed top-0 left-0 right-0 z-50 text-[#0D1B2A] bg-white border-b border-gray-100">
        <Navbar textColor="text-[#0D1B2A]" />
      </header>

      <main className="pt-40 pb-24 bg-[#FBFBFB] min-h-screen w-full text-[#0D1B2A]">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          
          {/* Environment Banner */}
          <div className="mb-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              {session?.user?.image ? (
                <img 
                  src={session.user.image} 
                  alt="Profile Avatar" 
                  className="w-14 h-14 rounded-full border border-gray-200 object-cover shadow-sm"
                />
              ) : (
                <div className="w-14 h-14 rounded-full bg-orange-500 text-white flex items-center justify-center font-bold text-lg shadow-sm">
                  {session?.user?.name ? session.user.name.charAt(0).toUpperCase() : "U"}
                </div>
              )}
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight">Account Settings</h1>
                <p className="text-xs text-gray-400 mt-1 uppercase tracking-wider font-mono">Node ID: {session?.user?.email}</p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* Left Nav Tabs */}
            <div className="lg:col-span-3 flex flex-row lg:flex-col gap-2 bg-white border border-gray-100 p-2.5 rounded-2xl md:rounded-3xl shadow-sm w-full">
              <button
                onClick={() => setActiveTab("profile")}
                className={`flex-1 text-left px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "profile" 
                    ? "bg-[#0D1B2A] text-white shadow-md" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#0D1B2A]"
                }`}
              >
                👤 Profile Settings
              </button>
              <button
                onClick={() => setActiveTab("orders")}
                className={`flex-1 text-left px-5 py-3.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer ${
                  activeTab === "orders" 
                    ? "bg-[#0D1B2A] text-white shadow-md" 
                    : "text-gray-400 hover:bg-gray-50 hover:text-[#0D1B2A]"
                }`}
              >
                📦 Order History ({orders.length})
              </button>
            </div>

            {/* Right Display Area */}
            <div className="lg:col-span-9 w-full">
              <AnimatePresence mode="wait">
                
                {/* Profile Form View */}
                {activeTab === "profile" && (
                  <motion.div
                    key="profile-panel"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="bg-white border border-gray-100 rounded-3xl p-6 md:p-8 shadow-sm"
                  >
                    <h2 className="text-base font-bold border-b border-gray-100 pb-4 mb-6">
                      Personal Details
                    </h2>

                    <form onSubmit={handleProfileUpdate} className="flex flex-col gap-6">
                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Full Display Name</label>
                        <input
                          type="text"
                          name="name"
                          value={profile.name || ""}
                          onChange={handleInputChange}
                          className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors font-medium"
                        />
                      </div>

                      <div className="flex flex-col gap-1.5">
                        <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Phone Number</label>
                        <input
                          type="text"
                          name="phone"
                          value={profile.phone || ""}
                          onChange={handleInputChange}
                          className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors font-medium"
                        />
                      </div>

                      <div className="border-t border-gray-50 pt-4 mt-2">
                        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Shipping Coordinates</h3>
                        
                        <div className="flex flex-col gap-1.5 mb-4">
                          <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Street Address</label>
                          <input
                            type="text"
                            name="address"
                            value={profile.address || ""}
                            onChange={handleInputChange}
                            className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors font-medium"
                          />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">City</label>
                            <input
                              type="text"
                              name="city"
                              value={profile.city || ""}
                              onChange={handleInputChange}
                              className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors font-medium"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Postal Code</label>
                            <input
                              type="text"
                              name="postalCode"
                              value={profile.postalCode || ""}
                              onChange={handleInputChange}
                              className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gray-300 transition-colors font-bold font-mono"
                            />
                          </div>
                          <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Country</label>
                            <select
                              name="country"
                              value={profile.country || "Bangladesh"}
                              onChange={handleInputChange}
                              className="w-full bg-[#F7F7F7] border border-black/5 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:border-gray-300 transition-colors font-medium text-gray-700"
                            >
                              <option value="Bangladesh">Bangladesh</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      <button
                        type="submit"
                        disabled={isUpdating}
                        className="self-end mt-4 bg-[#0D1B2A] hover:bg-[#E58A44] text-white text-xs font-bold px-8 py-4 rounded-xl shadow-sm uppercase tracking-wider transition-all duration-200 disabled:bg-gray-400 disabled:cursor-not-allowed cursor-pointer"
                      >
                        {isUpdating ? "Saving changes..." : "Save Configuration"}
                      </button>
                    </form>
                  </motion.div>
                )}

                {/* Orders View */}
                {activeTab === "orders" && (
                  <motion.div
                    key="orders-panel"
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.25 }}
                    className="flex flex-col gap-6"
                  >
                    {orders.length === 0 ? (
                      <div className="bg-white border border-gray-100 rounded-3xl p-12 text-center text-gray-400 font-medium">
                        📜 No previous orders registered under this profile node.
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div key={order._id} className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm flex flex-col gap-4">
                          
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-50 pb-4">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="font-mono text-xs font-extrabold bg-[#F7F7F7] border border-black/5 px-3 py-1.5 rounded-xl text-gray-700">
                                #{order._id.substring(0, 8).toUpperCase()}
                              </span>
                              <span className="text-xs font-medium text-gray-400">
                                {new Date(order.createdAt).toLocaleDateString("en-US", {
                                  month: "long", day: "numeric", year: "numeric"
                                })}
                              </span>
                            </div>

                            <span className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1.5 rounded-xl border self-start sm:self-auto ${
                              order.status === "Delivered"
                                ? "bg-green-50 text-green-700 border-green-200"
                                : "bg-orange-50 text-orange-500 border-orange-200"
                            }`}>
                              ● {order.status || "Processing"}
                            </span>
                          </div>

                          <div className="flex flex-col gap-2.5 my-1">
                            {order.items?.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center text-xs">
                                <div className="text-gray-500 font-semibold">
                                  {item.name} <span className="text-gray-300 font-normal ml-1">x{item.quantity}</span>
                                </div>
                                <span className="font-bold text-[#0D1B2A]">৳{item.price?.toFixed(2)}</span>
                              </div>
                            ))}
                          </div>

                          <div className="border-t border-gray-50 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                            <div className="text-gray-400 font-medium">
                              Payment Strategy: <span className="text-gray-600 font-bold font-mono text-[11px]">{order.paymentMethod}</span>
                            </div>
                            <div className="font-extrabold text-sm text-[#0D1B2A]">
                              Total Settled: <span className="text-base text-orange-500 ml-1">৳{order.total?.toFixed(2)}</span>
                            </div>
                          </div>

                        </div>
                      ))
                    )}
                  </motion.div>
                )}

              </AnimatePresence>
            </div>

          </div>
        </div>
      </main>

      <Footer />

      {/* Floating System Toast */}
      <AnimatePresence>
        {toast.show && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 350, damping: 28 }}
            className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl border text-xs uppercase font-bold tracking-wider shadow-xl backdrop-blur-md select-none ${
              toast.type === "error" ? "bg-red-50 border-red-200 text-red-800" : "bg-[#0D1B2A] border-gray-800 text-white"
            }`}
          >
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}