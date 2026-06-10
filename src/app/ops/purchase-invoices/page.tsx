"use client";
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PURCHASE_INVOICES, VENDORS, PurchaseInvoice, formatINR } from "@/data/mockData";
import { Receipt, Search, Plus, X, Check, Upload, Download, Eye, FileSpreadsheet, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

export default function PurchaseInvoicesPage() {
  const [invoices, setInvoices] = useState<PurchaseInvoice[]>(PURCHASE_INVOICES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isImportOpen, setIsImportOpen] = useState(false);
  const [viewInv, setViewInv] = useState<PurchaseInvoice | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  // Manual Form State
  const [form, setForm] = useState({
    vendorName: '', invoiceNo: '', date: '', dueDate: '',
    serviceType: 'Air Freight', awbDocketNo: '', origin: '', destination: '',
    weight: '', baseAmount: '', gstPercent: '18', currency: 'INR', paymentTerms: 'Net 30', remarks: ''
  });

  // Import State
  const [importRows, setImportRows] = useState<any[]>([]);
  const [isImportPreviewOpen, setIsImportPreviewOpen] = useState(false);

  const filtered = invoices.filter(inv => {
    const q = searchTerm.toLowerCase();
    return (inv.invoiceNo.toLowerCase().includes(q) || inv.vendorName.toLowerCase().includes(q)) && (statusFilter === "All" || inv.status === statusFilter);
  });

  const handleCreate = () => {
    if (!form.vendorName || !form.invoiceNo || !form.date || !form.baseAmount) {
      toast.error("Please fill all required fields");
      return;
    }
    const vendor = VENDORS.find(v => v.name === form.vendorName);
    
    const base = parseFloat(form.baseAmount) || 0;
    const gstPct = parseFloat(form.gstPercent) || 0;
    const gstAmt = (base * gstPct) / 100;
    const total = base + gstAmt;

    const duplicate = invoices.find(i => i.invoiceNo === form.invoiceNo && i.vendorName === form.vendorName);
    if (duplicate) {
      if (!window.confirm("Duplicate invoice detected for this vendor. Overwrite?")) return;
    }

    const ni: PurchaseInvoice = {
      id: `pi-${Date.now()}`,
      invoiceNo: form.invoiceNo,
      vendorId: vendor?.id || 'v-unknown',
      vendorName: form.vendorName,
      date: form.date,
      dueDate: form.dueDate,
      serviceType: form.serviceType,
      awbDocketNo: form.awbDocketNo,
      origin: form.origin,
      destination: form.destination,
      weight: parseFloat(form.weight) || 0,
      currency: form.currency,
      paymentTerms: form.paymentTerms,
      remarks: form.remarks,
      items: [{ description: form.serviceType, quantity: 1, rate: base, amount: base }],
      subtotal: base,
      gstPercent: gstPct,
      gst: gstAmt,
      total: total,
      status: 'Received',
      importSource: 'Manual'
    };
    
    if (duplicate) {
      setInvoices(prev => prev.map(i => i.id === duplicate.id ? ni : i));
    } else {
      setInvoices(prev => [ni, ...prev]);
    }
    toast.success(`Purchase invoice ${ni.invoiceNo} saved successfully`);
    setIsCreateOpen(false);
  };

  const handleDownloadTemplate = () => {
    toast.success("Downloading Excel template...");
    const headers = "Vendor Name,Invoice Number,Invoice Date,Service Type,AWB / Docket No.,Origin,Destination,Weight (Kg),Base Amount (INR),GST %,Currency,Payment Terms,Remarks\n";
    const sample = "IndiGo Cargo,INV-2026-0045,05/06/2026,Air Freight,6E-98765,DEL,BOM,120.5,5400,18,INR,Net 30,Express shipment";
    const blob = new Blob([headers + sample], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Purchase_Invoice_Import_Template.csv';
    a.click();
  };

  const simulateFileUpload = () => {
    toast.info("Reading file...");
    setTimeout(() => {
      // Mock validation results
      const rows = [
        { id: 1, vendorName: 'IndiGo Cargo Services', invoiceNo: 'INV-1001', date: '2026-06-05', base: 5400, gstPct: 18, valid: true, error: '' },
        { id: 2, vendorName: 'VRL Logistics Ltd', invoiceNo: 'INV-1002', date: '2026-06-06', base: 12000, gstPct: 12, valid: true, error: '' },
        { id: 3, vendorName: 'Unknown Vendor', invoiceNo: 'INV-1003', date: '06-05-2026', base: 8000, gstPct: 18, valid: false, error: 'Unrecognized Vendor; Invalid Date' }
      ];
      setImportRows(rows);
      setIsImportOpen(false);
      setIsImportPreviewOpen(true);
    }, 800);
  };

  const confirmImport = () => {
    const validRows = importRows.filter(r => r.valid);
    const newInvoices: PurchaseInvoice[] = validRows.map(r => ({
      id: `pi-imp-${Date.now()}-${r.id}`,
      invoiceNo: r.invoiceNo,
      vendorId: 'v-imp',
      vendorName: r.vendorName,
      date: r.date,
      dueDate: '',
      items: [{ description: 'Imported', quantity: 1, rate: r.base, amount: r.base }],
      subtotal: r.base,
      gstPercent: r.gstPct,
      gst: r.base * (r.gstPct / 100),
      total: r.base + (r.base * (r.gstPct / 100)),
      status: 'Received',
      importSource: 'Excel'
    }));

    setInvoices(prev => [...newInvoices, ...prev]);
    toast.success(`${validRows.length} invoices imported successfully.`);
    setIsImportPreviewOpen(false);
  };

  const updateStatus = (inv: PurchaseInvoice, status: PurchaseInvoice['status']) => {
    setInvoices(prev => prev.map(i => i.id === inv.id ? { ...i, status } : i));
    toast.success(`Invoice ${inv.invoiceNo} → ${status}`);
  };

  const statusColors: Record<string, string> = { Pending: 'bg-amber-500/10 text-amber-600 border-amber-500/20', Received: 'bg-amber-500/10 text-amber-600 border-amber-500/20', 'Under Review': 'bg-blue-500/10 text-blue-600 border-blue-500/20', Approved: 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20', Paid: 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20', Rejected: 'bg-red-500/10 text-red-600 border-red-500/20' };
  const inputCls = "w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Receipt className="w-6 h-6 text-indigo-500" /></motion.div>
            Purchase Invoices
          </h1>
          <p className="text-sm text-slate-500 mt-1">Manage vendor invoices, bulk imports, and approvals.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => setIsImportOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-900 rounded-lg text-sm font-medium border border-blue-200"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Upload className="w-4 h-4 text-slate-600" /></motion.div> Import Excel</button>
          <button onClick={() => { setIsCreateOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]"><motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 4, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }}><Plus className="w-4 h-4 text-white" /></motion.div> New Invoice</button>
        </div>
      </div>
      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)] card-3d">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-100/80">
          <div className="relative w-full sm:w-64"><Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 z-10 flex" /><input type="text" placeholder="Search invoices..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full bg-white border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 shadow-sm transition-shadow" /></div>
          <div className="flex items-center gap-2">{["All","Received","Under Review","Approved","Paid"].map(s => (<button key={s} onClick={() => setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${statusFilter === s ? "bg-indigo-500/20 text-indigo-600 border border-indigo-500/30" : "bg-slate-200 text-slate-500 border border-slate-300"}`}>{s}</button>))}</div>
        </div>
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead className="bg-white/90 sticky top-0 z-10 backdrop-blur-xl shadow-[0_4px_20px_-10px_rgba(0,0,0,0.1)] border-b-2 border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Invoice</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Vendor</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Source</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-500 uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filtered.map((inv, idx) => (
                <motion.tr key={inv.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: idx * 0.03 }} className="hover:bg-slate-50/80 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap"><div className="font-semibold text-slate-900 text-sm">{inv.invoiceNo}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-700">{inv.vendorName}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-600">{inv.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right"><div className="font-mono font-bold text-slate-900">{formatINR(inv.total)}</div><div className="text-xs text-slate-500">GST: {formatINR(inv.gst)}</div></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2 py-0.5 rounded text-xs font-medium ${inv.importSource === 'Excel' ? 'bg-purple-500/10 text-purple-600' : 'bg-slate-200 text-slate-600'}`}>{inv.importSource}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap"><span className={`px-2.5 py-1 rounded-full text-xs font-medium border ${statusColors[inv.status] || statusColors['Pending']}`}>{inv.status}</span></td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-1">
                    {(inv.status === 'Received' || inv.status === 'Pending') && <button onClick={() => updateStatus(inv, 'Under Review')} className="px-2.5 py-1.5 rounded-lg bg-blue-500/10 text-xs font-medium text-blue-600 hover:bg-blue-600 hover:text-white transition-all">Review</button>}
                    {inv.status === 'Under Review' && <button onClick={() => updateStatus(inv, 'Approved')} className="px-2.5 py-1.5 rounded-lg bg-emerald-500/10 text-xs font-medium text-emerald-600 hover:bg-emerald-600 hover:text-white transition-all">Approve</button>}
                    {inv.status === 'Approved' && <button onClick={() => updateStatus(inv, 'Paid')} className="px-2.5 py-1.5 rounded-lg bg-indigo-500/10 text-xs font-medium text-indigo-600 hover:bg-indigo-600 hover:text-white transition-all">Pay</button>}
                    <button onClick={() => setViewInv(inv)} className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all"><Eye className="w-3.5 h-3.5 inline" /></button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual Entry Modal */}
      <AnimatePresence>
        {isCreateOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-blue-200"><h2 className="text-xl font-bold text-slate-900">New Purchase Invoice</h2><button onClick={() => setIsCreateOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4 overflow-y-auto custom-scrollbar flex-1">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div><label className="text-xs font-medium text-slate-500">Vendor Name *</label><input list="vendors-list" type="text" value={form.vendorName} onChange={e => setForm({...form, vendorName: e.target.value})} className={inputCls} placeholder="Select or type vendor..." /><datalist id="vendors-list">{VENDORS.map(v => <option key={v.id} value={v.name} />)}</datalist></div>
                  <div><label className="text-xs font-medium text-slate-500">Invoice No *</label><input type="text" value={form.invoiceNo} onChange={e => setForm({...form, invoiceNo: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Invoice Date *</label><input type="date" value={form.date} onChange={e => setForm({...form, date: e.target.value})} className={inputCls} /></div>
                  
                  <div><label className="text-xs font-medium text-slate-500">Service Type</label><select value={form.serviceType} onChange={e => setForm({...form, serviceType: e.target.value})} className={inputCls}><option>Air Freight</option><option>Road</option><option>Train</option><option>Other</option></select></div>
                  <div><label className="text-xs font-medium text-slate-500">AWB / Docket No.</label><input type="text" value={form.awbDocketNo} onChange={e => setForm({...form, awbDocketNo: e.target.value})} className={inputCls} placeholder="Optional link" /></div>
                  <div><label className="text-xs font-medium text-slate-500">Weight (Kg)</label><input type="number" value={form.weight} onChange={e => setForm({...form, weight: e.target.value})} className={inputCls} /></div>

                  <div><label className="text-xs font-medium text-slate-500">Origin</label><input type="text" value={form.origin} onChange={e => setForm({...form, origin: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Destination</label><input type="text" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">Currency</label><select value={form.currency} onChange={e => setForm({...form, currency: e.target.value})} className={inputCls}><option>INR</option><option>USD</option></select></div>
                  
                  <div><label className="text-xs font-medium text-slate-500">Base Amount (Before GST) *</label><input type="number" value={form.baseAmount} onChange={e => setForm({...form, baseAmount: e.target.value})} className={inputCls} /></div>
                  <div><label className="text-xs font-medium text-slate-500">GST % *</label><select value={form.gstPercent} onChange={e => setForm({...form, gstPercent: e.target.value})} className={inputCls}><option value="0">0%</option><option value="5">5%</option><option value="12">12%</option><option value="18">18%</option></select></div>
                  <div><label className="text-xs font-medium text-slate-500">GST Amount (Auto)</label><input type="text" readOnly value={formatINR(((parseFloat(form.baseAmount)||0) * (parseFloat(form.gstPercent)||0))/100)} className={`${inputCls} bg-slate-100 font-mono text-slate-600`} /></div>

                  <div><label className="text-xs font-medium text-slate-500">Payment Terms</label><input type="text" value={form.paymentTerms} onChange={e => setForm({...form, paymentTerms: e.target.value})} className={inputCls} placeholder="e.g. Net 30" /></div>
                  <div className="md:col-span-2"><label className="text-xs font-medium text-slate-500">Remarks</label><input type="text" value={form.remarks} onChange={e => setForm({...form, remarks: e.target.value})} className={inputCls} /></div>
                </div>
                <div className="mt-4 p-4 bg-indigo-50 border border-indigo-100 rounded-xl flex justify-between items-center">
                  <span className="text-sm font-semibold text-indigo-900">Total Amount</span>
                  <span className="text-2xl font-bold font-mono text-indigo-600">
                    {formatINR((parseFloat(form.baseAmount)||0) + (((parseFloat(form.baseAmount)||0) * (parseFloat(form.gstPercent)||0))/100))}
                  </span>
                </div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-end gap-3"><button onClick={() => setIsCreateOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button><button onClick={handleCreate} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium shadow-md transition-colors"><Check className="w-4 h-4 inline mr-1" />Save Invoice</button></div>
            </motion.div>
          </div>
        )}

        {/* Bulk Import Step 1 & 3 Modal */}
        {isImportOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200"><h2 className="text-xl font-bold text-slate-900 flex items-center gap-2"><FileSpreadsheet className="w-5 h-5 text-emerald-600" />Bulk Excel Import</h2><button onClick={() => setIsImportOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button></div>
              <div className="p-6 space-y-4">
                <button onClick={handleDownloadTemplate} className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white border border-blue-200 text-sm font-medium text-slate-700 hover:border-indigo-500 hover:text-indigo-600 transition-colors shadow-sm">
                  <Download className="w-4 h-4" /> Download Template
                </button>
                <div className="relative flex items-center py-2">
                  <div className="flex-grow border-t border-slate-300"></div>
                  <span className="flex-shrink-0 mx-4 text-xs text-slate-400 font-medium uppercase tracking-wider">Step 2: Upload</span>
                  <div className="flex-grow border-t border-slate-300"></div>
                </div>
                <div className="border-2 border-dashed border-blue-300 rounded-xl p-8 text-center bg-white hover:border-indigo-500 hover:bg-indigo-50/50 transition-colors cursor-pointer" onClick={() => fileRef.current?.click()}>
                  <Upload className="w-10 h-10 mx-auto mb-3 text-slate-400" />
                  <p className="text-sm font-medium text-slate-700">Click to upload completed template</p>
                  <p className="text-xs text-slate-500 mt-1">Supports .xlsx, .csv (Max 10MB)</p>
                  <input ref={fileRef} type="file" accept=".xlsx,.csv" className="hidden" onChange={simulateFileUpload} />
                </div>
              </div>
            </motion.div>
          </div>
        )}

        {/* Validation Preview Modal (Step 4 & 5) */}
        {isImportPreviewOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-slate-100 border border-blue-200 rounded-2xl w-full max-w-4xl shadow-2xl flex flex-col max-h-[90vh]">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">Validation Preview</h2>
                  <p className="text-sm text-slate-500 mt-1">Review your rows before confirming the import. Invalid rows will be skipped.</p>
                </div>
                <button onClick={() => setIsImportPreviewOpen(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 overflow-auto custom-scrollbar flex-1 bg-white">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="border-b border-blue-200">
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500">Status</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500">Vendor</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500">Invoice No</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500">Date</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500 text-right">Base Amt</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500 text-right">GST %</th>
                      <th className="py-2 px-3 text-xs font-semibold text-slate-500">Errors</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {importRows.map((r, i) => (
                      <tr key={i} className={r.valid ? '' : 'bg-red-50/50'}>
                        <td className="py-3 px-3">
                          {r.valid ? <span className="text-emerald-600 flex items-center gap-1 text-xs font-medium"><Check className="w-3 h-3"/> Valid</span> : <span className="text-red-600 flex items-center gap-1 text-xs font-medium"><AlertTriangle className="w-3 h-3"/> Error</span>}
                        </td>
                        <td className="py-3 px-3 text-sm text-slate-900">{r.vendorName}</td>
                        <td className="py-3 px-3 text-sm text-slate-700">{r.invoiceNo}</td>
                        <td className="py-3 px-3 text-sm text-slate-700">{r.date}</td>
                        <td className="py-3 px-3 text-sm font-mono text-slate-900 text-right">{r.base}</td>
                        <td className="py-3 px-3 text-sm font-mono text-slate-700 text-right">{r.gstPct}%</td>
                        <td className="py-3 px-3 text-xs text-red-600 font-medium">{r.error}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-200/30 flex justify-between items-center">
                <span className="text-sm font-medium text-slate-600">Valid rows: {importRows.filter(r => r.valid).length} / {importRows.length}</span>
                <div className="flex gap-3">
                  <button onClick={() => setIsImportPreviewOpen(false)} className="px-4 py-2 text-sm text-slate-600 hover:text-slate-900">Cancel</button>
                  <button onClick={confirmImport} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg text-sm font-medium shadow-md transition-colors flex items-center gap-2"><Check className="w-4 h-4" />Confirm Import</button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
