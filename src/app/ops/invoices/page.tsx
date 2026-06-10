"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INVOICES, formatINR } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { DollarSign, Search, Filter, Plus, FileText, Download, Eye, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function InvoiceHistoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [selectedInvoiceForPdf, setSelectedInvoiceForPdf] = useState<typeof INVOICES[0] | null>(null);

  const filteredInvoices = INVOICES.filter(inv => {
    const matchesSearch = 
      inv.invoiceNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
      inv.clientName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "All" || inv.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            Tax Invoices & Billing
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage billing, payments, and outstanding invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Exporting invoice report...')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <Link href="/ops/invoices/generate" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> Generate Invoice
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoice number, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-emerald-500"
            />
          </div>
          
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
            {["All", "Paid", "Sent", "Overdue", "Draft", "Cancelled"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status 
                    ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-300"
                }`}
              >
                {status}
              </button>
            ))}
            <button onClick={() => toast.info('Advanced filters opened')} className="p-2 bg-slate-100 border border-blue-200 rounded-lg text-slate-600 hover:text-slate-900 ml-auto sm:ml-2">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Invoice Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredInvoices.map((inv, idx) => (
                <motion.tr 
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-100/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-bold text-slate-900">{inv.invoiceNo}</div>
                        <div className="text-xs text-slate-600 mt-0.5">{inv.awbCount} AWBs Consolidated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-700">{inv.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-slate-700">Issue: {inv.date}</span>
                      <span className={`font-medium ${inv.status === 'Overdue' ? 'text-rose-400' : 'text-slate-500'}`}>Due: {inv.dueDate}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="font-mono font-bold text-emerald-400">{formatINR(inv.total)}</div>
                    <div className="text-xs text-slate-500 mt-0.5">Taxable: {formatINR(inv.taxableAmount)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={inv.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button 
                      onClick={() => {
                        toast.success(`Generating PDF preview for ${inv.invoiceNo}`);
                        setSelectedInvoiceForPdf(inv);
                      }} 
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:text-white hover:bg-emerald-600 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all gap-1.5"
                    >
                      <Eye className="w-3.5 h-3.5" /> View PDF
                    </button>
                  </td>
                </motion.tr>
              ))}
              
              {filteredInvoices.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <DollarSign className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-base font-medium text-slate-600">No invoices found</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Invoice PDF Preview Modal */}
      <AnimatePresence>
        {selectedInvoiceForPdf && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white text-slate-900 rounded-xl shadow-2xl w-full max-w-5xl h-[90vh] flex flex-col overflow-hidden relative"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-blue-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-emerald-600" /> Invoice {selectedInvoiceForPdf.invoiceNo}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={() => { toast.success("Invoice downloaded"); setSelectedInvoiceForPdf(null); }} className="px-3 py-1.5 bg-slate-100 text-slate-900 rounded-lg text-xs font-medium hover:bg-slate-700 flex items-center gap-1.5 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Download PDF
                  </button>
                  <button
                    onClick={() => setSelectedInvoiceForPdf(null)}
                    className="p-1.5 hover:bg-slate-200 rounded-full text-slate-500 transition-colors ml-2"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* PDF Content Area */}
              <div className="flex-1 overflow-auto bg-slate-100 p-8 flex justify-center custom-scrollbar">
                <div className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] p-10 flex flex-col font-sans text-sm print-area">
                  
                  {/* SVL Letterhead */}
                  <div className="border-b-2 border-blue-200 pb-6 mb-6">
                    <div className="flex justify-between items-start">
                      <div>
                        <h1 className="text-3xl font-bold tracking-tight text-slate-900 mb-1">SVL CARGO</h1>
                        <p className="text-slate-600 text-xs max-w-sm">
                          123 Logistics Park, NH-8, Mahipalpur, New Delhi - 110037
                          <br /> Ph: +91-11-23456789 | Email: billing@svlcargo.com
                        </p>
                      </div>
                      <div className="text-right text-xs text-slate-600 space-y-1">
                        <p><span className="font-semibold">PAN:</span> AAECS1234F</p>
                        <p><span className="font-semibold">GSTIN:</span> 07AAECS1234F1Z0</p>
                        <p><span className="font-semibold">State Code:</span> 07 (Delhi)</p>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h2 className="text-xl font-bold uppercase tracking-widest text-slate-800">Tax Invoice</h2>
                  </div>

                  {/* Invoice Meta & Billed To */}
                  <div className="flex justify-between items-start mb-8 border border-blue-200 rounded p-4">
                    <div className="w-1/2">
                      <p className="text-xs font-semibold text-slate-500 uppercase mb-1">Billed To</p>
                      <h3 className="font-bold text-base text-slate-800">{selectedInvoiceForPdf.clientName}</h3>
                    </div>
                    <div className="w-1/2 text-right">
                      <div className="grid grid-cols-2 gap-x-4 gap-y-2 text-sm justify-end">
                        <div className="font-semibold text-slate-600">Invoice No:</div>
                        <div className="font-bold text-slate-900">{selectedInvoiceForPdf.invoiceNo}</div>
                        <div className="font-semibold text-slate-600">Invoice Date:</div>
                        <div className="font-medium">{selectedInvoiceForPdf.date}</div>
                        <div className="font-semibold text-slate-600">Due Date:</div>
                        <div className="font-medium">{selectedInvoiceForPdf.dueDate}</div>
                      </div>
                    </div>
                  </div>

                  {/* Line Items Table */}
                  <div className="mb-8 flex-1">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="bg-slate-100 border-y-2 border-blue-200">
                          <th className="py-2 px-2 font-semibold">Description</th>
                          <th className="py-2 px-2 font-semibold text-center">AWBs</th>
                          <th className="py-2 px-2 font-semibold text-right">Taxable Amt</th>
                          <th className="py-2 px-2 font-semibold text-right">Total Amt</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-200">
                        <tr>
                          <td className="py-4 px-2">
                            <p className="font-medium text-slate-800">Consolidated Freight Services</p>
                            <p className="text-slate-500 mt-1 text-[10px]">Logistics and transportation services for the specified period.</p>
                          </td>
                          <td className="py-4 px-2 text-center text-slate-700">{selectedInvoiceForPdf.awbCount}</td>
                          <td className="py-4 px-2 text-right font-mono text-slate-800">{formatINR(selectedInvoiceForPdf.taxableAmount)}</td>
                          <td className="py-4 px-2 text-right font-mono text-slate-800 font-medium">{formatINR(selectedInvoiceForPdf.taxableAmount)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  {/* Totals Section */}
                  <div className="flex justify-end mb-8">
                    <div className="w-72 border-t-2 border-blue-200 pt-2">
                      <div className="flex justify-between py-1 text-sm">
                        <span className="font-semibold text-slate-600">Total Taxable Value</span>
                        <span className="font-medium text-slate-900">{formatINR(selectedInvoiceForPdf.taxableAmount)}</span>
                      </div>
                      <div className="flex justify-between py-1 text-sm">
                        <span className="font-semibold text-slate-600">IGST @ 18%</span>
                        <span className="font-medium text-slate-900">{formatINR(selectedInvoiceForPdf.total - selectedInvoiceForPdf.taxableAmount)}</span>
                      </div>
                      <div className="flex justify-between py-2 text-base border-t border-blue-200 mt-1">
                        <span className="font-bold text-slate-800">Grand Total</span>
                        <span className="font-bold text-slate-900">{formatINR(selectedInvoiceForPdf.total)}</span>
                      </div>
                    </div>
                  </div>

                  {/* Footer Notes & Bank Details */}
                  <div className="grid grid-cols-2 gap-8 text-xs mt-auto pt-8 border-t border-blue-200">
                    <div>
                      <h4 className="font-bold text-slate-800 mb-2">Terms & Conditions</h4>
                      <ol className="list-decimal pl-4 space-y-1 text-slate-600">
                        <li>Any discrepancy must be reported within 3 days.</li>
                        <li>Payment window is 5 days from the date of invoice.</li>
                      </ol>
                    </div>
                    <div className="bg-slate-50 p-3 rounded border border-blue-200">
                      <h4 className="font-bold text-slate-800 mb-2">Bank Details</h4>
                      <div className="grid grid-cols-[100px_1fr] gap-1 text-slate-700">
                        <div className="font-semibold">Bank Name:</div>
                        <div>HDFC Bank</div>
                        <div className="font-semibold">Account No:</div>
                        <div className="font-medium">50200034478826</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 text-right text-xs text-slate-500 font-semibold pt-4">
                    For SVL CARGO
                    <br /><br /><br />
                    Authorized Signatory
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
