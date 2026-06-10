"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { VENDORS, Vendor } from "@/data/mockData";
import { Building, Search, Plus, X, Check, Star, Phone, Mail, ShieldCheck, ShieldX, Edit, Eye } from "lucide-react";
import { toast } from "sonner";

export default function VendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>(VENDORS);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [viewVendor, setViewVendor] = useState<Vendor | null>(null);
  const [form, setForm] = useState<Partial<Vendor>>({});

  const filtered = vendors.filter(v => {
    const q = searchTerm.toLowerCase();
    const match = v.name.toLowerCase().includes(q) || v.contactPerson.toLowerCase().includes(q);
    return match && (typeFilter === "All" || v.type === typeFilter);
  });

  const handleCreate = () => {
    if (!form.name || !form.type) { toast.error("Name and type required"); return; }
    const nv: Vendor = { id: `v-${Date.now()}`, name: form.name, type: form.type as Vendor['type'], contactPerson: form.contactPerson||'', email: form.email||'', phone: form.phone||'', address: form.address||'', gstin: form.gstin||'', panNo: form.panNo||'', bankName: form.bankName||'', bankAccount: form.bankAccount||'', ifscCode: form.ifscCode||'', kycVerified: false, contractStart: form.contractStart||'', contractEnd: form.contractEnd||'', status: 'Active', rating: 0, totalTransactions: 0 };
    setVendors(prev => [nv, ...prev]);
    toast.success(`Vendor ${nv.name} added`);
    setIsCreateOpen(false); setForm({});
  };

  const toggleKYC = (vendor: Vendor) => {
    setVendors(prev => prev.map(v => v.id === vendor.id ? { ...v, kycVerified: !v.kycVerified } : v));
    toast.success(`KYC ${vendor.kycVerified ? 'revoked' : 'verified'} for ${vendor.name}`);
  };

  const typeColors: Record<string, string> = { Airline: 'text-blue-600 bg-blue-500/10', Trucking: 'text-amber-600 bg-amber-500/10', Railways: 'text-purple-600 bg-purple-500/10', Courier: 'text-emerald-600 bg-emerald-500/10', Fleet: 'text-indigo-600 bg-indigo-500/10' };
  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Building className="w-6 h-6 text-indigo-500" /></motion.div>
            Vendor Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage carriers, transporters, and service providers.</p>
        </div>
        <button onClick={() => { setIsCreateOpen(true); setForm({}); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"><Plus className="w-4 h-4" /> Add Vendor</button>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Search vendors..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          <div className="flex items-center gap-2">{["All","Airline","Trucking","Railways","Courier","Fleet"].map(t => (<button key={t} onClick={() => setTypeFilter(t)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${typeFilter === t ? "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30" : "bg-slate-200 text-slate-500 border border-slate-300"}`}>{t}</button>))}</div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1100px]">
            <thead className="bg-white/90 sticky top-0 z-10 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Type</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contact</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">KYC</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Contract</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Rating</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filtered.map((v, idx) => (
                <motion.tr key={v.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-200/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-slate-900 text-sm">{v.name}</div><div className="text-xs text-slate-500">{v.totalTransactions} transactions</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${typeColors[v.type]}`}>{v.type}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-700">{v.contactPerson}</div><div className="text-xs text-slate-500">{v.email}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><button onClick={() => toggleKYC(v)} className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${v.kycVerified ? 'bg-emerald-500/10 text-emerald-600' : 'bg-red-500/10 text-red-600'}`}>{v.kycVerified ? <><ShieldCheck className="w-3.5 h-3.5" />Verified</> : <><ShieldX className="w-3.5 h-3.5" />Pending</>}</button></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{v.contractStart}<div className="text-xs text-slate-500">to {v.contractEnd}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="flex items-center gap-1"><Star className="w-4 h-4 text-amber-500 fill-amber-500" /><span className="text-sm font-medium text-slate-900">{v.rating}</span></div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><button onClick={() => setViewVendor(v)} className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all"><Eye className="w-3.5 h-3.5 inline" /></button></td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-2xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-blue-200"><h2 className="text-xl font-bold text-slate-900">Add Vendor</h2><button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Vendor Name *</label><input type="text" value={form.name||''} onChange={e => setForm({...form, name: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Type *</label><select value={form.type||''} onChange={e => setForm({...form, type: e.target.value as Vendor['type']})} className={inputCls}><option value="">Select</option>{["Airline","Trucking","Railways","Courier","Fleet"].map(t => <option key={t} value={t}>{t}</option>)}</select></div>
                  <div><label className="text-xs font-medium text-slate-500">Contact Person</label><input type="text" value={form.contactPerson||''} onChange={e => setForm({...form, contactPerson: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Email</label><input type="text" value={form.email||''} onChange={e => setForm({...form, email: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Phone</label><input type="text" value={form.phone||''} onChange={e => setForm({...form, phone: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">GSTIN</label><input type="text" value={form.gstin||''} onChange={e => setForm({...form, gstin: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">PAN</label><input type="text" value={form.panNo||''} onChange={e => setForm({...form, panNo: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Bank Name</label><input type="text" value={form.bankName||''} onChange={e => setForm({...form, bankName: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Bank Account</label><input type="text" value={form.bankAccount||''} onChange={e => setForm({...form, bankAccount: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">IFSC</label><input type="text" value={form.ifscCode||''} onChange={e => setForm({...form, ifscCode: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Contract Start</label><input type="date" value={form.contractStart||''} onChange={e => setForm({...form, contractStart: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Contract End</label><input type="date" value={form.contractEnd||''} onChange={e => setForm({...form, contractEnd: e.target.value})} className={inputCls} /></div>
                </div>
                <div className="col-span-2"><label className="text-xs font-medium text-slate-500">Address</label><input type="text" value={form.address||''} onChange={e => setForm({...form, address: e.target.value})} className={inputCls} /></div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3"><button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button><button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"><Check className="w-4 h-4 inline mr-1" />Add Vendor</button></div>
            </motion.div>
          </div>
        )}
        {viewVendor && !isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-xl shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200"><h2 className="text-xl font-bold text-slate-900">{viewVendor.name}</h2><button onClick={() => setViewVendor(null)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  {[['Type', viewVendor.type], ['Contact', viewVendor.contactPerson], ['Email', viewVendor.email], ['Phone', viewVendor.phone], ['GSTIN', viewVendor.gstin], ['PAN', viewVendor.panNo], ['Bank', `${viewVendor.bankName} | ${viewVendor.bankAccount}`], ['IFSC', viewVendor.ifscCode], ['Contract', `${viewVendor.contractStart} to ${viewVendor.contractEnd}`], ['Status', viewVendor.status]].map(([label, val]) => (
                    <div key={label as string} className="bg-white p-3 rounded-xl border border-blue-200"><div className="text-xs text-slate-500">{label}</div><div className="text-sm font-medium text-slate-900 mt-0.5">{val}</div></div>
                  ))}
                </div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end"><button onClick={() => setViewVendor(null)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium">Close</button></div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
