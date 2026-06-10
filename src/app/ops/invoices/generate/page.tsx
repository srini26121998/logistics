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

  const handleDownload = (format: 'pdf' | 'csv' | 'excel' = 'pdf') => {
    if (selectedAwbs.length === 0) {
      toast.error("Please select at least one AWB.");
      return;
    }
    setIsDownloading(true);
    setExportMenuOpen(false);
    toast.info(`Generating ${format.toUpperCase()} invoice...`);

    simulateAction(() => {
      setIsDownloading(false);
      toast.success(`Invoice ${format.toUpperCase()} downloaded successfully`);
    });
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
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 pb-20">
      {/* Top Navbar / Action Bar (Floating Island) */}
      <div className="sticky top-4 z-40 bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl py-4 px-4 sm:px-6 flex items-center justify-between shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-8">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-indigo-600/10 flex items-center justify-center border border-indigo-500/20 shadow-[0_0_15px_rgba(79,70,229,0.15)]">
            <Receipt className="w-5 h-5 text-indigo-500" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Consolidated Tax Invoice</h1>
            <p className="text-xs text-slate-600 mt-0.5">Select shipments and generate multi-AWB GST Invoice</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowPreviewModal(true)}
            disabled={selectedAwbs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-sm font-medium transition-all border border-blue-200 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            suppressHydrationWarning
          >
            <Eye className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" /> Preview
          </button>

          <div className="relative">
            <button
              onClick={() => setExportMenuOpen(!exportMenuOpen)}
              disabled={isDownloading || selectedAwbs.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-sm font-medium transition-all border border-blue-200 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
              suppressHydrationWarning
            >
              {isDownloading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />}
              {isDownloading ? "Exporting..." : "Export"}
              <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>

            <AnimatePresence>
              {exportMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-xl shadow-xl overflow-hidden z-50"
                >
                  <button onClick={() => handleDownload('pdf')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors">
                    <FileText className="w-4 h-4 text-red-400" /> Download PDF
                  </button>
                  <button onClick={() => handleDownload('excel')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border-t border-blue-200">
                    <FileSpreadsheet className="w-4 h-4 text-emerald-400" /> Download Excel
                  </button>
                  <button onClick={() => handleDownload('csv')} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors border-t border-blue-200">
                    <FileIcon className="w-4 h-4 text-blue-400" /> Download CSV
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <button
            onClick={handleEmail}
            disabled={isEmailing || selectedAwbs.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-white hover:bg-slate-100 text-slate-900 rounded-lg text-sm font-medium transition-all border border-blue-200 hover:border-blue-200 disabled:opacity-50 disabled:cursor-not-allowed group"
            suppressHydrationWarning
          >
            {isEmailing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Mail className="w-4 h-4 text-slate-600 group-hover:text-slate-900 transition-colors" />}
            {isEmailing ? "Sending..." : "Email Client"}
          </button>

          <button
            onClick={handleMarkAsSent}
            disabled={isMarkingSent || selectedAwbs.length === 0}
            className="flex items-center gap-2 px-5 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_20px_rgba(79,70,229,0.4)] disabled:opacity-50 disabled:cursor-not-allowed disabled:shadow-none"
            suppressHydrationWarning
          >
            {isMarkingSent ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />}
            {isMarkingSent ? "Processing..." : "Generate & Finalize"}
          </button>
        </div>
      </div>

      <div className="w-full space-y-6">

        {/* Top Row: Selection & Configuration and Running Totals */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-2 bg-white/60 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-xl relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <Building className="w-5 h-5 text-indigo-500" />
                Invoice Configuration
              </h2>
              <div className="flex gap-2">
                {['Today', 'This Week', 'This Month'].map(range => (
                  <button
                    key={range}
                    onClick={() => setDateRange(range)}
                    className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${dateRange === range ? 'bg-indigo-500/20 text-indigo-600 border border-indigo-500/30' : 'bg-slate-100/50 text-slate-600 border border-slate-200 hover:bg-slate-100 hover:text-slate-700'}`}
                    suppressHydrationWarning
                  >
                    {range}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Select Client</label>
                  <div className="relative group">
                    <select
                      className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-sm text-slate-900 appearance-none focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                      value={selectedClient.id}
                      onChange={(e) => setSelectedClient(CLIENTS.find((c) => c.id === e.target.value) || CLIENTS[0])}
                      suppressHydrationWarning
                    >
                      {CLIENTS.map((client) => (
                        <option key={client.id} value={client.id}>
                          {client.name}
                        </option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-600 pointer-events-none group-hover:text-indigo-500 transition-colors" />
                  </div>
                </div>

                {/* Client Quick Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-blue-200/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">GSTIN</p>
                      <p className="text-xs text-slate-700 font-mono">{selectedClient.gstin}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Email</p>
                      <p className="text-xs text-slate-700 truncate">{selectedClient.email}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wider">Date Range</label>
                  <div className="flex gap-3 items-center w-full">
                    <div className="relative flex-1 min-w-0 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="date"
                        defaultValue="2026-10-01"
                        className="block w-full pl-10 pr-3 py-3 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                        suppressHydrationWarning
                      />
                    </div>
                    <span className="text-slate-500 text-sm font-medium">to</span>
                    <div className="relative flex-1 min-w-0 group">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Calendar className="h-4 w-4 text-slate-500 group-hover:text-indigo-500 transition-colors" />
                      </div>
                      <input
                        type="date"
                        defaultValue="2026-10-31"
                        className="block w-full pl-10 pr-3 py-3 bg-white border border-blue-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all shadow-sm"
                        suppressHydrationWarning
                      />
                    </div>
                  </div>
                </div>

                {/* Financial Quick Info */}
                <div className="bg-slate-50 rounded-xl p-4 border border-blue-200/50">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Credit Limit</p>
                      <p className="text-xs text-slate-700 font-mono">{formatINR(selectedClient.creditLimit)}</p>
                    </div>
                    <div>
                      <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1">Outstanding</p>
                      <p className="text-xs text-amber-600 font-mono">{formatINR(selectedClient.currentOutstanding)}</p>
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
            className="lg:col-span-1 bg-white/60 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 relative overflow-hidden shadow-xl flex flex-col"
          >
            {/* Glowing orb effect */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-600/5 rounded-full blur-3xl pointer-events-none"></div>

            <div className="flex items-center justify-between mb-6">
              <h3 className="text-sm font-semibold text-slate-700 uppercase tracking-wider flex items-center gap-2">
                <PieChart className="w-4 h-4 text-indigo-500" />
                Live Summary
              </h3>
              <div className="px-2 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded text-[10px] font-bold text-indigo-600 tracking-widest uppercase">
                {selectedAwbs.length} Selected
              </div>
            </div>

            <div className="space-y-4 text-sm flex-1">
              <div className="flex justify-between items-center group">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">Total Freight</span>
                <span className="font-mono text-slate-900"><AnimatedValue value={totals.freight} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">Other Charges</span>
                <span className="font-mono text-slate-900"><AnimatedValue value={totals.otherCharges} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">Gross Taxable</span>
                <span className="font-mono text-slate-900"><AnimatedValue value={totals.taxableAmount} /></span>
              </div>
              <div className="flex justify-between items-center group">
                <span className="text-slate-600 group-hover:text-slate-700 transition-colors">IGST (18%)</span>
                <span className="font-mono text-slate-900"><AnimatedValue value={igst} /></span>
              </div>

              <div className="pt-4 mt-auto border-t border-blue-200/80">
                <div className="flex justify-between items-end">
                  <div className="space-y-1">
                    <span className="text-xs text-indigo-500 font-medium uppercase tracking-wider">Net Payable</span>
                    <div className="flex items-center gap-1.5 text-indigo-500">
                      <TrendingUp className="w-4 h-4" />
                      <span className="text-xs font-medium">Auto-calculated</span>
                    </div>
                  </div>
                  <span className="font-bold text-3xl font-mono text-slate-900 tracking-tight drop-shadow-md">
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
            className="bg-white/60 backdrop-blur-xl border border-blue-200 rounded-2xl overflow-hidden shadow-xl flex flex-col"
          >
            {/* Table Header Controls */}
            <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white relative z-10">
              <div className="flex items-center gap-4">
                <button
                  onClick={handleSelectAll}
                  className="flex items-center gap-2 text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors group"
                  suppressHydrationWarning
                >
                  <div className="relative flex items-center justify-center w-5 h-5">
                    {selectedAwbs.length === filteredAwbs.length && filteredAwbs.length > 0 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
                        <CheckSquare className="w-5 h-5 text-indigo-500" />
                      </motion.div>
                    ) : selectedAwbs.length > 0 ? (
                      <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute">
                        <Square className="w-5 h-5 text-indigo-500/50 fill-indigo-500/20" />
                      </motion.div>
                    ) : (
                      <Square className="w-5 h-5 text-slate-500 group-hover:text-slate-600 transition-colors absolute" />
                    )}
                  </div>
                  <span>Select All</span>
                </button>
                <div className="h-4 w-px bg-slate-700"></div>
                <button className="flex items-center gap-2 text-xs font-medium text-slate-600 hover:text-indigo-500 transition-colors" suppressHydrationWarning>
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
                    className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 transition-all placeholder:text-slate-500"
                    suppressHydrationWarning
                  />
                </div>
                <button className="p-2 bg-slate-100 border border-blue-200 rounded-lg text-slate-600 hover:text-slate-900 hover:border-slate-500 transition-all group" suppressHydrationWarning>
                  <Filter className="w-4 h-4 group-hover:text-indigo-500 transition-colors" />
                </button>
              </div>
            </div>

            {/* Table Content */}
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left border-collapse min-w-[900px]">
                <thead className="bg-white sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-blue-200">
                  <tr>
                    <th className="px-5 py-3 w-14"></th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Date & AWB</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider">Routing</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Metrics (NOP / WT)</th>
                    <th className="px-4 py-3 text-xs font-bold text-slate-600 uppercase tracking-wider text-right">Charges</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
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
                            className={`cursor-pointer transition-all duration-200 ${isSelected ? "bg-indigo-500/[0.08] hover:bg-indigo-500/[0.12]" : "hover:bg-slate-100/40"
                              }`}
                          >
                            <td className="px-5 py-4 whitespace-nowrap">
                              <div className="relative flex items-center justify-center w-5 h-5">
                                <AnimatePresence>
                                  {isSelected ? (
                                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} exit={{ scale: 0 }} className="absolute">
                                      <CheckSquare className="w-5 h-5 text-indigo-500" />
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
                              <div className={`inline-flex items-center px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider border ${item.status === 'Ready'
                                  ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                  : 'bg-amber-100 text-amber-700 border-amber-200'
                                }`}>
                                {item.status}
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <span className="text-sm font-semibold text-slate-900 tracking-wide">{item.cnNo}</span>
                                <span className="text-xs text-slate-600 flex items-center gap-1 mt-0.5">
                                  <Calendar className="w-3 h-3" /> {item.cnDate}
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap">
                              <div className="flex flex-col">
                                <div className="flex items-center gap-2 text-sm">
                                  <span className="text-slate-900 font-bold">{item.origin}</span>
                                  <div className="h-px w-4 bg-slate-600 relative">
                                    <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1 h-1 bg-slate-400 rounded-full"></div>
                                  </div>
                                  <span className="text-slate-900 font-bold">{item.dest}</span>
                                </div>
                                <span className="text-xs text-indigo-500 font-medium mt-0.5">{item.flight}</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-medium text-slate-900">{item.chWt} kg</span>
                                <span className="text-xs text-slate-600 mt-0.5">{item.nop} pieces @ {formatINR(item.rate)}/kg</span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right">
                              <div className="flex flex-col items-end">
                                <span className="text-sm font-mono font-bold text-slate-900 tracking-wide">
                                  {formatINR(item.freight + item.otherCharges)}
                                </span>
                                <span className="text-[10px] text-slate-500 uppercase tracking-wider mt-0.5">
                                  Excl. Taxes
                                </span>
                              </div>
                            </td>
                            <td className="px-4 py-4 whitespace-nowrap text-right" onClick={(e) => e.stopPropagation()}>
                              <button className="p-1.5 text-slate-500 hover:text-slate-900 hover:bg-slate-100 rounded-md transition-colors" suppressHydrationWarning>
                                <MoreHorizontal className="w-4 h-4" />
                              </button>
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
              <div className="px-6 py-4 border-b border-blue-200 flex justify-between items-center bg-slate-50 shadow-sm z-10">
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
                {/* The "A4" Page */}
                <div className="bg-white shadow-2xl w-full max-w-[210mm] min-h-[297mm] p-10 flex flex-col font-sans text-sm print-area relative">

                  {/* Subtle Watermark */}
                  <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-[0.03] overflow-hidden z-0">
                    <h1 className="text-[150px] font-black transform -rotate-45 tracking-tighter">SVL CARGO</h1>
                  </div>

                  <div className="relative z-10 flex-1 flex flex-col">
                    {/* SVL Letterhead */}
                    <div className="border-b-4 border-slate-900 pb-6 mb-8 flex justify-between items-start">
                      <div className="flex gap-4 items-center">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center text-slate-900 font-black text-2xl shadow-lg">
                          SVL
                        </div>
                        <div>
                          <h1 className="text-3xl font-black tracking-tighter text-slate-900 mb-1">SVL CARGO</h1>
                          <p className="text-slate-500 text-xs max-w-sm font-medium">
                            123 Logistics Park, NH-8, Mahipalpur<br />
                            New Delhi - 110037, India<br />
                            <span className="text-slate-700 font-semibold">contact@svlcargo.com | +91-11-23456789</span>
                          </p>
                        </div>
                      </div>
                      <div className="text-right text-xs text-slate-600 space-y-1.5 bg-slate-50 p-3 rounded-lg border border-blue-100">
                        <p><span className="font-bold text-slate-800">PAN:</span> AAECS1234F</p>
                        <p><span className="font-bold text-slate-800">GSTIN:</span> 07AAECS1234F1Z0</p>
                        <p><span className="font-bold text-slate-800">State:</span> 07 (Delhi)</p>
                      </div>
                    </div>

                    <div className="text-center mb-8 relative">
                      <div className="absolute top-1/2 left-0 w-full h-px bg-slate-200 -z-10"></div>
                      <h2 className="text-2xl font-black uppercase tracking-[0.2em] text-slate-900 bg-white inline-block px-6">Tax Invoice</h2>
                    </div>

                    {/* Invoice Meta & Billed To */}
                    <div className="flex justify-between items-stretch mb-8 gap-6">
                      <div className="w-1/2 border border-blue-200 rounded-xl p-5 bg-slate-50/50">
                        <p className="text-[10px] font-bold text-indigo-600 uppercase tracking-widest mb-2 flex items-center gap-1"><Building className="w-3 h-3" /> Bill To</p>
                        <h3 className="font-black text-lg text-slate-900 mb-1">{selectedClient.name}</h3>
                        <p className="text-sm text-slate-600 font-medium">
                          GSTIN: <span className="text-slate-800 font-bold">{selectedClient.gstin}</span><br />
                          State Code: <span className="text-slate-800 font-bold">{selectedClient.stateCode}</span>
                        </p>
                      </div>
                      <div className="w-1/2 border border-blue-200 rounded-xl p-5 bg-slate-50/50 relative overflow-hidden">
                        <QrCode className="absolute -right-4 -bottom-4 w-24 h-24 text-slate-100" />
                        <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm relative z-10">
                          <div className="font-bold text-slate-500 uppercase text-xs tracking-wider">Invoice No</div>
                          <div className="font-black text-slate-900 text-right">SVL/000/26-27</div>

                          <div className="font-bold text-slate-500 uppercase text-xs tracking-wider">Date</div>
                          <div className="font-bold text-slate-800 text-right">13-Oct-2026</div>

                          <div className="font-bold text-slate-500 uppercase text-xs tracking-wider">Due Date</div>
                          <div className="font-bold text-rose-600 text-right">18-Oct-2026</div>
                        </div>
                      </div>
                    </div>

                    {/* Line Items Table */}
                    <div className="mb-8 flex-1">
                      <table className="w-full text-left text-xs border-collapse">
                        <thead>
                          <tr className="bg-white text-slate-900">
                            <th className="py-3 px-3 font-bold w-10 rounded-tl-lg">#</th>
                            <th className="py-3 px-3 font-bold">AWB Details</th>
                            <th className="py-3 px-3 font-bold">Route & Flight</th>
                            <th className="py-3 px-3 font-bold text-right">Metrics</th>
                            <th className="py-3 px-3 font-bold text-right">Freight</th>
                            <th className="py-3 px-3 font-bold text-right">Other</th>
                            <th className="py-3 px-3 font-bold text-right rounded-tr-lg">Taxable</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200 border-x border-b border-blue-200 rounded-b-lg">
                          {selectedItems.map((item, idx) => (
                            <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                              <td className="py-3 px-3 text-slate-500 font-medium">{idx + 1}</td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-900">{item.cnNo}</div>
                                <div className="text-[10px] text-slate-500">{item.cnDate}</div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-bold text-slate-700">{item.origin} → {item.dest}</div>
                                <div className="text-[10px] text-slate-500">{item.flight}</div>
                              </td>
                              <td className="py-3 px-3 text-right">
                                <div className="font-semibold text-slate-800">{item.chWt} kg</div>
                                <div className="text-[10px] text-slate-500">{item.nop} pcs</div>
                              </td>
                              <td className="py-3 px-3 text-right font-medium">{formatIndianNumber(item.freight, true)}</td>
                              <td className="py-3 px-3 text-right font-medium">{formatIndianNumber(item.otherCharges, true)}</td>
                              <td className="py-3 px-3 text-right font-bold text-slate-900">
                                {formatIndianNumber(item.freight + item.otherCharges, true)}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Totals Section */}
                    <div className="flex justify-between items-end mb-10">
                      <div className="w-1/2 pr-8">
                        <div className="bg-slate-50 p-4 rounded-xl border border-blue-200">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-1">
                            <ShieldCheck className="w-4 h-4 text-emerald-500" /> Payment Info
                          </p>
                          <p className="text-xs text-slate-600 font-medium leading-relaxed">
                            Please make all payments payable to <span className="font-bold text-slate-900">SVL CARGO</span>.<br />
                            NEFT/RTGS Transfer details:<br />
                            A/C: <span className="font-mono font-bold">50200034478826</span> | IFSC: <span className="font-mono font-bold">HDFC0000674</span>
                          </p>
                        </div>
                      </div>
                      <div className="w-72 bg-slate-50 rounded-xl border border-blue-200 overflow-hidden">
                        <div className="p-4 space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-600">Total Taxable</span>
                            <span className="font-bold text-slate-900">{formatINR(totals.taxableAmount)}</span>
                          </div>
                          <div className="flex justify-between text-sm">
                            <span className="font-bold text-slate-600">IGST (18%)</span>
                            <span className="font-bold text-slate-900">{formatINR(igst)}</span>
                          </div>
                        </div>
                        <div className="bg-white p-4 text-slate-900 flex justify-between items-center">
                          <span className="font-black uppercase tracking-wider text-sm">Total Due</span>
                          <span className="font-black text-xl">{formatINR(netPayable)}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-xs font-medium text-slate-600 italic mb-8">
                      Amount in words: Rupees {formatIndianNumber(Math.floor(netPayable), true)} Only
                    </div>

                    {/* Footer Notes & Signature */}
                    <div className="mt-auto pt-8 border-t-2 border-blue-200 flex justify-between items-end">
                      <div className="max-w-md">
                        <h4 className="font-bold text-slate-900 mb-2 uppercase tracking-wider text-[10px]">Terms & Conditions</h4>
                        <ol className="list-decimal pl-4 space-y-1 text-[10px] text-slate-500 font-medium">
                          <li>Discrepancies must be reported within 3 working days.</li>
                          <li>Payment is strictly due within 5 days from invoice date.</li>
                          <li>Interest @ 24% p.a. applicable on delayed payments.</li>
                          <li>All disputes subject to New Delhi Jurisdiction.</li>
                        </ol>
                      </div>
                      <div className="text-center">
                        <div className="w-40 h-16 border-b border-slate-400 mb-2 flex items-end justify-center pb-2">
                          {/* Signature Placeholder */}
                          <span className="font-['Brush_Script_MT',cursive] text-2xl text-slate-800 transform -rotate-6">SVL Auth</span>
                        </div>
                        <div className="text-[10px] font-bold text-slate-800 uppercase tracking-widest">
                          Authorized Signatory<br />
                          <span className="text-slate-500">For SVL CARGO</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
