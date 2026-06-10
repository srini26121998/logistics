"use client";

import React, { useState, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "sonner";
import { SHIPMENTS, Shipment } from "@/data/mockData";
import {
  CheckCircle2,
  Package,
  MapPin,
  User,
  Phone,
  Mail,
  Building,
  CreditCard,
  ShieldCheck,
  ArrowRight,
  Loader2
} from "lucide-react";

// Wrap in Suspense for useSearchParams
export default function BookingPageWrapper() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 text-indigo-500 animate-spin" /></div>}>
      <BookingPage />
    </Suspense>
  );
}

function BookingPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const formatIndianNumber = (num: number) => {
    if (isNaN(num)) return '0';
    const parts = num.toString().split('.');
    let lastThree = parts[0].substring(parts[0].length - 3);
    const otherNumbers = parts[0].substring(0, parts[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') lastThree = ',' + lastThree;
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return parts.length > 1 ? res + '.' + parts[1] : res;
  };

  // Mock Quote Data (fallback if no params)
  const baseFreight = searchParams.get("baseFreight") ? Math.round(parseFloat(searchParams.get("baseFreight")!)) : 33351;
  const otherCharges = searchParams.get("otherCharges") ? Math.round(parseFloat(searchParams.get("otherCharges")!)) : 14827;
  const igst = searchParams.get("igst") ? Math.round(parseFloat(searchParams.get("igst")!)) : 8672;
  const total = baseFreight + otherCharges + igst;

  const [quote] = useState({
    origin: searchParams.get("origin") || "DEL",
    destination: searchParams.get("destination") || "BOM",
    weight: searchParams.get("weight") ? Math.round(parseFloat(searchParams.get("weight")!)).toString() : "1250",
    commodity: searchParams.get("commodity") || "Electronics",
    baseFreight,
    otherCharges,
    igst,
    total
  });

  const [shipper, setShipper] = useState({ name: "", company: "", phone: "", email: "", address: "" });
  const [consignee, setConsignee] = useState({ name: "", company: "", phone: "", email: "", address: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedBooking, setConfirmedBooking] = useState<{awb: string, lrNumber: string} | null>(null);

  const handleConfirm = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call to lock quote & generate LR
    setTimeout(() => {
      const generatedLR = `LR-${Math.floor(100000 + Math.random() * 900000)}`;
      const generatedAWB = `312-${Math.floor(10000000 + Math.random() * 90000000)}`;
      
      const newShipment: Shipment = {
        id: `s${SHIPMENTS.length + 1}`,
        awb: generatedAWB,
        lrNumber: generatedLR,
        origin: quote.origin as string,
        destination: quote.destination as string,
        status: 'Booked',
        carrier: 'IndiGo Cargo',
        mode: 'Air',
        pieces: 1,
        weight: `${quote.weight} kg`,
        commodity: quote.commodity as string,
        shipper: shipper.company || shipper.name || 'Unknown Shipper',
        consignee: consignee.company || consignee.name || 'Unknown Consignee',
        bookedDate: new Date().toISOString().split('T')[0],
        eta: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        amount: quote.total
      };

      SHIPMENTS.unshift(newShipment);

      setConfirmedBooking({ awb: generatedAWB, lrNumber: generatedLR });
      setIsSubmitting(false);
      toast.success('Booking Confirmed Successfully!');
    }, 1500);
  };

  const prefillSavedAddress = (type: 'shipper' | 'consignee') => {
    if (type === 'shipper') {
      setShipper({
        name: "Rahul Sharma",
        company: "TechCorp India",
        phone: "+91 9876543210",
        email: "logistics@techcorp.in",
        address: "Phase 1, Okhla Industrial Estate, New Delhi, 110020"
      });
    } else {
      setConsignee({
        name: "Vikram Singh",
        company: "OXEN Logistics",
        phone: "+91 9123456780",
        email: "receiving@oxenlogistics.com",
        address: "Andheri East, Near Chakala Metro, Mumbai, 400099"
      });
    }
  };




  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 pt-8 pb-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
            <Package className="w-8 h-8 text-indigo-500" />
            Complete Your Booking
          </h1>
          <p className="text-slate-600 mt-2">Enter shipper and consignee details to lock your quote.</p>
        </motion.div>

        <form onSubmit={handleConfirm} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Main Form Area */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Shipper Details */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <User className="w-5 h-5 text-indigo-400" /> Shipper Details
                </h2>
                <button type="button" onClick={() => prefillSavedAddress('shipper')} className="text-sm text-indigo-400 hover:text-indigo-300 bg-indigo-500/10 hover:bg-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors border border-indigo-500/20">
                  Load Saved Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" value={shipper.name} onChange={(e) => setShipper({...shipper, name: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" value={shipper.company} onChange={(e) => setShipper({...shipper, company: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="tel" value={shipper.phone} onChange={(e) => setShipper({...shipper, phone: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="email" value={shipper.email} onChange={(e) => setShipper({...shipper, email: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-slate-600 ml-1">Pickup Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea required rows={2} value={shipper.address} onChange={(e) => setShipper({...shipper, address: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Consignee Details */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-slate-900 flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-amber-400" /> Consignee Details
                </h2>
                <button type="button" onClick={() => prefillSavedAddress('consignee')} className="text-sm text-amber-400 hover:text-amber-300 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg transition-colors border border-amber-500/20">
                  Load Saved Address
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Contact Name</label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" value={consignee.name} onChange={(e) => setConsignee({...consignee, name: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Company</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="text" value={consignee.company} onChange={(e) => setConsignee({...consignee, company: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Phone</label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="tel" value={consignee.phone} onChange={(e) => setConsignee({...consignee, phone: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs text-slate-600 ml-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
                    <input required type="email" value={consignee.email} onChange={(e) => setConsignee({...consignee, email: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all" />
                  </div>
                </div>
                <div className="space-y-1 md:col-span-2">
                  <label className="text-xs text-slate-600 ml-1">Delivery Address</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 w-4 h-4 text-slate-500" />
                    <textarea required rows={2} value={consignee.address} onChange={(e) => setConsignee({...consignee, address: e.target.value})} className="w-full bg-white border border-blue-200 rounded-xl py-2.5 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all resize-none" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Quote Summary */}
          <div className="space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }} className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden sticky top-8">
              <div className="p-6 border-b border-blue-200">
                <h2 className="text-lg font-semibold text-slate-900 mb-1">Quote Summary</h2>
                <div className="flex items-center gap-2 text-xs text-green-400 bg-green-500/10 w-fit px-2 py-1 rounded-md border border-green-500/20">
                  <ShieldCheck className="w-3 h-3" /> Rate Locked
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Route Info */}
                <div className="flex justify-between items-center text-center bg-white p-4 rounded-xl border border-blue-200/50">
                  <div>
                    <div className="text-xl font-bold text-slate-900">{quote.origin}</div>
                    <div className="text-xs text-slate-500">Origin</div>
                  </div>
                  <div className="px-2 text-slate-600">→</div>
                  <div>
                    <div className="text-xl font-bold text-slate-900">{quote.destination}</div>
                    <div className="text-xs text-slate-500">Destination</div>
                  </div>
                </div>

                {/* Shipment Details */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-xs text-slate-500">Gross Weight</div>
                    <div className="font-medium text-slate-900">{quote.weight} kg</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-500">Commodity</div>
                    <div className="font-medium text-slate-900">{quote.commodity}</div>
                  </div>
                </div>

                {/* Price Breakdown */}
                <div className="pt-4 border-t border-blue-200/50 space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Base Freight</span>
                    <span className="text-slate-900 font-medium">₹{formatIndianNumber(quote.baseFreight)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">Other Charges</span>
                    <span className="text-slate-900 font-medium">₹{formatIndianNumber(quote.otherCharges)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-slate-600">IGST (18%)</span>
                    <span className="text-slate-900 font-medium">₹{formatIndianNumber(quote.igst)}</span>
                  </div>
                  
                  <div className="pt-3 flex justify-between items-end border-t border-blue-200">
                    <span className="text-slate-700 font-medium">Total Amount</span>
                    <span className="text-2xl font-bold text-indigo-400">₹{formatIndianNumber(quote.total)}</span>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white py-4 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center justify-center gap-2 mt-4"
                >
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Confirming...</>
                  ) : (
                    <><CheckCircle2 className="w-5 h-5" /> Book This Shipment</>
                  )}
                </button>
                <div className="text-center text-xs text-slate-500 flex items-center justify-center gap-1">
                  <CreditCard className="w-3 h-3" /> Corporate billing terms apply
                </div>
              </div>
            </motion.div>
          </div>
        </form>

        {/* Confirmation Modal */}
        <AnimatePresence>
          {confirmedBooking && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm px-4"
            >
              <motion.div
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white border border-blue-200 rounded-2xl p-8 max-w-md w-full text-center shadow-2xl"
              >
                <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle2 className="w-8 h-8 text-green-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Confirmed!</h2>
                <p className="text-slate-600 mb-6">Your shipment has been successfully booked.</p>
                
                <div className="bg-white rounded-xl p-4 mb-8 space-y-3 text-left border border-blue-200/50">
                  <div className="flex justify-between items-center pb-3 border-b border-blue-200">
                    <span className="text-slate-500 text-sm">AWB Number</span>
                    <span className="text-slate-900 font-semibold">{confirmedBooking.awb}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-500 text-sm">LR Number</span>
                    <span className="text-slate-900 font-semibold">{confirmedBooking.lrNumber}</span>
                  </div>
                </div>

                <button
                  onClick={() => router.push('/ops/shipments')}
                  className="w-full bg-indigo-600 hover:bg-indigo-500 text-white py-3 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                >
                  OK
                </button>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
