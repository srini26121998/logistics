"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Search, MapPin, Package, ArrowRight, Activity, Plane, Box } from "lucide-react";
import { useRouter } from "next/navigation";

export default function TrackCargo() {
  const [trackingNumber, setTrackingNumber] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackingNumber.trim()) return;

    setIsSearching(true);
    // Simulate network delay for UI effect
    setTimeout(() => {
      router.push(`/track/${trackingNumber.trim()}`);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col relative overflow-hidden font-sans">
      
      {/* Background decoration */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

      <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-100 rounded-2xl mb-6 text-indigo-600 shadow-sm">
            <MapPin className="w-8 h-8" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">
            Track Your Cargo
          </h1>
          <p className="text-lg text-slate-600 max-w-2xl mx-auto">
            Enter your Air Waybill (AWB) or Container number to get real-time status updates and location for your shipment.
          </p>
        </motion.div>

        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="w-full max-w-2xl bg-white rounded-3xl shadow-xl shadow-slate-200/50 p-2 border border-slate-100 relative z-10"
        >
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="pl-6 pr-4 text-slate-400">
              <Search className="w-6 h-6" />
            </div>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g., AWB-892345 or 123-45678901"
              className="flex-1 bg-transparent border-none py-5 text-lg text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-0"
              required
            />
            <button
              type="submit"
              disabled={isSearching || !trackingNumber.trim()}
              className="bg-indigo-600 hover:bg-indigo-700 text-white px-8 py-4 rounded-2xl font-bold transition-all disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2 m-1 shadow-md shadow-indigo-200"
            >
              {isSearching ? (
                <Activity className="w-5 h-5 animate-pulse" />
              ) : (
                <>
                  Track <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mt-16 w-full max-w-4xl grid grid-cols-1 md:grid-cols-3 gap-6"
        >
          {/* Feature 1 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-4">
              <Activity className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Real-Time Updates</h3>
            <p className="text-slate-500 text-sm">
              Get instant notifications and live tracking data directly from carriers.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center mb-4">
              <Plane className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Multi-Modal Tracking</h3>
            <p className="text-slate-500 text-sm">
              Track air freight, ocean freight, and road transport in one place.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <Box className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 mb-2">Proof of Delivery</h3>
            <p className="text-slate-500 text-sm">
              Access digital PODs and complete shipment documentation securely.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
