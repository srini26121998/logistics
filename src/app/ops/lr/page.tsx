"use client";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { LORRY_RECEIPTS, LorryReceipt, formatINR } from "@/data/mockData";
import { FileText, Search, Plus, Filter, Download, Edit, Trash2, Eye, ChevronLeft, ChevronRight, CheckCircle, Clock, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function LRManagementPage() {
  const [lrs, setLrs] = useState<LorryReceipt[]>(LORRY_RECEIPTS ?? []);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [editingLr, setEditingLr] = useState<LorryReceipt | null>(null);
  const [viewLr, setViewLr] = useState<LorryReceipt | null>(null);

  const emptyLr: Omit<LorryReceipt, 'id' | 'lrNumber' | 'createdAt' | 'updatedAt'> = {
    date: new Date().toISOString().split('T')[0], consignor: '', consignorAddress: '', consignorPhone: '', consignorEmail: '',
    consignee: '', consigneeAddress: '', consigneePhone: '', consigneeEmail: '',
    origin: '', destination: '', weight: 0, dimensions: '', declaredValue: 0, commodity: '', pieces: 0, status: 'Pending'
  };
  const [form, setForm] = useState(emptyLr);

  const filtered = lrs.filter(lr => {
    const q = searchTerm.toLowerCase();
    const match = lr.lrNumber.toLowerCase().includes(q) || lr.consignor.toLowerCase().includes(q) || lr.consignee.toLowerCase().includes(q) || lr.origin.toLowerCase().includes(q) || lr.destination.toLowerCase().includes(q);
    const statusMatch = statusFilter === "All" || lr.status === statusFilter;
    return match && statusMatch;
  });

  const generateLrNumber = () => {
    const d = new Date(); const ds = `${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, '0')}${String(d.getDate()).padStart(2, '0')}`;
    const seq = String(lrs.length + 1).padStart(4, '0');
    return `LR-${ds}-${seq}`;
  };

  const handleSave = () => {
    if (!form.consignor || !form.consignee || !form.origin || !form.destination) {
      toast.error("Please fill in all required fields"); return;
    }
    const now = new Date().toISOString();
    if (editingLr) {
      const updated = { ...editingLr, ...form, updatedAt: now };
      setLrs(prev => prev.map(l => l.id === editingLr.id ? updated : l));
      toast.success(`LR ${editingLr.lrNumber} updated`);
    } else {
      const newLr: LorryReceipt = { id: `lr-${Date.now()}`, lrNumber: generateLrNumber(), ...form, createdAt: now, updatedAt: now };
      setLrs(prev => [newLr, ...prev]);
      toast.success(`LR ${newLr.lrNumber} created`);
    }
    setIsCreateOpen(false); setEditingLr(null); setForm(emptyLr);
  };

  const handleDelete = (lr: LorryReceipt) => {
    setLrs(prev => prev.filter(l => l.id !== lr.id));
    toast.success(`LR ${lr.lrNumber} deleted`);
  };

  const toggleReady = (lr: LorryReceipt) => {
    if (lr.status === 'Pending') {
      if (!lr.consignor || !lr.consignee || !lr.origin || !lr.destination || !lr.weight || !lr.pieces) {
        toast.error("All required fields must be filled before marking Ready"); return;
      }
      const updated = { ...lr, status: 'Ready' as const, updatedAt: new Date().toISOString() };
      setLrs(prev => prev.map(l => l.id === lr.id ? updated : l));
      toast.success(`LR ${lr.lrNumber} marked as Ready`);
    } else {
      const updated = { ...lr, status: 'Pending' as const, updatedAt: new Date().toISOString() };
      setLrs(prev => prev.map(l => l.id === lr.id ? updated : l));
      toast.info(`LR ${lr.lrNumber} reverted to Pending`);
    }
  };

  const openEdit = (lr: LorryReceipt) => {
    setEditingLr(lr);
    setForm({ date: lr.date, consignor: lr.consignor, consignorAddress: lr.consignorAddress, consignorPhone: lr.consignorPhone, consignorEmail: lr.consignorEmail, consignee: lr.consignee, consigneeAddress: lr.consigneeAddress, consigneePhone: lr.consigneePhone, consigneeEmail: lr.consigneeEmail, origin: lr.origin, destination: lr.destination, weight: lr.weight, dimensions: lr.dimensions, declaredValue: lr.declaredValue, commodity: lr.commodity, pieces: lr.pieces, status: lr.status });
    setIsCreateOpen(true);
  };

  const viewIdx = viewLr ? filtered.findIndex(l => l.id === viewLr.id) : -1;
  const navView = (dir: number) => { const ni = viewIdx + dir; if (ni >= 0 && ni < filtered.length) setViewLr(filtered[ni]); };

  const exportCSV = () => {
    const h = ["LR Number", "Date", "Consignor", "Consignee", "Origin", "Destination", "Pieces", "Weight", "Commodity", "Status"];
    const csv = "data:text/csv;charset=utf-8," + h.join(",") + "\n" + filtered.map(l => `${l.lrNumber},${l.date},"${l.consignor}","${l.consignee}",${l.origin},${l.destination},${l.pieces},${l.weight},"${l.commodity}",${l.status}`).join("\n");
    const link = document.createElement("a"); link.setAttribute("href", encodeURI(csv)); link.setAttribute("download", `lr_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link); link.click(); document.body.removeChild(link); toast.success("LR data exported");
  };

  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><FileText className="w-6 h-6 text-indigo-500" /></motion.div>
            LR Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Create, manage, and track Lorry Receipts.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200"><Download className="w-4 h-4" /> Export</button>
          <button onClick={() => { setEditingLr(null); setForm(emptyLr); setIsCreateOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"><Plus className="w-4 h-4" /> New LR</button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" /><input type="text" placeholder="Search LR, consignor, city..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" /></div>
          <div className="flex items-center gap-2">
            {["All", "Pending", "Ready"].map(s => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30" : "bg-slate-200 text-slate-500 border border-slate-300"}`}>{s}</button>))}
          </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white/90 sticky top-0 z-10 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">LR Number</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Consignor / Consignee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Route</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Cargo</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filtered.map((lr, idx) => (
                <motion.tr key={lr.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-200/30 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-semibold text-slate-900 text-sm">{lr.lrNumber}</div>
                    <div className="text-xs text-slate-500 mt-0.5">{lr.date}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 font-medium">{lr.consignor}</div>
                    <div className="text-xs text-slate-500">→ {lr.consignee}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-600 text-sm">{lr.origin}</span><span className="text-slate-600 mx-1">→</span><span className="font-semibold text-slate-600 text-sm">{lr.destination}</span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">{lr.pieces} pcs | {lr.weight} kg</div>
                    <div className="text-xs text-slate-500">{lr.commodity}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button onClick={() => toggleReady(lr)} className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border cursor-pointer transition-all ${lr.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20 hover:bg-emerald-500/20' : 'bg-amber-500/10 text-amber-600 border-amber-500/20 hover:bg-amber-500/20'}`}>
                      {lr.status === 'Ready' ? <CheckCircle className="w-3.5 h-3.5" /> : <Clock className="w-3.5 h-3.5" />}{lr.status}
                    </button>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                    <button onClick={() => setViewLr(lr)} className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all"><Eye className="w-3.5 h-3.5 inline" /></button>
                    <button onClick={() => openEdit(lr)} className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all"><Edit className="w-3.5 h-3.5 inline" /></button>
                    <button onClick={() => handleDelete(lr)} className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white transition-all"><Trash2 className="w-3.5 h-3.5 inline" /></button>
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && (<tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><FileText className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p className="text-base font-medium">No LRs found</p></td></tr>)}
            </tbody>
          </table>
        </div>
      </div>

      {/* Create/Edit Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-xl font-bold text-slate-900">{editingLr ? `Edit ${editingLr.lrNumber}` : 'Create New LR'}</h2>
                <button onClick={() => { setIsCreateOpen(false); setEditingLr(null); }} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Consignor *</label><input type="text" value={form.consignor} onChange={e => setForm({ ...form, consignor: e.target.value })} className={inputCls} placeholder="Sender name" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Consignee *</label><input type="text" value={form.consignee} onChange={e => setForm({ ...form, consignee: e.target.value })} className={inputCls} placeholder="Receiver name" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Consignor Phone</label><input type="text" value={form.consignorPhone} onChange={e => setForm({ ...form, consignorPhone: e.target.value })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Consignee Phone</label><input type="text" value={form.consigneePhone} onChange={e => setForm({ ...form, consigneePhone: e.target.value })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Consignor Email</label><input type="text" value={form.consignorEmail} onChange={e => setForm({ ...form, consignorEmail: e.target.value })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Consignee Email</label><input type="text" value={form.consigneeEmail} onChange={e => setForm({ ...form, consigneeEmail: e.target.value })} className={inputCls} /></div>
                  <div className="col-span-2"><label className="text-xs font-medium text-slate-500">Consignor Address</label><input type="text" value={form.consignorAddress} onChange={e => setForm({ ...form, consignorAddress: e.target.value })} className={inputCls} /></div>
                  <div className="col-span-2"><label className="text-xs font-medium text-slate-500">Consignee Address</label><input type="text" value={form.consigneeAddress} onChange={e => setForm({ ...form, consigneeAddress: e.target.value })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Origin *</label><input type="text" value={form.origin} onChange={e => setForm({ ...form, origin: e.target.value.toUpperCase() })} className={inputCls} placeholder="e.g. DEL" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Destination *</label><input type="text" value={form.destination} onChange={e => setForm({ ...form, destination: e.target.value.toUpperCase() })} className={inputCls} placeholder="e.g. BOM" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Pieces *</label><input type="number" value={form.pieces || ''} onChange={e => setForm({ ...form, pieces: Number(e.target.value) })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Weight (kg) *</label><input type="number" value={form.weight || ''} onChange={e => setForm({ ...form, weight: Number(e.target.value) })} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Dimensions</label><input type="text" value={form.dimensions} onChange={e => setForm({ ...form, dimensions: e.target.value })} className={inputCls} placeholder="e.g. 60x40x30 cm" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Declared Value (₹)</label><input type="number" value={form.declaredValue || ''} onChange={e => setForm({ ...form, declaredValue: Number(e.target.value) })} className={inputCls} /></div>
                  <div className="col-span-2"><label className="text-xs font-medium text-slate-500">Commodity *</label><input type="text" value={form.commodity} onChange={e => setForm({ ...form, commodity: e.target.value })} className={inputCls} placeholder="e.g. Electronics" /></div>
                </div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3">
                <button onClick={() => { setIsCreateOpen(false); setEditingLr(null); }} className="px-4 py-2 text-sm font-medium text-slate-600">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" />{editingLr ? 'Update LR' : 'Create LR'}</button>
              </div>
            </motion.div>
          </div>
        )}

        {/* View Detail Modal */}
        {viewLr && !isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900">{viewLr.lrNumber}</h2>
                  <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium mt-1 ${viewLr.status === 'Ready' ? 'bg-emerald-500/10 text-emerald-600' : 'bg-amber-500/10 text-amber-600'}`}>{viewLr.status}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => navView(-1)} disabled={viewIdx <= 0} className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30"><ChevronLeft className="w-4 h-4" /></button>
                  <span className="text-xs text-slate-500">{viewIdx + 1}/{filtered.length}</span>
                  <button onClick={() => navView(1)} disabled={viewIdx >= filtered.length - 1} className="p-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 disabled:opacity-30"><ChevronRight className="w-4 h-4" /></button>
                  <button onClick={() => setViewLr(null)} className="text-slate-500 hover:text-indigo-600 ml-2"><X className="w-5 h-5" /></button>
                </div>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-4 rounded-xl border border-blue-200"><div className="text-xs text-slate-500 font-medium">Consignor</div><div className="text-sm font-semibold text-slate-900 mt-1">{viewLr.consignor}</div><div className="text-xs text-slate-500 mt-0.5">{viewLr.consignorPhone}</div><div className="text-xs text-slate-500">{viewLr.consignorAddress}</div></div>
                  <div className="bg-white p-4 rounded-xl border border-blue-200"><div className="text-xs text-slate-500 font-medium">Consignee</div><div className="text-sm font-semibold text-slate-900 mt-1">{viewLr.consignee}</div><div className="text-xs text-slate-500 mt-0.5">{viewLr.consigneePhone}</div><div className="text-xs text-slate-500">{viewLr.consigneeAddress}</div></div>
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-blue-200 text-center"><div className="text-xs text-slate-500">Route</div><div className="text-sm font-bold text-slate-900 mt-1">{viewLr.origin} → {viewLr.destination}</div></div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200 text-center"><div className="text-xs text-slate-500">Pieces</div><div className="text-sm font-bold text-slate-900 mt-1">{viewLr.pieces}</div></div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200 text-center"><div className="text-xs text-slate-500">Weight</div><div className="text-sm font-bold text-slate-900 mt-1">{viewLr.weight} kg</div></div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200 text-center"><div className="text-xs text-slate-500">Value</div><div className="text-sm font-bold text-slate-900 mt-1">{formatINR(viewLr.declaredValue)}</div></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white p-3 rounded-xl border border-blue-200"><div className="text-xs text-slate-500">Commodity</div><div className="text-sm font-semibold text-slate-900 mt-1">{viewLr.commodity}</div></div>
                  <div className="bg-white p-3 rounded-xl border border-blue-200"><div className="text-xs text-slate-500">Dimensions</div><div className="text-sm font-semibold text-slate-900 mt-1">{viewLr.dimensions || 'N/A'}</div></div>
                </div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-between">
                <button onClick={() => toggleReady(viewLr)} className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 ${viewLr.status === 'Pending' ? 'bg-emerald-600 text-white hover:bg-emerald-500' : 'bg-amber-500 text-white hover:bg-amber-400'}`}>
                  {viewLr.status === 'Pending' ? <><CheckCircle className="w-4 h-4" /> Mark as Ready</> : <><Clock className="w-4 h-4" /> Revert to Pending</>}
                </button>
                <button onClick={() => { openEdit(viewLr); setViewLr(null); }} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Edit className="w-4 h-4" /> Edit LR</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
