"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BOOKINGS, LORRY_RECEIPTS, VENDORS, Booking } from "@/data/mockData";
import { Box, Search, Plus, X, Check, Plane, Truck, Train, Filter } from "lucide-react";
import { toast } from "sonner";

const MODE_ICONS = { Air: Plane, Road: Truck, Train: Train };

export default function BookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>(BOOKINGS);
  const [searchTerm, setSearchTerm] = useState("");
  const [modeFilter, setModeFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<'Air' | 'Road' | 'Train'>('Air');
  const [form, setForm] = useState<Record<string, string>>({});

  const filtered = bookings.filter(b => {
    const q = searchTerm.toLowerCase();
    const match = b.bookingRef.toLowerCase().includes(q) || b.origin.toLowerCase().includes(q) || b.destination.toLowerCase().includes(q);
    return match && (modeFilter === "All" || b.mode === modeFilter);
  });

  const handleCreate = () => {
    if (!form.origin || !form.destination) { toast.error("Origin and destination required"); return; }
    const d = new Date(); const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const newBk: Booking = {
      id: `bk-${Date.now()}`, bookingRef: `BK-${ds}-${String(bookings.length+1).padStart(4,'0')}`,
      lrIds: form.lrIds ? form.lrIds.split(',') : [], mode: activeTab, status: 'Confirmed',
      origin: form.origin.toUpperCase(), destination: form.destination.toUpperCase(),
      departureDate: form.departureDate || d.toISOString().split('T')[0],
      estimatedDelivery: form.estimatedDelivery || '', vendorId: form.vendorId,
      flightNo: form.flightNo, airline: form.airline, awbNumber: form.awbNumber,
      originAirport: form.originAirport, destinationAirport: form.destinationAirport,
      vehicleNo: form.vehicleNo, driverName: form.driverName, gpsDeviceId: form.gpsDeviceId,
      originHub: form.originHub, destinationHub: form.destinationHub,
      trainNo: form.trainNo, pnrRrNo: form.pnrRrNo, loadingStation: form.loadingStation, unloadingStation: form.unloadingStation,
      totalPieces: Number(form.totalPieces) || 0, totalWeight: Number(form.totalWeight) || 0,
      createdAt: new Date().toISOString()
    };
    setBookings(prev => [newBk, ...prev]);
    toast.success(`Booking ${newBk.bookingRef} created (${activeTab})`);
    setIsCreateOpen(false); setForm({});
  };

  const statusColors: Record<string, string> = { Draft: 'bg-slate-500/10 text-slate-500 border-slate-500/20', Confirmed: 'bg-blue-500/10 text-blue-600 border-blue-500/20', 'In Transit': 'bg-amber-500/10 text-amber-600 border-amber-500/20', Completed: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
  const modeColors: Record<string, string> = { Air: 'text-blue-600 bg-blue-500/10', Road: 'text-amber-600 bg-amber-500/10', Train: 'text-purple-600 bg-purple-500/10' };
  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Box className="w-6 h-6 text-indigo-500" /></motion.div>
            Booking Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Air, Road & Train shipment bookings.</p>
        </div>
        <button onClick={() => { setIsCreateOpen(true); setForm({}); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Plus className="w-4 h-4 text-white" /></motion.div> New Booking</button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 flex"><Search className="w-4 h-4" /></motion.div><input type="text" placeholder="Search bookings..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm transition-shadow" /></div>
          <div className="flex items-center gap-2">
            {["All", "Air", "Road", "Train"].map(m => (<button key={m} onClick={() => setModeFilter(m)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${modeFilter === m ? "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30" : "bg-slate-200 text-slate-500 border border-slate-300"}`}>{m}</button>))}
          </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/90 sticky top-0 z-10 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Booking Ref</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Mode</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Carrier / Vehicle</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filtered.map((bk, idx) => {
                const Icon = MODE_ICONS[bk.mode];
                return (
                  <motion.tr key={bk.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-slate-900 text-sm">{bk.bookingRef}</div><div className="text-xs text-slate-500 font-mono">{bk.lrIds.length} LR(s)</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${modeColors[bk.mode]}`}><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.1 }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-md"><Icon className="w-3.5 h-3.5" /></motion.div>{bk.mode}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className="font-semibold text-slate-600 text-sm">{bk.origin}</span><span className="text-slate-600 mx-1">→</span><span className="font-semibold text-slate-600 text-sm">{bk.destination}</span></td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">
                      {bk.mode === 'Air' && <>{bk.airline} | {bk.flightNo}</>}
                      {bk.mode === 'Road' && <>{bk.vehicleNo} | {bk.driverName}</>}
                      {bk.mode === 'Train' && <>Train {bk.trainNo} | {bk.pnrRrNo}</>}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{bk.totalPieces} pcs | {bk.totalWeight} kg</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm"><div className="text-slate-600">Dep: {bk.departureDate}</div><div className="text-slate-500 text-xs">ETA: {bk.estimatedDelivery}</div></td>
                    <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[bk.status]}`}>{bk.status}</span></td>
                  </motion.tr>
                );
              })}
              {filtered.length === 0 && <tr><td colSpan={7} className="px-6 py-12 text-center text-slate-500"><Box className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p>No bookings found</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-xl font-bold text-slate-900">New Booking</h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              {/* Mode tabs */}
              <div className="flex border-b border-blue-200 px-6">
                {(['Air', 'Road', 'Train'] as const).map(m => {
                  const Icon = MODE_ICONS[m];
                  return <button key={m} onClick={() => setActiveTab(m)} className={`flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${activeTab === m ? 'border-indigo-600 text-indigo-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}><Icon className="w-4 h-4" />{m}</button>;
                })}
              </div>
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Origin *</label><input type="text" value={form.origin||''} onChange={e => setForm({...form, origin: e.target.value})} className={inputCls} placeholder="e.g. DEL" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Destination *</label><input type="text" value={form.destination||''} onChange={e => setForm({...form, destination: e.target.value})} className={inputCls} placeholder="e.g. BOM" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Departure Date</label><input type="date" value={form.departureDate||''} onChange={e => setForm({...form, departureDate: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Est. Delivery</label><input type="date" value={form.estimatedDelivery||''} onChange={e => setForm({...form, estimatedDelivery: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Total Pieces</label><input type="number" value={form.totalPieces||''} onChange={e => setForm({...form, totalPieces: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Total Weight (kg)</label><input type="number" value={form.totalWeight||''} onChange={e => setForm({...form, totalWeight: e.target.value})} className={inputCls} /></div>
                  <div className="col-span-2"><label className="text-xs font-medium text-slate-500">Vendor</label><select value={form.vendorId||''} onChange={e => setForm({...form, vendorId: e.target.value})} className={inputCls}><option value="">Select vendor</option>{VENDORS.filter(v => (activeTab === 'Air' && v.type === 'Airline') || (activeTab === 'Road' && (v.type === 'Trucking' || v.type === 'Fleet')) || (activeTab === 'Train' && v.type === 'Railways')).map(v => <option key={v.id} value={v.id}>{v.name}</option>)}</select></div>
                </div>
                {/* Mode-specific fields */}
                {activeTab === 'Air' && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div><label className="text-xs font-medium text-slate-500">Flight No.</label><input type="text" value={form.flightNo||''} onChange={e => setForm({...form, flightNo: e.target.value})} className={inputCls} placeholder="e.g. 6E-1234" /></div>
                    <div><label className="text-xs font-medium text-slate-500">Airline</label><input type="text" value={form.airline||''} onChange={e => setForm({...form, airline: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">AWB Number</label><input type="text" value={form.awbNumber||''} onChange={e => setForm({...form, awbNumber: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">Origin Airport</label><input type="text" value={form.originAirport||''} onChange={e => setForm({...form, originAirport: e.target.value})} className={inputCls} /></div>
                  </div>
                )}
                {activeTab === 'Road' && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div><label className="text-xs font-medium text-slate-500">Vehicle No.</label><input type="text" value={form.vehicleNo||''} onChange={e => setForm({...form, vehicleNo: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">Driver Name</label><input type="text" value={form.driverName||''} onChange={e => setForm({...form, driverName: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">GPS Device ID</label><input type="text" value={form.gpsDeviceId||''} onChange={e => setForm({...form, gpsDeviceId: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">Origin Hub</label><input type="text" value={form.originHub||''} onChange={e => setForm({...form, originHub: e.target.value})} className={inputCls} /></div>
                  </div>
                )}
                {activeTab === 'Train' && (
                  <div className="grid grid-cols-2 gap-4 pt-3 border-t border-blue-200">
                    <div><label className="text-xs font-medium text-slate-500">Train No.</label><input type="text" value={form.trainNo||''} onChange={e => setForm({...form, trainNo: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">PNR/RR No.</label><input type="text" value={form.pnrRrNo||''} onChange={e => setForm({...form, pnrRrNo: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">Loading Station</label><input type="text" value={form.loadingStation||''} onChange={e => setForm({...form, loadingStation: e.target.value})} className={inputCls} /></div>
                    <div><label className="text-xs font-medium text-slate-500">Unloading Station</label><input type="text" value={form.unloadingStation||''} onChange={e => setForm({...form, unloadingStation: e.target.value})} className={inputCls} /></div>
                  </div>
                )}
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> Create Booking</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
