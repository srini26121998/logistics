"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PlaneTakeoff, Box, Search, PackageCheck, AlertCircle, CheckCircle2, QrCode } from "lucide-react";
import StatusBadge from "@/components/ui/StatusBadge";
import { SHIPMENTS } from "@/data/mockData";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function OutboundProcessingPage() {
  const router = useRouter();
  const [scannedAwb, setScannedAwb] = useState("");
  const [scannedList, setScannedList] = useState<typeof SHIPMENTS>([]);
  const [error, setError] = useState("");

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    if (!scannedAwb.trim()) return;

    const shipment = SHIPMENTS.find(s => s.awb.includes(scannedAwb) || s.lrNumber.includes(scannedAwb));
    
    if (!shipment) {
      setError("AWB/LR not found in system. Please verify.");
      setScannedAwb("");
      return;
    }

    if (scannedList.find(s => s.id === shipment.id)) {
      setError("Shipment already scanned.");
      setScannedAwb("");
      return;
    }

    setError("");
    setScannedList(prev => [shipment, ...prev]);
    setScannedAwb("");
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <PlaneTakeoff className="w-6 h-6 text-indigo-500" />
          Outbound Buildup
        </h1>
        <p className="text-sm text-slate-600 mt-1">Scan cargo and assign to ULDs/Flights for departure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Scanning Widget */}
        <div className="lg:col-span-1 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4 flex items-center gap-2">
              <QrCode className="w-5 h-5 text-indigo-400" /> Scanner Input
            </h2>
            <form onSubmit={handleScan} className="space-y-4">
              <div>
                <label className="text-xs text-slate-600 mb-1 block">Scan AWB/LR Barcode</label>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                  <input
                    type="text"
                    autoFocus
                    value={scannedAwb}
                    onChange={(e) => setScannedAwb(e.target.value)}
                    placeholder="e.g. 312-66761752"
                    className="w-full bg-slate-50 border border-blue-200 rounded-xl pl-9 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 font-mono text-sm"
                  />
                </div>
                {error && (
                  <p className="text-xs text-rose-400 mt-2 flex items-center gap-1">
                    <AlertCircle className="w-3 h-3" /> {error}
                  </p>
                )}
              </div>
              <button 
                type="submit"
                className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center justify-center gap-2"
              >
                Scan Cargo
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-slate-900 mb-4">Build Status</h2>
            <div className="space-y-4">
              <div className="bg-white p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                <span className="text-sm text-slate-600">Scanned Items</span>
                <span className="text-xl font-bold text-slate-900">{scannedList.length}</span>
              </div>
              <div className="bg-white p-4 rounded-xl border border-blue-200 flex justify-between items-center">
                <span className="text-sm text-slate-600">Total Weight</span>
                <span className="text-xl font-bold text-indigo-400">
                  {scannedList.reduce((acc, s) => acc + parseFloat(s.weight), 0)} kg
                </span>
              </div>
            </div>

            <button 
              onClick={() => {
                toast.success(`Successfully finalized buildup with ${scannedList.length} items.`);
                router.push("/ops/manifests");
              }}
              disabled={scannedList.length === 0}
              className="w-full mt-6 py-3 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-medium transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center justify-center gap-2"
            >
              <PackageCheck className="w-5 h-5" /> Finalize Buildup
            </button>
          </motion.div>
        </div>

        {/* Scanned List */}
        <div className="lg:col-span-2">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl h-[calc(100vh-140px)] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-blue-200 bg-white">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Box className="w-5 h-5 text-indigo-400" /> Scanned Cargo Feed
              </h2>
            </div>
            
            <div className="flex-1 overflow-auto p-4 custom-scrollbar bg-slate-50/30">
              <div className="space-y-3">
                <AnimatePresence>
                  {scannedList.length === 0 && (
                    <motion.div 
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="text-center py-20 text-slate-500"
                    >
                      <QrCode className="w-16 h-16 mx-auto mb-4 opacity-20" />
                      <p className="text-base font-medium">Ready to scan</p>
                      <p className="text-sm mt-1">Scan barcodes to add items to the manifest.</p>
                    </motion.div>
                  )}
                  {scannedList.map((item, idx) => (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, x: -20, scale: 0.95 }}
                      animate={{ opacity: 1, x: 0, scale: 1 }}
                      transition={{ duration: 0.2 }}
                      className="bg-white border border-blue-200 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
                          <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                        </div>
                        <div>
                          <div className="font-mono font-bold text-slate-900 text-base">{item.awb}</div>
                          <div className="text-xs text-slate-600 mt-0.5">
                            {item.origin} → {item.destination} • {item.carrier}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-semibold text-slate-900">{item.pieces} NOP</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">{item.weight}</div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
