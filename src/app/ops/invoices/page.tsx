"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { INVOICES, formatINR } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { DollarSign, Search, Filter, Plus, FileText, Download, Eye, X } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

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

  useEffect(() => {
    const newInvoiceId = sessionStorage.getItem('new_invoice_id');
    if (newInvoiceId) {
      const newInvoice = INVOICES.find(inv => inv.id === newInvoiceId);
      if (newInvoice) {
        setSelectedInvoiceForPdf(newInvoice);
      }
      sessionStorage.removeItem('new_invoice_id');
    }
  }, []);

  const handleExportReport = () => {
    const headers = ["Invoice No", "Client", "Issue Date", "Due Date", "Taxable Amount", "Status"];
    const csvContent = [
      headers.join(","),
      ...filteredInvoices.map(inv => 
        `"${inv.invoiceNo}","${inv.clientName}","${inv.date}","${inv.dueDate}",${inv.taxableAmount},"${inv.status}"`
      )
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "invoices_report.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Exported report successfully");
  };

  const handleDownloadPdf = async () => {
    if (!selectedInvoiceForPdf) return;
    const element = document.getElementById("invoice-print-area");
    if (!element) {
      toast.error("Invoice area not found");
      return;
    }
    
    const toastId = toast.loading("Generating PDF...");
    try {
      const imgData = await toPng(element, { pixelRatio: 2 });
      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = (element.offsetHeight * pdfWidth) / element.offsetWidth;
      
      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
      pdf.save(`Invoice_${selectedInvoiceForPdf.invoiceNo.replace(/\//g, "_")}.pdf`);
      toast.success("PDF Downloaded successfully", { id: toastId });
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF", { id: toastId });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <DollarSign className="w-6 h-6 text-emerald-500" />
            Tax Invoices & Billing
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage billing, payments, and outstanding invoices.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportReport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <Download className="w-4 h-4" /> Export Report
          </button>
          <Link href="/ops/invoices/generate" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> Generate Invoice
          </Link>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/80">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search invoice number, client..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-emerald-500"
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
                    : "bg-slate-800 text-slate-400 hover:text-white border border-slate-700 hover:border-slate-600"
                }`}
              >
                {status}
              </button>
            ))}
            <button onClick={() => toast.info('Advanced filters opened')} className="p-2 bg-slate-800 border border-slate-700 rounded-lg text-slate-400 hover:text-white ml-auto sm:ml-2">
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Invoice Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Amount</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredInvoices.map((inv, idx) => (
                <motion.tr 
                  key={inv.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-emerald-400" />
                      </div>
                      <div>
                        <div className="font-bold text-white">{inv.invoiceNo}</div>
                        <div className="text-xs text-slate-400 mt-0.5">{inv.awbCount} AWBs Consolidated</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-slate-300">{inv.clientName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1 text-sm">
                      <span className="text-slate-300">Issue: {inv.date}</span>
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
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-white hover:bg-emerald-600 hover:shadow-[0_0_10px_rgba(16,185,129,0.3)] transition-all gap-1.5"
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
                    <p className="text-base font-medium text-slate-400">No invoices found</p>
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
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-slate-800">
                  <FileText className="w-5 h-5 text-emerald-600" /> Invoice {selectedInvoiceForPdf.invoiceNo}
                </h2>
                <div className="flex items-center gap-2">
                  <button onClick={handleDownloadPdf} className="px-3 py-1.5 bg-slate-800 text-white rounded-lg text-xs font-medium hover:bg-slate-700 flex items-center gap-1.5 transition-colors">
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
                <div id="invoice-print-area" className="bg-white shadow-lg w-full max-w-[297mm] min-h-[210mm] p-8 flex flex-col font-sans text-sm print-area">
                  
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
                      <h3 className="font-bold text-sm text-slate-900 mt-1">{selectedInvoiceForPdf.clientName}</h3>
                    </div>
                    <div className="w-1/3 text-right">
                      <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-xs justify-end font-bold text-slate-900">
                        <div className="text-right">INVOICE NO :</div>
                        <div className="text-left">{selectedInvoiceForPdf.invoiceNo}</div>
                        <div className="text-right">INVOICE DATE :</div>
                        <div className="text-left">{selectedInvoiceForPdf.date}</div>
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
                        {Array.from({ length: selectedInvoiceForPdf.awbCount }).map((_, idx) => {
                          // Mocking line item data to look like real rows
                          const freight = Math.round(selectedInvoiceForPdf.taxableAmount / selectedInvoiceForPdf.awbCount * 0.7);
                          const other = Math.round(selectedInvoiceForPdf.taxableAmount / selectedInvoiceForPdf.awbCount * 0.3);
                          const taxable = freight + other;
                          const igst = taxable * 0.18;
                          const net = taxable + igst;
                          return (
                            <tr key={idx} className="border-b border-slate-400">
                              <td className="py-1.5 px-1 border-r border-slate-400">{idx + 1}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">03-May</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">2729309{idx}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">6E 321</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">PNQ</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">BLR</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">5</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">101</td>
                              <td className="py-1.5 px-1 border-r border-slate-400">18.00</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{freight.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{other.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{taxable.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{taxable.toFixed(2)}</td>
                              <td className="py-1.5 px-1 border-r border-slate-400 text-right">{igst.toFixed(2)}</td>
                              <td className="py-1.5 px-1 text-right">{net.toFixed(2)}</td>
                            </tr>
                          );
                        })}
                        {/* Grand Total Row */}
                        <tr className="border-b border-slate-400 font-bold bg-slate-50">
                          <td colSpan={6} className="py-2 px-1 border-r border-slate-400 text-right">Total</td>
                          <td className="py-2 px-1 border-r border-slate-400">10</td>
                          <td className="py-2 px-1 border-r border-slate-400">123</td>
                          <td className="py-2 px-1 border-r border-slate-400">42.00</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{(selectedInvoiceForPdf.taxableAmount * 0.7).toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{(selectedInvoiceForPdf.taxableAmount * 0.3).toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{selectedInvoiceForPdf.taxableAmount.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{selectedInvoiceForPdf.taxableAmount.toFixed(2)}</td>
                          <td className="py-2 px-1 border-r border-slate-400 text-right">{(selectedInvoiceForPdf.total - selectedInvoiceForPdf.taxableAmount).toFixed(2)}</td>
                          <td className="py-2 px-1 text-right">{selectedInvoiceForPdf.total.toFixed(2)}</td>
                        </tr>
                        <tr className="border-b border-slate-400 font-bold">
                          <td colSpan={14} className="py-2 px-1 border-r border-slate-400 text-right">Net Payable</td>
                          <td className="py-2 px-1 text-right">{selectedInvoiceForPdf.total.toFixed(2)}</td>
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
    </div>
  );
}
