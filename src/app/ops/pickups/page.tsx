"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PICKUPS, LORRY_RECEIPTS, Pickup } from "@/data/mockData";
import { Truck, Search, Plus, X, Check, Clock, MapPin, Phone, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";

const STATUS_FLOW: Pickup['status'][] = ['Scheduled', 'In Transit', 'Picked Up', 'Delivered to Hub'];
const TIME_SLOTS = ['08:00 AM - 10:00 AM', '10:00 AM - 12:00 PM', '12:00 PM - 02:00 PM', '02:00 PM - 04:00 PM', '04:00 PM - 06:00 PM'];

export default function PickupsPage() {
  const [pickups, setPickups] = useState<Pickup[]>(PICKUPS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [form, setForm] = useState({ lrIds: [] as string[], consignorName: '', pickupAgent: '', driverName: '', driverPhone: '', scheduledDate: '', timeSlot: TIME_SLOTS[0], pickupAddress: '', notes: '' });

  const filtered = pickups.filter(p => {
    const q = searchTerm.toLowerCase();
    return p.pickupNo.toLowerCase().includes(q) || p.consignorName.toLowerCase().includes(q) || p.pickupAgent.toLowerCase().includes(q);
  });

  const advanceStatus = (pickup: Pickup) => {
    const ci = STATUS_FLOW.indexOf(pickup.status);
    if (ci < STATUS_FLOW.length - 1) {
      const next = STATUS_FLOW[ci + 1];
      setPickups(prev => prev.map(p => p.id === pickup.id ? { ...p, status: next } : p));
      toast.success(`Pickup ${pickup.pickupNo} → ${next}`);
    }
  };

  const handleCreate = () => {
    if (!form.consignorName || !form.pickupAgent || !form.scheduledDate) { toast.error("Fill required fields"); return; }
    const d = new Date(); const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const newPu: Pickup = { id: `pu-${Date.now()}`, pickupNo: `PU-${ds}-${String(pickups.length+1).padStart(4,'0')}`, ...form, status: 'Scheduled', createdAt: new Date().toISOString() };
    setPickups(prev => [newPu, ...prev]);
    toast.success(`Pickup ${newPu.pickupNo} created`);
    setIsCreateOpen(false);
    setForm({ lrIds: [], consignorName: '', pickupAgent: '', driverName: '', driverPhone: '', scheduledDate: '', timeSlot: TIME_SLOTS[0], pickupAddress: '', notes: '' });
  };

  const statusColors: Record<string, string> = { 'Scheduled': 'bg-blue-500/10 text-blue-600 border-blue-500/20', 'In Transit': 'bg-amber-500/10 text-amber-600 border-amber-500/20', 'Picked Up': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', 'Delivered to Hub': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20' };
  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Truck className="w-6 h-6 text-indigo-500" /></motion.div>
            Pickup Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Schedule and track consignment pickups.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Plus className="w-4 h-4 text-white" /></motion.div> New Pickup</button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 flex"><Search className="w-4 h-4" /></motion.div><input type="text" placeholder="Search pickups..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm transition-shadow" /></div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filtered.map((pu, idx) => (
              <motion.div key={pu.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.05 }} className="bg-white rounded-xl border border-blue-200 p-5 hover:border-blue-300 hover:shadow-[0_4px_20px_-8px_rgba(99,102,241,0.15)] transition-all">
                <div className="flex justify-between items-start mb-3">
                  <div><div className="font-bold text-slate-900">{pu.pickupNo}</div><div className="text-xs text-slate-500 mt-0.5">{pu.consignorName}</div></div>
                  <span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[pu.status]}`}>{pu.status}</span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-slate-600"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.15 }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-md text-indigo-500"><User className="w-3.5 h-3.5" /></motion.div><span>Agent: {pu.pickupAgent}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.15 + 0.5 }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-md text-indigo-500"><Truck className="w-3.5 h-3.5" /></motion.div><span>Driver: {pu.driverName}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.15 + 1 }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-md text-indigo-500"><Clock className="w-3.5 h-3.5" /></motion.div><span>{pu.scheduledDate} | {pu.timeSlot}</span></div>
                  <div className="flex items-center gap-2 text-slate-600"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear", delay: idx * 0.15 + 1.5 }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-md text-indigo-500"><MapPin className="w-3.5 h-3.5" /></motion.div><span className="truncate">{pu.pickupAddress}</span></div>
                </div>
                {/* Status progression */}
                <div className="mt-4 flex gap-1">
                  {STATUS_FLOW.map((s, i) => {
                    const ci = STATUS_FLOW.indexOf(pu.status);
                    return <div key={s} className={`flex-1 h-1.5 rounded-full ${i <= ci ? 'bg-indigo-500' : 'bg-slate-200'}`} />;
                  })}
                </div>
                <div className="mt-3 flex justify-between items-center">
                  <div className="text-xs text-slate-500">LRs: {pu.lrIds.length}</div>
                  {pu.status !== 'Delivered to Hub' && (
                    <button onClick={() => advanceStatus(pu)} className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium rounded-lg shadow-[0_0_10px_rgba(79,70,229,0.2)]">
                      <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><ArrowRight className="w-3 h-3" /></motion.div> Advance → {STATUS_FLOW[STATUS_FLOW.indexOf(pu.status) + 1]}
                    </button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
          {filtered.length === 0 && <div className="text-center py-12 text-slate-500"><Truck className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p>No pickups found</p></div>}
        </div>
      </div>

      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-xl font-bold text-slate-900">New Pickup Request</h2>
                <button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div><label className="text-xs font-medium text-slate-500">Link LRs</label>
                  <div className="flex flex-wrap gap-2 mt-1">{LORRY_RECEIPTS.filter(l => l.status === 'Ready').map(lr => (
                    <button key={lr.id} onClick={() => { const ids = form.lrIds.includes(lr.id) ? form.lrIds.filter(x => x !== lr.id) : [...form.lrIds, lr.id]; setForm({...form, lrIds: ids, consignorName: ids.length ? LORRY_RECEIPTS.find(l=>l.id===ids[0])?.consignor || '' : ''}); }} className={`px-2 py-1 rounded text-xs border ${form.lrIds.includes(lr.id) ? 'bg-indigo-500/20 border-indigo-500/30 text-indigo-600' : 'bg-white border-slate-300 text-slate-600'}`}>{lr.lrNumber}</button>
                  ))}</div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Consignor *</label><input type="text" value={form.consignorName} onChange={e => setForm({...form, consignorName: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Pickup Agent *</label><input type="text" value={form.pickupAgent} onChange={e => setForm({...form, pickupAgent: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Driver Name</label><input type="text" value={form.driverName} onChange={e => setForm({...form, driverName: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Driver Phone</label><input type="text" value={form.driverPhone} onChange={e => setForm({...form, driverPhone: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Date *</label><input type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Time Slot</label><select value={form.timeSlot} onChange={e => setForm({...form, timeSlot: e.target.value})} className={inputCls}>{TIME_SLOTS.map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                </div>
                <div><label className="text-xs font-medium text-slate-500">Pickup Address</label><input type="text" value={form.pickupAddress} onChange={e => setForm({...form, pickupAddress: e.target.value})} className={inputCls} /></div>
                <div><label className="text-xs font-medium text-slate-500">Notes</label><textarea value={form.notes} onChange={e => setForm({...form, notes: e.target.value})} className={inputCls} rows={2} /></div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> Create Pickup</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
