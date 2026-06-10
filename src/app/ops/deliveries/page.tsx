"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DELIVERIES, Delivery } from "@/data/mockData";
import { CheckCircle, Search, Plus, X, Check, MapPin, Camera, Pen, Clock, AlertTriangle, RotateCcw, Eye } from "lucide-react";
import { toast } from "sonner";

export default function DeliveriesPage() {
  const [deliveries, setDeliveries] = useState<Delivery[]>(DELIVERIES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [podModal, setPodModal] = useState<Delivery | null>(null);
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [podForm, setPodForm] = useState({ receiverName: '', signature: '' });
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);

  const [form, setForm] = useState({ lrId: '', bookingId: '', awbNumber: '', consigneeName: '', deliveryAddress: '', deliveryAgent: '', deliveryAgentPhone: '', scheduledDate: '', notes: '' });

  const filtered = deliveries.filter(d => {
    const q = searchTerm.toLowerCase();
    const match = d.deliveryNo.toLowerCase().includes(q) || d.consigneeName.toLowerCase().includes(q) || d.deliveryAgent.toLowerCase().includes(q);
    return match && (statusFilter === "All" || d.status === statusFilter);
  });

  const handleCreate = () => {
    if (!form.consigneeName || !form.deliveryAgent) { toast.error("Fill required fields"); return; }
    const d = new Date(); const ds = `${d.getFullYear()}${String(d.getMonth()+1).padStart(2,'0')}${String(d.getDate()).padStart(2,'0')}`;
    const newDel: Delivery = { id: `del-${Date.now()}`, deliveryNo: `DEL-${ds}-${String(deliveries.length+1).padStart(4,'0')}`, ...form, status: 'Out for Delivery', notes: form.notes };
    setDeliveries(prev => [newDel, ...prev]);
    toast.success(`Delivery ${newDel.deliveryNo} created`);
    setIsCreateOpen(false);
  };

  const confirmDelivery = (del: Delivery) => {
    if (!podForm.receiverName) { toast.error("Receiver name required"); return; }
    const canvas = canvasRef.current;
    const sig = canvas ? canvas.toDataURL() : '';
    const now = new Date();
    const updated: Delivery = { ...del, status: 'Delivered', deliveredDate: now.toISOString().split('T')[0], podTimestamp: now.toISOString(), podReceiverName: podForm.receiverName, podSignature: sig, podGeoLat: 12.97 + Math.random() * 0.05, podGeoLng: 77.59 + Math.random() * 0.05 };
    setDeliveries(prev => prev.map(d => d.id === del.id ? updated : d));
    toast.success(`Delivery ${del.deliveryNo} confirmed with POD`);
    setPodModal(null);
  };

  const markFailed = (del: Delivery, reason: string) => {
    const updated: Delivery = { ...del, status: 'Failed', failureReason: reason };
    setDeliveries(prev => prev.map(d => d.id === del.id ? updated : d));
    toast.error(`Delivery ${del.deliveryNo} marked as Failed`);
  };

  const markRTO = (del: Delivery) => {
    const updated: Delivery = { ...del, status: 'RTO', rtoReason: 'Return to Origin requested' };
    setDeliveries(prev => prev.map(d => d.id === del.id ? updated : d));
    toast.info(`Delivery ${del.deliveryNo} → RTO`);
  };

  // Canvas drawing
  const startDraw = (e: React.MouseEvent<HTMLCanvasElement>) => { setIsDrawing(true); const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.beginPath(); ctx.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); } };
  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => { if (!isDrawing) return; const ctx = canvasRef.current?.getContext('2d'); if (ctx) { ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.strokeStyle = '#1e293b'; ctx.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY); ctx.stroke(); } };
  const stopDraw = () => setIsDrawing(false);
  const clearCanvas = () => { const ctx = canvasRef.current?.getContext('2d'); if (ctx && canvasRef.current) ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height); };

  const statusColors: Record<string, string> = { 'Out for Delivery': 'bg-blue-500/10 text-blue-600 border-blue-500/20', 'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', 'Attempted': 'bg-amber-500/10 text-amber-600 border-amber-500/20', 'Failed': 'bg-red-500/10 text-red-600 border-red-500/20', 'RTO': 'bg-purple-500/10 text-purple-600 border-purple-500/20' };
  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><CheckCircle className="w-6 h-6 text-indigo-500" /></motion.div>
            Delivery & POD Management
          </h1>
          <p className="text-sm text-slate-500 mt-1">Track deliveries and capture proof of delivery.</p>
        </div>
        <button onClick={() => setIsCreateOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Plus className="w-4 h-4 text-white" /></motion.div> New Delivery</button>
      </div>

      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 flex"><Search className="w-4 h-4" /></motion.div><input type="text" placeholder="Search deliveries..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm transition-shadow" /></div>
          <div className="flex items-center gap-2 overflow-x-auto">
            {["All", "Out for Delivery", "Delivered", "Attempted", "Failed", "RTO"].map(s => (<button key={s} onClick={() => setStatusFilter(s)} className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${statusFilter === s ? "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30" : "bg-slate-200 text-slate-500 border border-slate-300"}`}>{s}</button>))}
          </div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-white/90 sticky top-0 z-10 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Delivery No.</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Consignee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Agent</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Date</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filtered.map((del, idx) => (
                <motion.tr key={del.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-slate-900 text-sm">{del.deliveryNo}</div><div className="text-xs text-slate-500 font-mono">{del.awbNumber || del.lrId}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><div className="text-sm text-slate-700 font-medium">{del.consigneeName}</div><div className="text-xs text-slate-500 truncate max-w-[200px]">{del.deliveryAddress}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{del.deliveryAgent}<div className="text-xs text-slate-500">{del.deliveryAgentPhone}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{del.scheduledDate}{del.deliveredDate && <div className="text-xs text-emerald-600">✓ {del.deliveredDate}</div>}</td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[del.status]}`}>{del.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                    {del.status === 'Out for Delivery' && (
                      <>
                        <button onClick={() => { setPodModal(del); setPodForm({ receiverName: '', signature: '' }); }} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-emerald-600 text-xs font-medium text-white hover:bg-emerald-500 transition-all"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Camera className="w-3 h-3" /></motion.div>Capture POD</button>
                        <button onClick={() => markFailed(del, 'Consignee unavailable')} className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-red-600 hover:bg-red-600 hover:text-white transition-all"><AlertTriangle className="w-3 h-3" />Fail</button>
                      </>
                    )}
                    {del.status === 'Attempted' && <button onClick={() => markRTO(del)} className="px-2.5 py-1.5 rounded-lg bg-purple-500/10 text-xs font-medium text-purple-600 hover:bg-purple-600 hover:text-white transition-all">RTO</button>}
                    {del.status === 'Delivered' && <span className="text-xs text-emerald-600 font-medium">POD ✓</span>}
                  </td>
                </motion.tr>
              ))}
              {filtered.length === 0 && <tr><td colSpan={6} className="px-6 py-12 text-center text-slate-500"><CheckCircle className="w-12 h-12 mx-auto mb-4 text-slate-600" /><p>No deliveries found</p></td></tr>}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {/* POD Capture Modal */}
        {podModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><Pen className="w-5 h-5 text-indigo-600" /> Capture POD</h2>
                <button onClick={() => setPodModal(null)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="bg-white p-3 rounded-xl border border-blue-200">
                  <div className="text-xs text-slate-500">Delivery</div>
                  <div className="font-bold text-slate-900">{podModal.deliveryNo} — {podModal.consigneeName}</div>
                  <div className="text-xs text-slate-500 mt-1">{podModal.deliveryAddress}</div>
                </div>
                <div><label className="text-xs font-medium text-slate-500">Receiver Name *</label><input type="text" value={podForm.receiverName} onChange={e => setPodForm({...podForm, receiverName: e.target.value})} className={inputCls} placeholder="Name of person receiving" /></div>
                <div>
                  <div className="flex justify-between items-center mb-1"><label className="text-xs font-medium text-slate-500">Digital Signature</label><button onClick={clearCanvas} className="text-xs text-indigo-600 hover:underline">Clear</button></div>
                  <canvas ref={canvasRef} width={440} height={150} onMouseDown={startDraw} onMouseMove={draw} onMouseUp={stopDraw} onMouseLeave={stopDraw} className="w-full h-[150px] bg-white border-2 border-dashed border-blue-200 rounded-xl cursor-crosshair" />
                </div>
                <div className="flex items-center gap-2 text-xs text-slate-500"><MapPin className="w-3.5 h-3.5" /><span>Geo-location will be auto-captured</span></div>
                <div className="flex items-center gap-2 text-xs text-slate-500"><Clock className="w-3.5 h-3.5" /><span>Timestamp: {new Date().toLocaleString()}</span></div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3">
                <button onClick={() => setPodModal(null)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button onClick={() => confirmDelivery(podModal)} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><Check className="w-4 h-4" /> Confirm Delivery</button>
              </div>
            </motion.div>
          </div>
        )}
        {/* Create Modal */}
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-lg shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200"><h2 className="text-xl font-bold text-slate-900">New Delivery</h2><button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Consignee *</label><input type="text" value={form.consigneeName} onChange={e => setForm({...form, consigneeName: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Delivery Agent *</label><input type="text" value={form.deliveryAgent} onChange={e => setForm({...form, deliveryAgent: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Agent Phone</label><input type="text" value={form.deliveryAgentPhone} onChange={e => setForm({...form, deliveryAgentPhone: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Date</label><input type="date" value={form.scheduledDate} onChange={e => setForm({...form, scheduledDate: e.target.value})} className={inputCls} /></div>
                </div>
                <div><label className="text-xs font-medium text-slate-500">Delivery Address</label><input type="text" value={form.deliveryAddress} onChange={e => setForm({...form, deliveryAddress: e.target.value})} className={inputCls} /></div>
                <div><label className="text-xs font-medium text-slate-500">AWB Number</label><input type="text" value={form.awbNumber} onChange={e => setForm({...form, awbNumber: e.target.value})} className={inputCls} /></div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3">
                <button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium"><Check className="w-4 h-4 inline mr-1" />Create</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
