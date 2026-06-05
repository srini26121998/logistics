"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ScanLine,
  Search,
  Package,
  AlertTriangle,
  CheckCircle2,
  ShieldCheck,
  Plane,
  FileText,
  User,
  Clock,
  ArrowRight,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

import { toast } from "sonner";
import { SHIPMENTS, Shipment } from "@/data/mockData";

// Mock database for demo is replaced by SHIPMENTS from mockData



const FLIGHTS = [
  { id: "6E-1234", name: "Indigo 6E-1234", time: "18:00 (Today)" },
  { id: "AI-882", name: "Air India AI-882", time: "20:30 (Today)" },
  { id: "UK-901", name: "Vistara UK-901", time: "06:15 (Tomorrow)" }
];

export default function InboundOperations() {
  const [scanInput, setScanInput] = useState("");
  const [isScanning, setIsScanning] = useState(false);
  const [booking, setBooking] = useState<any>(null);
  
  // Workflow States
  const [actualPieces, setActualPieces] = useState<number | "">("");
  const [isReceived, setIsReceived] = useState(false);
  const [isXrayCleared, setIsXrayCleared] = useState(false);
  const [selectedFlight, setSelectedFlight] = useState("");
  const [error, setError] = useState("");

  const handleScan = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!scanInput.trim()) return;

    setIsScanning(true);
    // Simulate network delay
    setTimeout(() => {
      const inputLR = scanInput.trim().toUpperCase();
      const found = SHIPMENTS.find(s => s.lrNumber === inputLR);
      if (found) {
        // Derive SHC from commodity for demo
        const shc = ['Pharmaceuticals', 'Perishables'].includes(found.commodity) ? 'COL' : 'GEN';
        
        setBooking({
          ...found,
          expectedPieces: found.pieces,
          shc
        });
        setActualPieces("");
        setIsReceived(false);
        setIsXrayCleared(false);
        setSelectedFlight("");
        toast.success(`Booking found: ${found.lrNumber}`);
      } else {
        setError("Booking not found for this LR number.");
        setBooking(null);
        toast.error("Booking not found");
      }
      setIsScanning(false);
    }, 600);
  };

  const isPieceMatch = actualPieces !== "" && Number(actualPieces) === booking?.expectedPieces;
  const isDiscrepancy = actualPieces !== "" && Number(actualPieces) !== booking?.expectedPieces;

  useEffect(() => {
    if (actualPieces !== "") {
      if (Number(actualPieces) === booking?.expectedPieces) {
        toast.success("Piece count verified and matches booking.");
      } else {
        toast.warning("Piece count discrepancy flagged.");
      }
    }
  }, [actualPieces, booking?.expectedPieces]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-indigo-500/30 pt-8 pb-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
            <ScanLine className="w-8 h-8 text-indigo-500" />
            Inbound Cargo Processing
          </h1>
          <p className="text-slate-400 mt-2 flex items-center gap-2">
            <User className="w-4 h-4" /> Staff ID: EMP-492 • DEL Hub
          </p>
        </motion.div>

        <div className="space-y-6">
          {/* Step 1: Scanner */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 relative overflow-hidden"
          >
            <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500"></div>
            <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Search className="w-5 h-5 text-indigo-400" />
              Scan Booking (LR Number)
            </h2>
            <form onSubmit={handleScan} className="flex gap-4">
              <div className="relative flex-1">
                <ScanLine className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
                <input
                  type="text"
                  value={scanInput}
                  onChange={(e) => setScanInput(e.target.value.toUpperCase())}
                  placeholder="e.g. LR-892345"
                  className="w-full bg-[#121622] border border-slate-700 rounded-xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all uppercase placeholder:normal-case"
                />
              </div>
              <button
                type="submit"
                disabled={isScanning || !scanInput.trim()}
                className="bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:hover:bg-indigo-600 text-white px-6 py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2"
              >
                {isScanning ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  "Find Booking"
                )}
              </button>
            </form>
            {error && (
              <p className="text-red-400 text-sm mt-3 flex items-center gap-1">
                <AlertTriangle className="w-4 h-4" /> {error}
              </p>
            )}
            <div className="mt-4 flex gap-2">
               <button onClick={() => setScanInput(SHIPMENTS[0]?.lrNumber || "LR-892345")} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition-colors">Use {SHIPMENTS[0]?.lrNumber || "LR-892345"} (Gen)</button>
               <button onClick={() => setScanInput(SHIPMENTS[1]?.lrNumber || "LR-100293")} className="text-xs bg-slate-800 hover:bg-slate-700 px-3 py-1.5 rounded-lg text-slate-300 transition-colors">Use {SHIPMENTS[1]?.lrNumber || "LR-100293"} (Pharma)</button>
            </div>
          </motion.div>

          {/* Workflow Steps - Only visible when booking is found */}
          <AnimatePresence>
            {booking && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="space-y-6"
              >
                {/* Step 2: Booking Details */}
                <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6">
                    <div>
                      <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        Booking: {booking.lrNumber}
                      </h2>
                      <p className="text-sm text-slate-400">{booking.shipper} → {booking.consignee}</p>
                    </div>
                    <div className="mt-2 sm:mt-0 px-3 py-1 bg-slate-800/80 border border-slate-700 rounded-lg text-sm text-slate-300 font-mono">
                      SHC: <span className={booking.shc === 'GEN' ? 'text-green-400' : 'text-blue-400'}>{booking.shc}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                     <div className="bg-[#121622] p-4 rounded-xl border border-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">Route</div>
                        <div className="font-semibold text-white">{booking.origin} → {booking.destination}</div>
                     </div>
                     <div className="bg-[#121622] p-4 rounded-xl border border-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">Expected Pieces</div>
                        <div className="font-semibold text-white text-lg">{booking.expectedPieces}</div>
                     </div>
                     <div className="bg-[#121622] p-4 rounded-xl border border-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">Total Weight</div>
                        <div className="font-semibold text-white">{booking.weight}</div>
                     </div>
                     <div className="bg-[#121622] p-4 rounded-xl border border-slate-800/50">
                        <div className="text-xs text-slate-500 mb-1">Commodity</div>
                        <div className="font-semibold text-white">{booking.commodity}</div>
                     </div>
                  </div>
                </div>

                {/* Step 3: Processing Actions */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  
                  {/* Left Column: Verification & X-Ray */}
                  <div className="space-y-6">
                    {/* Piece Count */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
                      <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                        <Package className="w-4 h-4" /> 1. Piece Count Verification
                      </h3>
                      <div className="flex gap-3 items-center">
                        <input
                          type="number"
                          value={actualPieces}
                          onChange={(e) => setActualPieces(e.target.value === "" ? "" : Number(e.target.value))}
                          placeholder="Actual Pieces"
                          className="w-32 bg-[#121622] border border-slate-700 rounded-xl py-2 px-4 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <div className="text-sm">/ {booking.expectedPieces} expected</div>
                      </div>
                      
                      {actualPieces !== "" && (
                        <div className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-sm ${isPieceMatch ? 'bg-green-500/10 border-green-500/30 text-green-400' : 'bg-amber-500/10 border-amber-500/30 text-amber-400'}`}>
                          {isPieceMatch ? (
                            <><CheckCircle2 className="w-4 h-4" /> Count Matches Booking</>
                          ) : (
                            <><AlertTriangle className="w-4 h-4" /> Discrepancy Flagged</>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Receive & X-Ray */}
                    <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 space-y-4">
                      <div>
                        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                          <Clock className="w-4 h-4" /> 2. Inbound Reception
                        </h3>
                        <button
                          onClick={() => {
                            setIsReceived(true);
                            toast.success("Inbound received logged successfully");
                          }}
                          disabled={!actualPieces || isReceived}
                          className={`w-full py-3 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isReceived ? 'bg-green-500/20 text-green-400 border border-green-500/30' : 'bg-slate-800 hover:bg-slate-700 text-white disabled:opacity-50 border border-slate-700'}`}
                        >
                          {isReceived ? <><CheckCircle2 className="w-5 h-5" /> Inbound Received Logged</> : "Mark Inbound Received"}
                        </button>
                        {isReceived && (
                          <div className="text-xs text-slate-500 mt-2 text-center">
                            Logged at {new Date().toLocaleTimeString()} by EMP-492
                          </div>
                        )}
                      </div>

                      <div className="pt-4 border-t border-slate-800/50">
                        <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                          <ShieldCheck className="w-4 h-4" /> 3. Security Clearance
                        </h3>
                        <label className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-colors ${isXrayCleared ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-[#121622] border-slate-700/80 hover:border-slate-500'}`}
                          onClick={() => {
                            if (!isXrayCleared) {
                              setIsXrayCleared(true);
                              toast.success("Security and X-Ray clearance completed");
                            }
                          }}>
                          <div className="flex items-center gap-3">
                            <div className={`w-6 h-6 rounded-md flex items-center justify-center border ${isXrayCleared ? 'bg-indigo-500 border-indigo-500' : 'bg-slate-800 border-slate-600'}`}>
                              {isXrayCleared && <CheckCircle2 className="w-4 h-4 text-white" />}
                            </div>
                            <span className={isXrayCleared ? 'text-indigo-300 font-medium' : 'text-slate-300'}>X-Ray Cleared</span>
                          </div>
                          <span className="text-xs text-slate-500">{booking.shc} Validated</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Flight Assignment & AWB */}
                  <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6 flex flex-col">
                    <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                      <Plane className="w-4 h-4" /> 4. Flight Assignment
                    </h3>
                    
                    <div className="space-y-3 mb-8">
                      {FLIGHTS.map(flight => (
                        <label key={flight.id} className={`flex items-center p-4 rounded-xl border cursor-pointer transition-all ${selectedFlight === flight.id ? 'bg-indigo-500/20 border-indigo-500 shadow-[0_0_15px_rgba(79,70,229,0.15)]' : 'bg-[#121622] border-slate-700/80 hover:border-slate-500'}`}>
                          <input
                            type="radio"
                            name="flight"
                            value={flight.id}
                            checked={selectedFlight === flight.id}
                            onChange={(e) => {
                              setSelectedFlight(e.target.value);
                              toast.info(`Flight ${flight.name} assigned`);
                            }}
                            className="sr-only"
                          />
                          <div className="flex-1 flex justify-between items-center">
                            <div>
                              <div className="font-medium text-slate-200">{flight.name}</div>
                              <div className="text-xs text-slate-500">{flight.time}</div>
                            </div>
                            <div className={`w-4 h-4 rounded-full border-2 ${selectedFlight === flight.id ? 'border-indigo-400 bg-indigo-500' : 'border-slate-600'}`}></div>
                          </div>
                        </label>
                      ))}
                    </div>

                    <div className="mt-auto pt-6 border-t border-slate-800/50">
                      <h3 className="text-sm font-medium text-slate-400 mb-4 flex items-center gap-2">
                        <FileText className="w-4 h-4" /> 5. Documentation
                      </h3>
                      <Link 
                        href={`/ops/awb/new?lr=${booking.lrNumber}&origin=${booking.origin}&dest=${booking.destination}&wt=${parseFloat(booking.weight)}&com=${booking.shc}`}
                        className={`w-full py-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${isReceived && isXrayCleared && selectedFlight ? 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:shadow-[0_0_30px_rgba(79,70,229,0.6)]' : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700'}`}
                        onClick={(e) => {
                          if (!(isReceived && isXrayCleared && selectedFlight)) {
                            e.preventDefault();
                            toast.error("Please complete all steps before generating AWB");
                          } else {
                            toast.success("Proceeding to AWB Generation");
                          }
                        }}
                      >
                        Generate AWB <ArrowRight className="w-5 h-5" />
                      </Link>
                      <p className="text-xs text-center mt-3 text-slate-500">
                        Requires Receive, X-Ray, and Flight selection
                      </p>
                    </div>
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
