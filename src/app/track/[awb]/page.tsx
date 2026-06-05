"use client";

import React, { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  CheckCircle2,
  Clock,
  MapPin,
  Package,
  Plane,
  PlaneTakeoff,
  User,
  Calendar,
  Weight,
  FileText,
  ChevronDown,
  ChevronUp,
  Download,
  AlertCircle,
  ShieldCheck,
  Leaf,
  FileCheck,
  Box,
  Hash
} from "lucide-react";

import { useParams } from "next/navigation";

const STAGES = [
  "Booked",
  "LR Generated",
  "Picked Up",
  "Inbound Received",
  "X-Ray Cleared",
  "Manifested/Outbound",
  "Received at Destination",
  "Out for Delivery",
  "Delivered",
];

const AIRPORTS = [
  { code: "DEL", city: "New Delhi" },
  { code: "BOM", city: "Mumbai" },
  { code: "BLR", city: "Bengaluru" },
  { code: "MAA", city: "Chennai" },
  { code: "HYD", city: "Hyderabad" },
  { code: "CCU", city: "Kolkata" },
  { code: "JFK", city: "New York" },
  { code: "DXB", city: "Dubai" },
  { code: "LHR", city: "London" },
  { code: "SIN", city: "Singapore" }
];

const CARRIERS = [
  { name: "IndiGo Cargo", code: "6E" },
  { name: "Akasa Air", code: "QP" },
  { name: "Air India Cargo", code: "AI" },
  { name: "Vistara", code: "UK" },
  { name: "Emirates SkyCargo", code: "EK" },
  { name: "DHL Aviation", code: "D0" }
];

const AWBStatusBadge = ({ status }: { status: string }) => {
  const colors: Record<string, string> = {
    Booked: "bg-blue-500/10 text-blue-400 border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.15)]",
    InTransit: "bg-amber-500/10 text-amber-400 border-amber-500/20 shadow-[0_0_15px_rgba(245,158,11,0.15)]",
    Delivered: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 shadow-[0_0_15px_rgba(16,185,129,0.15)]",
    Failed: "bg-rose-500/10 text-rose-400 border-rose-500/20 shadow-[0_0_15px_rgba(244,63,94,0.15)]",
    Processing: "bg-indigo-500/10 text-indigo-400 border-indigo-500/20 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
  };
  const colorClass = colors[status] || colors.Booked;

  return (
    <span className={`px-3 py-1.5 text-xs font-semibold rounded-md border ${colorClass} uppercase tracking-wider flex items-center gap-2`}>
      <span className={`w-1.5 h-1.5 rounded-full ${status === 'InTransit' ? 'bg-amber-400 animate-pulse' : status === 'Delivered' ? 'bg-emerald-400' : 'bg-current'}`}></span>
      {status}
    </span>
  );
};

export default function TrackingPage() {
  const params = useParams();
  const [showAllEvents, setShowAllEvents] = useState(false);

  const rawAwb = params?.awb as string | undefined;
  const awb = rawAwb ? decodeURIComponent(rawAwb).toUpperCase() : 'UNKNOWN';

  // Generate dynamic data based on AWB hash
  const { mockData, scanEvents } = useMemo(() => {
    const hash = awb.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Determine Status & Stage
    const isDelivered = hash % 5 === 0;
    const isFailed = hash % 20 === 0;
    let currentStageIndex = isDelivered ? 8 : (hash % 8);
    if (isFailed) currentStageIndex = 3; // Stuck somewhere

    let status = "InTransit";
    if (isDelivered) status = "Delivered";
    else if (isFailed) status = "Failed";
    else if (currentStageIndex < 2) status = "Booked";
    else if (currentStageIndex < 4) status = "Processing";

    // Route
    const originIdx = hash % AIRPORTS.length;
    const destIdx = (hash + 3) % AIRPORTS.length; // Ensure different destination
    const origin = AIRPORTS[originIdx];
    const dest = AIRPORTS[destIdx];
    
    const carrier = CARRIERS[hash % CARRIERS.length];
    
    // Dates
    const now = new Date();
    const daysAgo = isDelivered ? (hash % 5) + 2 : (hash % 3);
    const bookedDate = new Date(now);
    bookedDate.setDate(now.getDate() - daysAgo);
    
    const etaDate = new Date(bookedDate);
    etaDate.setDate(bookedDate.getDate() + (hash % 4) + 2);
    
    const data = {
      awb,
      origin: origin.code,
      originCity: origin.city,
      destination: dest.code,
      destinationCity: dest.city,
      carrier: carrier.name,
      flightNo: `${carrier.code}-${1000 + (hash % 9000)}`,
      pieceCount: (hash % 50) + 1,
      weight: `${((hash % 2000) + 10).toFixed(1)}`,
      volumetricWeight: `${((hash % 2000) + 25).toFixed(1)} kg`,
      estimatedDelivery: etaDate.toLocaleString('en-US', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
      consignee: `Client ${hash % 1000} Log***`,
      status,
      currentStageIndex,
      serviceLevel: ["Priority Express", "Standard Air", "Deferred Cargo", "Next Flight Out"][hash % 4],
      incoterm: ["DDP", "DAP", "EXW", "FOB", "CIF"][hash % 5],
      isInsured: hash % 2 === 0,
      customsStatus: currentStageIndex > 3 ? "Cleared" : "Pending",
      co2Emissions: `${(hash % 500) + 120} kg CO₂e`
    };

    // Generate Scan Events up to current stage
    const events = [];
    let eventTime = new Date(bookedDate);
    
    for (let i = 0; i <= currentStageIndex; i++) {
      eventTime.setHours(eventTime.getHours() + (hash % 12) + 2);
      
      let location = "System";
      if (i > 2 && i < 6) location = `${origin.code} Hub`;
      if (i >= 6) location = `${dest.code} Hub`;
      if (i === 8) location = "Consignee Address";

      events.unshift({ // Add to beginning so newest is first
        id: i,
        timestamp: eventTime.toISOString(),
        location,
        status: STAGES[i],
        staff: i < 2 ? "AUTO" : `EMP-${(hash * i) % 999}`
      });
    }

    if (isFailed) {
      events.unshift({
        id: 99,
        timestamp: new Date().toISOString(),
        location: `${origin.code} Hub`,
        status: "Exception: Held by Customs",
        staff: "SYSTEM"
      });
    }

    return { mockData: data, scanEvents: events };
  }, [awb]);

  const visibleEvents = showAllEvents ? scanEvents : scanEvents.slice(0, 3);
  const isDelivered = mockData.status === "Delivered";

  const getStatusColor = () => {
     if (isDelivered) return 'emerald';
     if (mockData.status === 'Failed') return 'rose';
     if (mockData.status === 'Booked') return 'blue';
     return 'indigo'; // InTransit/Processing
  };
  const statusColor = getStatusColor();

  return (
    <div className="min-h-screen bg-[#06080A] text-slate-200 font-sans selection:bg-indigo-500/30 pt-8 pb-20">
      {/* Dynamic Background Glow */}
      <div className={`fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] opacity-[0.08] pointer-events-none blur-[120px] rounded-full mix-blend-screen bg-${statusColor}-500`}></div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Warning Banner for Failed Status */}
        {mockData.status === 'Failed' && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 bg-rose-500/10 border border-rose-500/20 rounded-2xl p-4 flex items-start shadow-lg shadow-rose-500/5">
            <AlertCircle className="w-5 h-5 text-rose-400 mr-3 mt-0.5 flex-shrink-0" />
            <div>
              <h4 className="text-rose-400 font-bold">Shipment Exception</h4>
              <p className="text-rose-300/80 text-sm mt-1">There is an issue with this shipment causing a delay. Please contact support or check the latest scan events for details.</p>
            </div>
          </motion.div>
        )}

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-4 mb-2">
              Tracking Details
              <AWBStatusBadge status={mockData.status} />
            </h1>
            <div className="flex items-center gap-3 text-slate-400">
              <span className="flex items-center gap-1.5 bg-slate-800/50 border border-slate-700/50 px-2.5 py-1 rounded-md text-sm">
                 <Hash className="w-3.5 h-3.5 text-indigo-400" />
                 AWB: <span className="font-mono font-medium text-slate-200">{mockData.awb}</span>
              </span>
              <span className="w-1 h-1 rounded-full bg-slate-700"></span>
              <span className="text-sm">Updated {new Date().toLocaleTimeString('en-US', {hour: '2-digit', minute:'2-digit'})}</span>
            </div>
          </div>
          {isDelivered && (
             <button className="flex items-center gap-2 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(16,185,129,0.1)] hover:shadow-[0_0_25px_rgba(16,185,129,0.2)]">
                <Download className="w-4 h-4" /> Download e-POD
             </button>
          )}
        </motion.div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content - Timeline & Events */}
          <div className="xl:col-span-2 space-y-8">
            {/* Timeline Stepper */}
            <motion.div
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="bg-[#0D1017]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 lg:p-8 relative overflow-hidden shadow-2xl"
            >
              <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${isDelivered ? 'from-emerald-500 via-teal-400 to-emerald-500' : mockData.status === 'Failed' ? 'from-rose-500 to-red-500' : 'from-indigo-500 via-purple-500 to-indigo-500'}`}></div>
              
              <div className="flex items-center justify-between mb-10">
                 <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
                   <Clock className={`w-5 h-5 ${isDelivered ? 'text-emerald-400' : mockData.status === 'Failed' ? 'text-rose-400' : 'text-indigo-400'}`} />
                   Shipment Progress
                 </h2>
                 <div className="text-sm text-slate-400 bg-slate-800/50 px-3 py-1.5 rounded-lg border border-slate-700/50 flex items-center gap-2">
                    <Calendar className="w-4 h-4" />
                    Est. {mockData.estimatedDelivery.split(',')[0]}
                 </div>
              </div>

              <div className="relative pl-2">
                {/* Vertical Line Background */}
                <div className="absolute left-[23px] top-4 bottom-4 w-0.5 bg-slate-800/80 rounded-full"></div>
                {/* Progress Line */}
                <div
                  className={`absolute left-[23px] top-4 w-0.5 rounded-full transition-all duration-1000 ease-in-out ${isDelivered ? 'bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]' : mockData.status === 'Failed' ? 'bg-rose-500' : 'bg-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.5)]'}`}
                  style={{
                    height: `${(mockData.currentStageIndex / (STAGES.length - 1)) * 100}%`,
                  }}
                ></div>

                <div className="space-y-8">
                  {STAGES.map((stage, index) => {
                    const isCompleted = index < mockData.currentStageIndex;
                    const isCurrent = index === mockData.currentStageIndex;
                    const isPending = index > mockData.currentStageIndex;

                    return (
                      <div key={stage} className="relative flex items-center gap-8 group">
                        {/* Icon/Circle */}
                        <div className="relative z-10 bg-[#0D1017] rounded-full py-2">
                          {isCompleted && (
                            <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="bg-slate-800/50 rounded-full p-1 border border-slate-700/50">
                              <CheckCircle2 className={`w-6 h-6 ${isDelivered || mockData.status === 'Failed' ? 'text-slate-400' : 'text-indigo-400'}`} />
                            </motion.div>
                          )}
                          {isCurrent && (
                            <div className="relative w-8 h-8 flex items-center justify-center ml-0.5">
                              <span className={`absolute w-full h-full rounded-full opacity-25 animate-ping ${isDelivered ? 'bg-emerald-500' : mockData.status === 'Failed' ? 'bg-rose-500' : 'bg-indigo-500'}`}></span>
                              <div className={`w-4 h-4 rounded-full border-[3px] border-[#0D1017] ${isDelivered ? 'bg-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.8)]' : mockData.status === 'Failed' ? 'bg-rose-500 shadow-[0_0_12px_rgba(244,63,94,0.8)]' : 'bg-indigo-500 shadow-[0_0_12px_rgba(99,102,241,0.8)]'}`}></div>
                            </div>
                          )}
                          {isPending && (
                            <div className="w-8 h-8 flex items-center justify-center ml-0.5">
                               <div className="w-2.5 h-2.5 rounded-full bg-slate-700 border border-slate-600"></div>
                            </div>
                          )}
                        </div>

                        {/* Text */}
                        <div className={`flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${isPending ? 'opacity-40' : ''}`}>
                          <h3 className={`text-base font-medium ${isCurrent ? (isDelivered ? 'text-emerald-400' : mockData.status === 'Failed' ? 'text-rose-400' : 'text-indigo-400') : isCompleted ? 'text-slate-200' : 'text-slate-500'}`}>
                            {stage}
                          </h3>
                          {(isCompleted || isCurrent) && (
                            <div className="text-sm font-mono text-slate-500 bg-slate-800/30 px-2 py-0.5 rounded border border-slate-700/30 w-fit">
                              {scanEvents.find(e => e.status === stage)?.timestamp 
                                ? new Date(scanEvents.find(e => e.status === stage)!.timestamp).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' })
                                : '--'}
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            {/* Scan Events Feed */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#0D1017]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 lg:p-8 shadow-xl"
            >
              <div className="flex items-center justify-between mb-6">
                 <h2 className="text-xl font-semibold text-white flex items-center gap-2.5">
                   <FileText className="w-5 h-5 text-slate-400" />
                   Scan History
                 </h2>
                 <span className="text-xs font-medium px-2.5 py-1 bg-slate-800/80 text-slate-300 rounded-lg border border-slate-700">{scanEvents.length} Events</span>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {visibleEvents.map((event, i) => {
                    const isException = event.status.includes('Exception');
                    return (
                      <motion.div
                        key={event.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ delay: 0.05 * i }}
                        className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-2xl border transition-all ${isException ? 'bg-rose-500/5 border-rose-500/20 shadow-[0_4px_20px_rgba(244,63,94,0.05)]' : 'bg-slate-800/20 border-slate-700/50 hover:bg-slate-800/40 hover:border-slate-600/50'}`}
                      >
                        <div className="flex flex-col sm:flex-row gap-3 sm:gap-6 sm:items-center">
                          <div suppressHydrationWarning className={`text-sm font-mono w-40 bg-black/20 px-3 py-1.5 rounded-lg border border-white/5 ${isException ? 'text-rose-400' : 'text-slate-400'}`}>
                            {new Date(event.timestamp).toLocaleString("en-GB", {
                              day: "2-digit",
                              month: "short",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </div>
                          <div>
                            <div className={`font-medium ${isException ? 'text-rose-400 font-bold' : 'text-slate-200'}`}>{event.status}</div>
                            <div className="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
                              <MapPin className="w-3.5 h-3.5 text-slate-600" />
                              {event.location}
                            </div>
                          </div>
                        </div>
                        <div className="mt-3 sm:mt-0 text-xs px-2.5 py-1 bg-black/40 rounded-md text-slate-400 border border-slate-700/50 max-w-max flex items-center gap-1.5">
                          <User className="w-3 h-3 text-slate-500" />
                          {event.staff}
                        </div>
                      </motion.div>
                    )
                  })}
                </AnimatePresence>

                {scanEvents.length > 3 && (
                  <button
                    onClick={() => setShowAllEvents(!showAllEvents)}
                    className="w-full mt-4 py-3 text-sm font-medium text-slate-300 hover:text-white flex items-center justify-center gap-2 rounded-2xl hover:bg-slate-800/50 transition-colors border border-dashed border-slate-700/80 bg-slate-800/20"
                  >
                    {showAllEvents ? (
                      <>
                        <ChevronUp className="w-4 h-4" /> Collapse History
                      </>
                    ) : (
                      <>
                        <ChevronDown className="w-4 h-4" /> View All {scanEvents.length} Events
                      </>
                    )}
                  </button>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Shipment Summary */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-[#0D1017]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl overflow-hidden sticky top-8 shadow-2xl"
            >
              {/* Routing Visual Card */}
              <div className="relative p-8 bg-gradient-to-b from-slate-800/40 to-transparent border-b border-slate-800/60 overflow-hidden">
                <div className="absolute inset-0 opacity-[0.03] bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-slate-900 to-black mix-blend-overlay pointer-events-none"></div>
                <div className="flex items-center justify-between relative z-10">
                  <div className="text-center w-24">
                    <div className="text-4xl font-black text-white tracking-tighter">{mockData.origin}</div>
                    <div className="text-xs text-slate-400 mt-1.5 truncate font-medium">{mockData.originCity}</div>
                  </div>
                  <div className="flex-1 flex items-center justify-center relative px-4">
                    <div className={`w-full border-t-2 border-dashed ${isDelivered ? 'border-emerald-500/50' : 'border-indigo-500/50'}`}></div>
                    <motion.div 
                       animate={isDelivered ? {} : { x: [0, 10, 0] }} 
                       transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                       className={`absolute bg-[#0D1017] px-2 p-1 rounded-full border border-slate-800 ${isDelivered ? 'text-emerald-500' : 'text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]'}`}
                    >
                       <Plane className="w-5 h-5" />
                    </motion.div>
                  </div>
                  <div className="text-center w-24">
                    <div className="text-4xl font-black text-white tracking-tighter">{mockData.destination}</div>
                    <div className="text-xs text-slate-400 mt-1.5 truncate font-medium">{mockData.destinationCity}</div>
                  </div>
                </div>
              </div>

              {/* Core Logistics Info */}
              <div className="p-6 space-y-4 border-b border-slate-800/60 bg-slate-900/10">
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/30 p-3.5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5 font-medium">
                      <PlaneTakeoff className="w-3.5 h-3.5 text-blue-400" /> Carrier
                    </div>
                    <div className="text-sm font-bold text-slate-200">{mockData.carrier}</div>
                  </div>
                  <div className="bg-slate-800/30 p-3.5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5 font-medium">
                      <FileText className="w-3.5 h-3.5 text-amber-400" /> Flight No.
                    </div>
                    <div className="text-sm font-bold text-slate-200">{mockData.flightNo}</div>
                  </div>
                  <div className="bg-slate-800/30 p-3.5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <div className="text-xs text-slate-500 flex items-center gap-1.5 mb-1.5 font-medium">
                      <Package className="w-3.5 h-3.5 text-emerald-400" /> Pieces
                    </div>
                    <div className="text-sm font-bold text-slate-200">{mockData.pieceCount} NOP</div>
                  </div>
                  <div className="bg-slate-800/30 p-3.5 rounded-2xl border border-slate-700/50 hover:bg-slate-800/50 transition-colors">
                    <div className="text-xs text-slate-500 flex items-center justify-between mb-1.5 font-medium">
                      <span className="flex items-center gap-1.5"><Weight className="w-3.5 h-3.5 text-purple-400" /> Gross</span>
                      <span className="text-[10px] text-slate-600 uppercase">Vol: {mockData.volumetricWeight}</span>
                    </div>
                    <div className="text-sm font-bold text-slate-200">{mockData.weight} <span className="text-xs font-normal text-slate-500">kg</span></div>
                  </div>
                </div>
              </div>

              {/* Extended Info */}
              <div className="p-6 space-y-5 bg-slate-900/20">
                <div className="flex items-start gap-3.5">
                   <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center flex-shrink-0 border border-indigo-500/20">
                      <Calendar className="w-5 h-5 text-indigo-400" />
                   </div>
                   <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1 font-medium">Estimated Delivery</div>
                      <div suppressHydrationWarning className={`text-sm font-bold ${isDelivered ? 'text-emerald-400' : 'text-slate-200'}`}>{mockData.estimatedDelivery}</div>
                   </div>
                </div>
                
                <div className="flex items-start gap-3.5">
                   <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-700">
                      <User className="w-5 h-5 text-slate-400" />
                   </div>
                   <div className="flex-1">
                      <div className="text-xs text-slate-500 mb-1 font-medium">Consignee</div>
                      <div className="text-sm font-bold text-slate-200">{mockData.consignee}</div>
                   </div>
                </div>

                <div className="flex items-start gap-3.5">
                   <div className="w-10 h-10 rounded-xl bg-slate-800/50 flex items-center justify-center flex-shrink-0 border border-slate-700">
                      <Box className="w-5 h-5 text-slate-400" />
                   </div>
                   <div className="flex-1 flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500 mb-1 font-medium">Service Level</div>
                        <div className="text-sm font-bold text-slate-200">{mockData.serviceLevel}</div>
                      </div>
                      <span className="text-[10px] uppercase font-bold px-2 py-1 bg-slate-800 rounded text-slate-400 border border-slate-700">{mockData.incoterm}</span>
                   </div>
                </div>
              </div>
            </motion.div>

            {/* Compliance & Sustainability Card */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#0D1017]/80 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-6 shadow-xl space-y-4"
            >
               <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-2">Compliance & Sustainability</h3>
               
               <div className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                     <FileCheck className="w-4 h-4 text-slate-400" />
                     <span className="text-sm text-slate-300">Customs Status</span>
                  </div>
                  <span className={`text-sm font-medium px-2.5 py-0.5 rounded-md border ${mockData.customsStatus === 'Cleared' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                     {mockData.customsStatus}
                  </span>
               </div>

               <div className="flex items-center justify-between p-3 bg-slate-800/20 rounded-xl border border-slate-700/50">
                  <div className="flex items-center gap-3">
                     <ShieldCheck className="w-4 h-4 text-slate-400" />
                     <span className="text-sm text-slate-300">Cargo Insurance</span>
                  </div>
                  <span className={`text-sm font-medium ${mockData.isInsured ? 'text-emerald-400' : 'text-slate-500'}`}>
                     {mockData.isInsured ? 'Active' : 'Uninsured'}
                  </span>
               </div>

               <div className="flex items-center justify-between p-3 bg-emerald-900/10 rounded-xl border border-emerald-900/30">
                  <div className="flex items-center gap-3">
                     <Leaf className="w-4 h-4 text-emerald-500" />
                     <span className="text-sm text-slate-300">Est. CO₂ Footprint</span>
                  </div>
                  <span className="text-sm font-mono text-emerald-400">
                     {mockData.co2Emissions}
                  </span>
               </div>

            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
