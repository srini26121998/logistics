"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar, CheckSquare, ChevronDown, Download, Eye, Mail, Send, Square, Building, 
  FileText, Search, Filter, X, Loader2, FileSpreadsheet, Printer, QrCode, Sparkles, 
  MoreHorizontal, PieChart, FileDigit, TrendingUp, Receipt, ShieldCheck, FileIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { INVOICES } from "@/data/mockData";
import AirWaybillPreview from "@/components/ui/AirWaybillPreview";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

// Mock Data
const CLIENTS = [
  { id: "c1", name: "OXEN Logistics Pvt Ltd", gstin: "33AABCO1234F1Z5", stateCode: "33", email: "billing@oxen.com", creditLimit: 500000, currentOutstanding: 125000 },
  { id: "c2", name: "Acme Corp Logistics", gstin: "27AADCA1122Q1Z9", stateCode: "27", email: "accounts@acme.com", creditLimit: 1000000, currentOutstanding: 450000 },
];

const COMPLETED_AWBS = [
  { id: "1", cnDate: "10-Oct-26", cnNo: "125-98765432", flight: "6E-1234", origin: "DEL", dest: "BOM", nop: 45, chWt: 1250, rate: 45, freight: 56250, otherCharges: 2500, status: "Ready" },
  { id: "2", cnDate: "11-Oct-26", cnNo: "125-98765433", flight: "6E-5544", origin: "DEL", dest: "BLR", nop: 12, chWt: 340, rate: 50, freight: 17000, otherCharges: 1000, status: "Ready" },
  { id: "3", cnDate: "12-Oct-26", cnNo: "125-98765434", flight: "UK-998", origin: "DEL", dest: "HYD", nop: 8, chWt: 150, rate: 48, freight: 7200, otherCharges: 500, status: "Review" },
  { id: "4", cnDate: "12-Oct-26", cnNo: "125-98765435", flight: "UK-999", origin: "DEL", dest: "MAA", nop: 100, chWt: 2100, rate: 42, freight: 88200, otherCharges: 4500, status: "Ready" },
  { id: "5", cnDate: "13-Oct-26", cnNo: "125-98765436", flight: "QP-112", origin: "DEL", dest: "CCU", nop: 25, chWt: 600, rate: 46, freight: 27600, otherCharges: 1200, status: "Ready" },
  { id: "6", cnDate: "13-Oct-26", cnNo: "125-98765437", flight: "6E-8899", origin: "DEL", dest: "PNQ", nop: 50, chWt: 850, rate: 44, freight: 37400, otherCharges: 1500, status: "Ready" },
];

export default function GenerateInvoicePage() {
  const router = useRouter();
  const [selectedClient, setSelectedClient] = useState(CLIENTS[0]);
  const [selectedAwbs, setSelectedAwbs] = useState<string[]>(COMPLETED_AWBS.map((a) => a.id));
  const [showPreviewModal, setShowPreviewModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState("This Month");
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);

  const [showAwbCopyModal, setShowAwbCopyModal] = useState(false);
  const [selectedAwbDetails, setSelectedAwbDetails] = useState<any>(null);

  const [isDownloading, setIsDownloading] = useState(false);
  const [isEmailing, setIsEmailing] = useState(false);
  const [isMarkingSent, setIsMarkingSent] = useState(false);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);

  const filteredAwbs = COMPLETED_AWBS.filter(awb => 
    awb.cnNo.includes(searchQuery) || 
    awb.flight.toLowerCase().includes(searchQuery.toLowerCase()) ||
    awb.dest.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectAll = () => {
    if (selectedAwbs.length === filteredAwbs.length) {
      setSelectedAwbs([]);
    } else {
      setSelectedAwbs(filteredAwbs.map((a) => a.id));
    }
  };

  const handleAutoMatch = () => {
    // Select all AWBs that have a "Ready" status
    const readyIds = filteredAwbs.filter(a => a.status === 'Ready').map(a => a.id);
    setSelectedAwbs(readyIds);
    toast.success(`Auto-matched ${readyIds.length} ready shipments`);
  };

  const toggleAwb = (id: string) => {
    if (selectedAwbs.includes(id)) {
      setSelectedAwbs(selectedAwbs.filter((a) => a !== id));
    } else {
      setSelectedAwbs([...selectedAwbs, id]);
    }
  };

  const simulateAction = (action: Function, delay: number = 1500) => {
    setTimeout(action, delay);
  };

  const handleDownload = async (format: 'pdf' | 'csv' | 'excel' = 'pdf') => {
    if (selectedAwbs.length === 0) {
      toast.error("Please select at least one AWB.");
      return;
    }
    setExportMenuOpen(false);

    if (format === 'pdf') {
      const element = document.getElementById("invoice-print-area");
      if (!element) {
        toast.error("Please open the preview first to generate PDF");
        return;
      }
      const toastId = toast.loading("Generating PDF...");
      try {
        const imgData = await toPng(element, { pixelRatio: 2 });
        const pdf = new jsPDF("p", "mm", "a4");
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
        
        pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
        pdf.save(`Invoice_${selectedClient.name.replace(/\s+/g, '_')}.pdf`);
        toast.success("PDF Downloaded successfully", { id: toastId });
      } catch (error) {
        console.error(error);
        toast.error("Failed to generate PDF", { id: toastId });
      }
    } else {
      // CSV Export
      const headers = ["AWB No", "Date", "Flight", "Origin", "Destination", "Pieces", "Weight", "Rate", "Freight", "Other Charges", "Total"];
      const csvContent = [
        headers.join(","),
        ...selectedItems.map(item => 
          `"${item.cnNo}","${item.cnDate}","${item.flight}","${item.origin}","${item.dest}",${item.nop},${item.chWt},${item.rate},${item.freight},${item.otherCharges},${item.freight + item.otherCharges}`
        ),
        `"TOTAL","","","","","","",${totals.freight},${totals.otherCharges},${totals.taxableAmount}`
      ].join("\n");
      
      const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `Invoice_Data_${selectedClient.name.replace(/\s+/g, '_')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success(`${format.toUpperCase()} Exported successfully`);
    }
  };

  const handleEmail = () => {
    if (selectedAwbs.length === 0) {
      toast.error("Please select at least one AWB.");
      return;
    }
    setIsEmailing(true);
    toast.info(`Sending invoice to ${selectedClient.email}...`);
    simulateAction(() => {
      setIsEmailing(false);
      toast.success("Invoice emailed successfully!");
    }, 2000);
  };

  const handleMarkAsSent = () => {
    if (selectedAwbs.length === 0) {
      toast.error("Please select at least one AWB.");
      return;
    }
    setIsMarkingSent(true);
    toast.info("Updating system records...");
    simulateAction(() => {
      // Create the new dynamic invoice
      const newInvoiceId = `inv-${Date.now()}`;
      const newInvoiceNo = `SVL/${Math.floor(Math.random() * 900) + 100}/26-27`;
      
      const newInvoice = {
        id: newInvoiceId,
        invoiceNo: newInvoiceNo,
        clientId: selectedClient.id,
        clientName: selectedClient.name,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        awbCount: selectedAwbs.length,
        taxableAmount: totals.taxableAmount,
        gst: igst,
        total: netPayable,
        status: 'Sent' as const,
        paidAmount: 0
      };

      INVOICES.unshift(newInvoice);
      sessionStorage.setItem('new_invoice_id', newInvoiceId);

      setIsMarkingSent(false);
      toast.success("Invoice marked as sent and logged in system");
      router.push("/ops/invoices");
    }, 1500);
  };

  const selectedItems = COMPLETED_AWBS.filter((a) => selectedAwbs.includes(a.id));

  // Calculations
  const totals = selectedItems.reduce(
    (acc, item) => {
      acc.freight += item.freight;
      acc.otherCharges += item.otherCharges;
      acc.taxableAmount += item.freight + item.otherCharges;
      return acc;
    },
    { freight: 0, otherCharges: 0, taxableAmount: 0 }
  );

  const igst = totals.taxableAmount * 0.18;
  const netPayable = totals.taxableAmount + igst;

  const formatIndianNumber = (num: number, hideDecimals = false) => {
    if (isNaN(num)) return hideDecimals ? '0' : '0.00';
    const parts = hideDecimals ? Math.floor(num).toString().split('.') : num.toFixed(2).split('.');
    let lastThree = parts[0].substring(parts[0].length - 3);
    const otherNumbers = parts[0].substring(0, parts[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') lastThree = ',' + lastThree;
    const res = otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
    return (!hideDecimals && parts.length > 1) ? res + '.' + parts[1] : res;
  };

  const formatINR = (amount: number) => '₹' + formatIndianNumber(amount, false);

  // Animated Value Component
  const AnimatedValue = ({ value }: { value: number }) => (
    <AnimatePresence mode="popLayout">
      <motion.span
        key={value}
        initial={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
        animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
        exit={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
        transition={{ duration: 0.3 }}
        className="inline-block"
      >
        {formatINR(value)}
      </motion.span>
    </AnimatePresence>
  );

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 font-sans selection:bg-fuchsia-500/30 pb-20">
      {/* Top Navbar / Action Bar */}
      <div className="sticky top-0 z-40 bg-[#0A0A0B]/80 backdrop-blur-xl border-b border-slate-800 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-fuchsia-500/20 to-fuchsia-600/10 flex items-center justify-center border border-fuchsia-500/20 shadow-[0_0_15px_rgba(192,38,211,0.15)]">
            <Receipt className="w-5 h-5 text-fuchsia-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-white tracking-tight">Consolidated Tax Invoice</h1>
            <p className="text-xs text-slate-400 mt-0.5">Select shipments and generate multi-AWB GST Invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            disabled={selectedAwbs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <Eye className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" /> Preview
          </button>
          
          <div className="relative">
            <button 
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isDownloading || selectedAwbs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed group"
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />}
              {isDownloading ? "Exporting..." : "Export"}
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
            
            <AnimatePresence>
              {exportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-700 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button onClick={() => handleDownload('pdf')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors">
                    <FileText className="w-4 h-4 text-red-400" /> Download PDF
                  </button>
                  <button onClick={() => handleDownload('excel')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Download Excel
                  </button>
                  <button onClick={() => handleDownload('csv')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-300 hover:text-white hover:bg-slate-800 transition-colors border-t border-slate-800">
                    <FileIcon className="w-4 h-4 text-blue-400" /> Download CSV
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button 
            onClick={handleEmail} 
            disabled={isEmailing || selectedAwbs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all border border-slate-700 hover:border-slate-600 disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            {isEmailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />}
            {isEmailing ? "Sending..." : "Email Client"}
          </button>
          
          <button 
            onClick={handleMarkAsSent}
            disabled={isMarkingSent || selectedAwbs.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-gradient-to-r from-fuchsia-600 to-purple-600 hover:from-fuchsia-500 hover:to-purple-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_20px_rgba(192,38,211,0.3)] hover:shadow-[0_0_25px_rgba(192,38,211,0.5)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none border border-fuchsia-500/30"
          >
            {isMarkingSent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isMarkingSent ? "Processing..." : "Generate & Finalize"}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 space-y-6">
        
        {/* Top Row: Selection & Configuration and Running Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-fuchsia-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                <Building className="w-5 h-5 text-fuchsia-400" />
                Invoice Configuration
              </h2>
              <div className="flex gap-2">
                {['Today', 'This Week', 'This Month'].map(range => (
                  <button 
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === range ? 'bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/30' : 'bg-slate-800/50 text-slate-400 border border-slate-700/50 hover:bg-slate-800 hover:text-slate-300'}`}
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Select Client</label>
                  <div className="relative group">
                    <select
                      className="w-full bg-slate-950 border border-slate-700 rounded-xl px-4 py-3 text-sm text-white appearance-none focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all shadow-inner"
                      value={selectedClient.id}
                      onChange={(e) => setSelectedClient(CLIENTS.find((c) => c.id === e.target.value) || CLIENTS[0])}
                    >
                      {CLIENTS.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none group-hover:text-fuchsia-400 transition-colors" />
                  </div>
                </div>
                
                {/* Client Quick Info */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">GSTIN</p>
                      <p className="text-xs text-slate-300 font-mono">{selectedClient.gstin}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-xs text-slate-300 truncate">{selectedClient.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-400 mb-2 uppercase tracking-wider">Date Range</label>
                  <div className="flex gap-3 items-center w-full">
                    <div className="relative flex-1 min-w-0 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
                      </div>
                      <input
                        type="date"
                        defaultValue="2026-10-01"
                        className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert shadow-inner"
                      />
                    </div>
                    <span className="text-slate-500 text-sm font-medium">to</span>
                    <div className="relative flex-1 min-w-0 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-500 group-hover:text-fuchsia-400 transition-colors" />
                      </div>
                      <input
                        type="date"
                        defaultValue="2026-10-31"
                        className="block w-full pl-10 pr-3 py-3 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all [&::-webkit-calendar-picker-indicator]:opacity-50 [&::-webkit-calendar-picker-indicator]:invert shadow-inner"
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Quick Info */}
                <div className="bg-slate-950/50 rounded-xl p-4 border border-slate-800/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Credit Limit</p>
                      <p className="text-xs text-slate-300 font-mono">{formatINR(selectedClient.creditLimit)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Outstanding</p>
                      <p className="text-xs text-amber-400 font-mono">{formatINR(selectedClient.currentOutstanding)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Running Totals Widget */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-950 border border-slate-800 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col"
          >
            {/* Glowing orb effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-300 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-fuchsia-400" />
                Live Summary
              </h3>
              <div className="px-2 py-1 bg-fuchsia-500/10 border border-fuchsia-500/20 rounded text-[10px] font-bold text-fuchsia-400 tracking-widest uppercase">
                {selectedAwbs.length} Selected
              </div>
            </div>
            
            <div className="space-y-4 text-sm flex-1">
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Total Freight</span>
                <span className="font-mono text-slate-200"><AnimatedValue value={totals.freight} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Other Charges</span>
                <span className="font-mono text-slate-200"><AnimatedValue value={totals.otherCharges} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">Gross Taxable</span>
                <span className="font-mono text-slate-200"><AnimatedValue value={totals.taxableAmount} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">IGST (18%)</span>
                <span className="font-mono text-slate-200"><AnimatedValue value={igst} /></span>
              </div>
              
              <div className="pt-4 mt-auto border-t border-slate-800/80">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs text-fuchsia-400/80 font-medium uppercase tracking-wider">Net Payable</span>
                    <div className="flex items-center gap-1.5 text-fuchsia-400">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Auto-calculated</span>
                    </div>
                  </div>
                  <span className="font-bold text-3xl font-mono text-white tracking-tight drop-shadow-md">
                    <AnimatedValue value={netPayable} />
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Row: AWBs Table */}
        <div className="w-full pb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col"
          >
            {/* Table Header Controls */}
            <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/90 relative z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-slate-300 hover:text-white transition-colors group"
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {selectedAwbs.length === filteredAwbs.length && filteredAwbs.length > 0 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
                        <CheckSquare className="w-5 h-5 text-fuchsia-500" />
                      </motion.div>
                    ) : selectedAwbs.length > 0 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
                        <Square className="w-5 h-5 text-fuchsia-500/50 fill-fuchsia-500/20" />
                      </motion.div>
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 group-hover:text-slate-400 transition-colors absolute" />
                    )}
                  </div>
                  <span>Select All</span>
                </button>
                <div className="h-4 w-px bg-slate-700"></div>
                <button 
                  onClick={handleAutoMatch}
                  className="flex items-center gap-2 text-xs font-medium text-slate-400 hover:text-fuchsia-400 transition-colors"
                >
                  <Sparkles className="w-3.5 h-3.5" /> Auto-match pending
                </button>
              </div>

              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className="relative w-full sm:w-72">
                  <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type="text"
                    placeholder="Search AWB, Flight or Route..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500/50 transition-all shadow-inner placeholder:text-slate-600"
                  />
                </div>
                <button className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white hover:border-slate-500 transition-all group">
                  <Filter className="w-4 h-4 group-hover:text-fuchsia-400 transition-colors" />
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-slate-800">
                  <tr>
                    <th className="px-5 py-3 w-14"></th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Date & AWB</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider">Routing</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Metrics (NOP / WT)</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-400 uppercase tracking-wider text-right">Charges</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <AnimatePresence>
                    {filteredAwbs.length > 0 ? (
                      filteredAwbs.map((item, idx) => {
                        const isSelected = selectedAwbs.includes(item.id);
                        return (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: idx * 0.05 }}
                            key={item.id}
                            onClick={() => toggleAwb(item.id)}
                            className={`cursor-pointer transition-all duration-200 ${
                              isSelected ? "bg-fuchsia-500/[0.08] hover:bg-fuchsia-500/[0.12]" : "hover:bg-slate-800/40"
                            }`}
                          >
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="relative flex items-center justify-center w-5 h-5">
                                <AnimatePresence>
                                  {isSelected ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute">
                                      <CheckSquare className="w-5 h-5 text-fuchsia-500" />
                                    </motion.div>
                                  ) : (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute">
                                      <Square className="w-5 h-5 text-slate-600 group-hover:text-slate-500" />
                                    </motion.div>
                                  )}
                                </AnimatePresence>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${
                                item.status === 'Ready' 
                                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                                  : 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                              }`}>
                                {item.status}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-white tracking-wide">{item.cnNo}</span>
                                <span className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3 h-3" /> {item.cnDate}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-slate-200 font-bold">{item.origin}</span>
                                  <div className="h-px w-4 bg-slate-600 relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                  </div>
                                  <span className="text-slate-200 font-bold">{item.dest}</span>
                                </div>
                                <span className="text-xs text-fuchsia-400/80 font-medium mt-0.5">{item.flight}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-slate-200">{item.chWt} kg</span>
                                <span className="text-xs text-slate-400 mt-0.5">{item.nop} pieces @ {formatINR(item.rate)}/kg</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-mono font-bold text-white tracking-wide">
                                  {formatINR(item.freight + item.otherCharges)}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                                  Excl. Taxes
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right relative" onClick={(e) => e.stopPropagation()}>
                              <button 
                                onClick={(e) => {
                                  e.stopPropagation();
                                  setActiveDropdown(activeDropdown === item.id ? null : item.id);
                                }}
                                className={`p-1.5 rounded-md transition-colors relative z-50 ${activeDropdown === item.id ? 'text-white bg-slate-700' : 'text-slate-500 hover:text-white hover:bg-slate-800'}`}
                              >
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
                              
                              <AnimatePresence>
                                {activeDropdown === item.id && (
                                  <>
                                    <div 
                                      className="fixed inset-0 z-40" 
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        setActiveDropdown(null);
                                      }} 
                                    />
                                    <motion.div
                                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                                      animate={{ opacity: 1, scale: 1, y: 0 }}
                                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                                      transition={{ duration: 0.15 }}
                                      className="absolute right-8 top-10 w-48 bg-slate-800 border border-slate-700 rounded-xl shadow-xl z-50 overflow-hidden"
                                    >
                                    <div className="py-1">
                                      <button 
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toast.info(`Viewing details for ${item.cnNo}`);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        <Eye className="w-4 h-4" /> View Details
                                      </button>
                                      <button 
                                        className="w-full text-left px-4 py-2.5 text-sm text-slate-300 hover:text-white hover:bg-slate-700 transition-colors flex items-center gap-2"
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          setSelectedAwbDetails(item);
                                          setShowAwbCopyModal(true);
                                          setActiveDropdown(null);
                                        }}
                                      >
                                        <Download className="w-4 h-4" /> Download Copy
                                      </button>
                                      {isSelected ? (
                                        <button 
                                          className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-slate-700 transition-colors flex items-center gap-2 border-t border-slate-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAwb(item.id);
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          <X className="w-4 h-4" /> Remove from Invoice
                                        </button>
                                      ) : (
                                        <button 
                                          className="w-full text-left px-4 py-2.5 text-sm text-emerald-400 hover:text-emerald-300 hover:bg-slate-700 transition-colors flex items-center gap-2 border-t border-slate-700"
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            toggleAwb(item.id);
                                            setActiveDropdown(null);
                                          }}
                                        >
                                          <CheckSquare className="w-4 h-4" /> Add to Invoice
                                        </button>
                                      )}
                                    </div>
                                  </motion.div>
                                  </>
                                )}
                              </AnimatePresence>
                            </td>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <tr>
                        <td colSpan={7} className="px-4 py-12 text-center">
                          <div className="flex flex-col items-center justify-center text-slate-500">
                            <FileDigit className="w-10 h-10 mb-3 opacity-20" />
                            <p className="text-sm">No AWBs found matching your criteria</p>
                          </div>
                        </td>
                      </tr>
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Invoice Preview Modal */}
      <AnimatePresence>
        {showPreviewModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <Eye className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">Invoice Preview</h2>
                  <span className="px-2 py-0.5 rounded-full bg-slate-200 text-slate-600 text-xs font-semibold ml-2">Draft</span>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDownload('pdf')} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
                    <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print</span>
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button
                    onClick={() => setShowPreviewModal(false)}
                    className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-auto bg-slate-200/50 p-4 sm:p-8 flex justify-center custom-scrollbar relative">
                {/* The "A4" Page Landscape */}
                <div id="invoice-print-area" className="bg-white shadow-2xl w-full max-w-[297mm] min-h-[210mm] p-8 flex flex-col font-sans text-sm print-area relative">
                  
                  {/* Header */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="w-1/4">
                      {/* Professional Logo */}
                      <div className="w-24 h-24 bg-gradient-to-br from-indigo-900 to-slate-900 rounded-2xl flex items-center justify-center shadow-lg border-2 border-indigo-500/30 transform -rotate-2">
                        <div className="text-center">
                          <span className="font-black text-4xl text-white tracking-tighter italic drop-shadow-md">SVL</span>
                          <div className="h-1 w-12 bg-indigo-500 mx-auto mt-1 rounded-full shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                        </div>
                      </div>
                    </div>
                    <div className="w-1/2 text-center">
                      <h1 className="text-2xl font-bold tracking-tight text-slate-900 mb-1">SVL CARGO SERVICES</h1>
                      <p className="text-slate-800 text-xs font-medium">
                        No. 1, Kather Garden Nehru High Road, Palavanthangal, Chennai - 600 114.
                      </p>
                      <p className="text-slate-800 text-xs font-medium mt-1">
                        E-mail: svlcargo2017@gmail.com PAN: ADJFS2013F
                      </p>
                      <p className="text-slate-800 text-xs font-medium mt-1">
                        GSTIN: 33ADJFS2013F1ZJ STATE: TAMILNADU STATE CODE: 33
                      </p>
                      <h2 className="text-lg font-bold uppercase tracking-widest text-slate-900 mt-4 underline underline-offset-4">Tax Invoice</h2>
                    </div>
                    <div className="w-1/4"></div>
                  </div>

                  {/* Invoice Meta & Billed To */}
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-1/2">
                      <p className="text-xs font-bold text-slate-900">To,</p>
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{selectedClient.name}</h3>
                    </div>
                    <div className="w-1/3 text-right">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs justify-end font-bold text-slate-900">
                        <div className="text-right">INVOICE NO :</div>
                        <div className="text-left">SVL/000/26-27</div>
                        <div className="text-right">INVOICE DATE :</div>
                        <div className="text-left">{new Date().toLocaleDateString('en-GB')}</div>
                        <div className="text-right">SAC CODE :</div>
                        <div className="text-left">996531</div>
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-4 flex-1">
                    <table className="w-full text-center text-[10px] border-collapse border border-slate-400">
                      <thead>
                        <tr className="bg-slate-100 font-bold border-b border-slate-400">
                          <th className="py-1 px-1 border-r border-slate-400">Sr.</th>
                          <th className="py-1 px-1 border-r border-slate-400">CN DT</th>
                          <th className="py-1 px-1 border-r border-slate-400">CN NO.</th>
                          <th className="py-1 px-1 border-r border-slate-400">FLIGHT</th>
                          <th className="py-1 px-1 border-r border-slate-400">ORIGIN</th>
                          <th className="py-1 px-1 border-r border-slate-400">DEST</th>
                          <th className="py-1 px-1 border-r border-slate-400">NOP</th>
                          <th className="py-1 px-1 border-r border-slate-400">CH.WT</th>
                          <th className="py-1 px-1 border-r border-slate-400">RATE</th>
                          <th className="py-1 px-1 border-r border-slate-400">FREIGHT</th>
                          <th className="py-1 px-1 border-r border-slate-400">OTHER CHARGES</th>
                          <th className="py-1 px-1 border-r border-slate-400">GROSS</th>
                          <th className="py-1 px-1 border-r border-slate-400">TAXABLE AMOUNT</th>
                          <th className="py-1 px-1 border-r border-slate-400">IGST 18%</th>
                          <th className="py-1 px-1">NET PAYABLE</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-300">
                        {selectedItems.map((item, idx) => {
                          const taxable = item.freight + item.otherCharges;
                          const igstAmt = taxable * 0.18;
                          const netAmt = taxable + igstAmt;
                          return (
                            <tr key={idx} className="border-b border-slate-400">
                              <td className="py-1.5 px-1 border-r border-slate-400">{idx + 1}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.cnDate.split('-').slice(0,2).join('-')}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.cnNo.split('-')[1]}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.flight.replace('-', ' ')}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.origin}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.dest}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.nop}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">{item.chWt}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{item.rate.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{item.freight.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{item.otherCharges.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{taxable.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{taxable.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{igstAmt.toFixed(2)}</td>
                              <td className="py-1.5 px-1 text-right">{netAmt.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                        {/* Grand Total Row */}
                        <tr className="border-b border-slate-400 font-bold bg-slate-50">
                          <td colSpan={6} className="py-2 px-1 border-r border-slate-400 text-right">Total</td>
                          <td className="py-2 px-1 border-r border-slate-400">{selectedItems.reduce((acc, curr) => acc + curr.nop, 0)}</td>
                          <td className="py-2 px-1 border-r border-slate-400">{selectedItems.reduce((acc, curr) => acc + curr.chWt, 0)}</td>
                          <td className="py-2 px-1 border-r border-slate-400"></td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{totals.freight.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{totals.otherCharges.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{totals.taxableAmount.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{totals.taxableAmount.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{igst.toFixed(2)}</td>
                          <td className="py-2 px-1 text-right">{netPayable.toFixed(2)}</td>
                        </tr>
                        <tr className="border-b border-slate-400 font-bold">
                          <td colSpan={14} className="py-2 px-1 border-r border-slate-400 text-right">Net Payable</td>
                          <td className="py-2 px-1 text-right">{netPayable.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Footer Notes & Bank Details */}
                  <div className="flex gap-4 text-xs mt-4">
                    <div className="w-1/2 border border-slate-400 p-2">
                      <h4 className="font-bold text-slate-900 mb-1">Terms & conditions:</h4>
                      <ol className="list-decimal pl-4 space-y-1 text-[10px] text-slate-800 font-bold">
                        <li>Difference or any Discrepency in Bill must be informed within 3 days from receipt of the Bill.</li>
                        <li>Payment should be made with in 5 days from receipt of the Bill.</li>
                        <li>Interest @ 24% P.A. will be charged if the bill is not paid on prescribed time limit mentioned above.</li>
                        <li>Payment should be made compulsorily by A/c payee Cheque / DD in fav of "SVL CARGO SERVICES".</li>
                        <li>Subject to Chennai Jurisdiction only.</li>
                        <li>This is a computer generated invoice and does not require any signature.</li>
                      </ol>
                    </div>
                    <div className="w-1/2 flex flex-col justify-between">
                      <div className="border border-slate-400 p-2 font-bold text-[10px] text-slate-800">
                        <h4 className="font-bold text-slate-900 mb-1 border-b border-slate-400 pb-1">Bank Details :</h4>
                        <div className="grid grid-cols-[150px_1fr] gap-y-1 mt-1">
                          <div>M/s.SVL CARGO SERVICES,</div>
                          <div></div>
                          <div>HDFC BANK LIMITED, NANGANALLUR, BRANCH, CHENNAI-600061, TAMILNADU, INDIA.</div>
                          <div></div>
                          <div>IFSC CODE: HDFC0000674</div>
                          <div>Account Number: 50200034478826</div>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-900 font-bold mt-4 relative">
                        {/* Company Seal */}
                        <div className="absolute right-20 bottom-10 w-24 h-24 border-4 border-indigo-600/30 rounded-full flex items-center justify-center -rotate-12 pointer-events-none mix-blend-multiply">
                          <div className="border-2 border-indigo-600/30 w-[84px] h-[84px] rounded-full flex items-center justify-center text-center">
                            <span className="text-indigo-700/40 font-black text-[10px] tracking-widest uppercase transform leading-tight">
                              SVL CARGO <br/> SERVICES <br/> OFFICIAL
                            </span>
                          </div>
                        </div>
                        
                        For - SVL CARGO SERVICES
                        
                        {/* Signature */}
                        <div className="h-16 flex items-end justify-end mt-1 mb-2 relative z-10">
                          <span style={{ fontFamily: "'Brush Script MT', 'Bradley Hand', cursive" }} className="text-3xl text-blue-900/80 transform -rotate-6">
                            S. Vijay Kumar
                          </span>
                        </div>
                        
                        Authorized Signatory
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* AWB Preview Modal */}
      <AnimatePresence>
        {showAwbCopyModal && selectedAwbDetails && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="bg-white text-slate-900 rounded-2xl shadow-2xl w-full max-w-5xl h-[92vh] flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 shadow-sm z-10">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                    <FileDigit className="w-4 h-4 text-indigo-600" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-800 tracking-tight">AWB Copy: {selectedAwbDetails.cnNo}</h2>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => toast.success("AWB PDF Downloaded")} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
                    <Download className="w-4 h-4" /> <span className="hidden sm:inline">Download</span>
                  </button>
                  <button onClick={() => window.print()} className="p-2 hover:bg-indigo-50 text-indigo-600 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold">
                    <Printer className="w-4 h-4" /> <span className="hidden sm:inline">Print</span>
                  </button>
                  <div className="w-px h-6 bg-slate-300 mx-1"></div>
                  <button
                    onClick={() => {
                      setShowAwbCopyModal(false);
                      setSelectedAwbDetails(null);
                    }}
                    className="p-2 hover:bg-slate-200 rounded-lg text-slate-500 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-auto bg-slate-200/50 p-4 sm:p-8 flex justify-center custom-scrollbar relative">
                <div className="bg-white shadow-2xl w-full max-w-[210mm] p-4 flex flex-col font-sans print-area relative">
                   <AirWaybillPreview awb={selectedAwbDetails} />
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
