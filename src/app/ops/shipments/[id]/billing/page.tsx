"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHIPMENTS, CUSTOMERS } from "@/data/mockData";
import { ArrowLeft, Printer, Download, Eye, FileText, CheckCircle2, ChevronDown, Building, ShieldCheck, MapPin } from "lucide-react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "sonner";

type BillType = "prepaid" | "destination_scan" | "final_client";

export default function ShipmentBillingPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;
  
  const shipment = SHIPMENTS.find(s => s.awb === id || s.lrNumber === id) || SHIPMENTS[0];
  const client = CUSTOMERS[0]; // Assuming OXEN Logistics for demo

  const [activeBillType, setActiveBillType] = useState<BillType>("prepaid");
  const [showPreview, setShowPreview] = useState(false);

  // Pitstop configuration for demo
  const [hasPitstop, setHasPitstop] = useState(true);
  const [pitstop, setPitstop] = useState("MAA"); // Chennai

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 2 }).format(amount);
  };

  const getBillData = (type: BillType) => {
    let freight = 0;
    let otherCharges = 0;
    let description = "";
    
    if (type === "prepaid") {
      freight = shipment.amount * 0.5; // 50% advance
      otherCharges = 1500;
      description = "Initial Prepaid Billing";
    } else if (type === "destination_scan") {
      freight = shipment.amount * 0.3; // Post scan adj
      otherCharges = 2000;
      description = "Destination Weight Scan Adjusted Billing";
    } else {
      freight = shipment.amount * 0.2; // Final collection
      otherCharges = 500;
      description = "Final Client Settlement Billing";
    }

    const taxable = freight + otherCharges;
    const igst = taxable * 0.18;
    const net = taxable + igst;

    return { freight, otherCharges, taxable, igst, net, description };
  };

  const billData = getBillData(activeBillType);

  const handlePrint = () => {
    window.print();
  };

  const billTabs = [
    { id: "prepaid", label: "1. Prepaid Bill", desc: "Initial Origin Billing" },
    { id: "destination_scan", label: "2. Dest Scan Bill", desc: "Destination Weight Scan" },
    { id: "final_client", label: "3. Final Bill", desc: "Client Receiving Invoice" }
  ];

  return (
    <div className="space-y-6 pb-20">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-white flex items-center gap-3">
              Multi-Stage Billing
            </h1>
            <p className="text-sm text-slate-400 mt-1">Shipment {shipment.awb} • {shipment.origin} to {shipment.destination}</p>
          </div>
        </div>
        <button
          onClick={() => setShowPreview(true)}
          className="flex items-center gap-2 px-4 py-2 bg-fuchsia-600 hover:bg-fuchsia-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(192,38,211,0.3)]"
        >
          <Eye className="w-4 h-4" /> Preview Invoice
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col - Config */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Route Configuration</h2>
            
            <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 bg-slate-950 border border-slate-800 rounded-xl cursor-pointer">
                <input 
                  type="checkbox" 
                  checked={hasPitstop} 
                  onChange={(e) => setHasPitstop(e.target.checked)}
                  className="w-4 h-4 accent-fuchsia-500 rounded"
                />
                <span className="text-sm font-medium text-slate-300">Include Pitstop (Hub)</span>
              </label>

              {hasPitstop && (
                <div className="pl-8 relative before:absolute before:left-5 before:top-0 before:bottom-0 before:w-px before:bg-slate-800">
                  <div className="relative">
                    <div className="absolute left-[-17px] top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-fuchsia-500 shadow-[0_0_10px_rgba(192,38,211,0.5)] z-10"></div>
                    <label className="block text-xs font-medium text-slate-400 mb-1 uppercase">Pitstop Location</label>
                    <select 
                      value={pitstop}
                      onChange={(e) => setPitstop(e.target.value)}
                      className="w-full bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-sm text-white focus:border-fuchsia-500 focus:outline-none"
                    >
                      <option value="MAA">MAA - Chennai</option>
                      <option value="DEL">DEL - Delhi</option>
                      <option value="BOM">BOM - Mumbai</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            <div className="mt-6 flex items-center justify-between p-4 bg-slate-950 rounded-xl border border-slate-800">
               <div className="text-center flex-1">
                 <div className="text-sm font-bold text-slate-200">{shipment.origin}</div>
               </div>
               {hasPitstop && (
                 <>
                   <div className="text-slate-500"><MapPin className="w-4 h-4"/></div>
                   <div className="text-center flex-1">
                     <div className="text-sm font-bold text-fuchsia-400">{pitstop}</div>
                     <div className="text-[10px] text-slate-500 uppercase">Billing Node</div>
                   </div>
                 </>
               )}
               <div className="text-slate-500"><MapPin className="w-4 h-4"/></div>
               <div className="text-center flex-1">
                 <div className="text-sm font-bold text-slate-200">{shipment.destination}</div>
               </div>
            </div>
          </div>

          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Billing Stages</h2>
            <div className="space-y-3">
              {billTabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveBillType(tab.id as BillType)}
                  className={`w-full text-left p-4 rounded-xl transition-all border ${
                    activeBillType === tab.id 
                      ? "bg-fuchsia-500/10 border-fuchsia-500/30 text-fuchsia-400 shadow-[0_0_15px_rgba(192,38,211,0.1)]" 
                      : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700 hover:bg-slate-900"
                  }`}
                >
                  <div className="font-bold text-sm mb-1">{tab.label}</div>
                  <div className="text-xs opacity-80">{tab.desc}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Right Col - Invoice Config & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
              <FileText className="w-5 h-5 text-fuchsia-400" />
              {billTabs.find(t => t.id === activeBillType)?.label} Details
            </h2>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Billing Assignee (Shipper)</div>
                <div className="font-bold text-slate-200">{shipment.shipper}</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">PAN: ABCDE1234F</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">GSTIN: 07ABCDE1234F1Z5</div>
              </div>
              <div className="bg-slate-950 p-4 rounded-xl border border-slate-800">
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2">Billing Consignee</div>
                <div className="font-bold text-slate-200">{shipment.consignee}</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">PAN: PQRST9876G</div>
                <div className="text-xs text-slate-400 mt-1 font-mono">GSTIN: 27PQRST9876G1Z2</div>
              </div>
            </div>

            <div className="bg-slate-950 rounded-xl border border-slate-800 overflow-hidden">
              <table className="w-full text-left text-sm">
                <thead className="bg-slate-900/80 border-b border-slate-800 text-slate-400">
                  <tr>
                    <th className="p-4 font-semibold">Description</th>
                    <th className="p-4 font-semibold text-right">Freight</th>
                    <th className="p-4 font-semibold text-right">Other Charges</th>
                    <th className="p-4 font-semibold text-right">Taxable Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/50">
                  <tr>
                    <td className="p-4 text-slate-200">
                      <div className="font-medium">{billData.description}</div>
                      <div className="text-xs text-slate-500 mt-1">Route: {shipment.origin} {hasPitstop ? `→ ${pitstop}` : ''} → {shipment.destination}</div>
                    </td>
                    <td className="p-4 text-right text-slate-300 font-mono">{formatINR(billData.freight)}</td>
                    <td className="p-4 text-right text-slate-300 font-mono">{formatINR(billData.otherCharges)}</td>
                    <td className="p-4 text-right text-white font-mono font-bold">{formatINR(billData.taxable)}</td>
                  </tr>
                </tbody>
              </table>
              <div className="bg-slate-900/50 p-4 border-t border-slate-800 flex justify-end">
                <div className="w-64 space-y-2 text-sm">
                  <div className="flex justify-between text-slate-400">
                    <span>Taxable Amount</span>
                    <span className="font-mono">{formatINR(billData.taxable)}</span>
                  </div>
                  <div className="flex justify-between text-slate-400">
                    <span>IGST (18%)</span>
                    <span className="font-mono">{formatINR(billData.igst)}</span>
                  </div>
                  <div className="flex justify-between text-fuchsia-400 font-bold pt-2 border-t border-slate-700/50 text-base">
                    <span>Net Payable</span>
                    <span className="font-mono">{formatINR(billData.net)}</span>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Full Page Invoice Preview Modal */}
      <AnimatePresence>
        {showPreview && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-[1000px] h-[90vh] flex flex-col overflow-hidden text-slate-900"
            >
              {/* Modal Header */}
              <div className="px-6 py-4 border-b border-slate-200 flex justify-between items-center bg-slate-50 print:hidden">
                <h2 className="text-lg font-bold text-slate-800">Invoice Preview - {billTabs.find(t=>t.id===activeBillType)?.label}</h2>
                <div className="flex items-center gap-3">
                  <button onClick={handlePrint} className="flex items-center gap-2 px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-lg text-sm font-semibold transition-colors">
                    <Printer className="w-4 h-4" /> Print / PDF
                  </button>
                  <button onClick={() => setShowPreview(false)} className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-semibold transition-colors">
                    Close
                  </button>
                </div>
              </div>

              {/* Printable Area */}
              <div className="flex-1 overflow-auto bg-slate-200/50 p-8 flex justify-center custom-scrollbar">
                <div className="bg-white shadow-lg w-full max-w-[210mm] min-h-[297mm] p-8 flex flex-col font-sans text-sm relative print:m-0 print:shadow-none">
                  
                  {/* Header / Letterhead */}
                  <div className="flex justify-between items-start border-b-2 border-slate-900 pb-6 mb-6">
                    <div>
                      <h1 className="text-3xl font-black tracking-tighter text-slate-900">SVL CARGO SERVICES</h1>
                      <p className="text-xs text-slate-600 mt-1 font-medium">
                        No.1, Kather Garden Nehru High Road, Palavanthangal, Chennai - 600 114.<br />
                        E-mail: svlcargo2017@gmail.com | PAN: ADJFS2013F<br />
                        GSTIN: 33ADJFS2013F1ZJ | STATE: TAMILNADU STATE CODE: 33
                      </p>
                    </div>
                    <div className="text-right">
                      <h2 className="text-xl font-black uppercase tracking-widest text-slate-900 mb-2">TAX INVOICE</h2>
                      <div className="text-xs space-y-1 text-slate-700">
                        <p><span className="font-bold">INVOICE NO:</span> SVL/000/26-27</p>
                        <p><span className="font-bold">INVOICE DATE:</span> {new Date().toLocaleDateString('en-GB')}</p>
                        <p><span className="font-bold">SAC CODE:</span> 996531</p>
                        <p><span className="font-bold text-fuchsia-600">BILL TYPE:</span> {billTabs.find(t=>t.id===activeBillType)?.label.toUpperCase()}</p>
                      </div>
                    </div>
                  </div>

                  {/* Parties Info */}
                  <div className="flex border border-slate-300 mb-6">
                    <div className="w-1/2 p-3 border-r border-slate-300">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">To (Consignee / Billed To)</p>
                      <h3 className="font-black text-slate-900 mb-1">{shipment.consignee}</h3>
                      <p className="text-xs text-slate-700 font-medium font-mono">
                        PAN: PQRST9876G<br/>
                        GSTIN: 27PQRST9876G1Z2
                      </p>
                    </div>
                    <div className="w-1/2 p-3 bg-slate-50/50">
                      <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1">From (Assignee / Shipper)</p>
                      <h3 className="font-bold text-slate-800 mb-1">{shipment.shipper}</h3>
                      <p className="text-xs text-slate-700 font-medium font-mono">
                        PAN: ABCDE1234F<br/>
                        GSTIN: 07ABCDE1234F1Z5
                      </p>
                    </div>
                  </div>

                  {/* Route Info */}
                  {hasPitstop && (
                    <div className="mb-6 p-3 bg-fuchsia-50/50 border border-fuchsia-100 rounded-lg flex items-center justify-center gap-4 text-sm font-semibold text-fuchsia-900">
                      <span>{shipment.origin}</span>
                      <span className="text-fuchsia-400">→</span>
                      <span className="bg-fuchsia-100 px-2 py-0.5 rounded text-fuchsia-800">Pitstop: {pitstop}</span>
                      <span className="text-fuchsia-400">→</span>
                      <span>{shipment.destination}</span>
                    </div>
                  )}

                  {/* Main Table */}
                  <div className="mb-6 border border-slate-300">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead className="bg-slate-100 border-b border-slate-300">
                        <tr>
                          <th className="py-2 px-2 font-bold text-center border-r border-slate-300">Sr.</th>
                          <th className="py-2 px-2 font-bold border-r border-slate-300">CN DT</th>
                          <th className="py-2 px-2 font-bold border-r border-slate-300">CN NO.</th>
                          <th className="py-2 px-2 font-bold border-r border-slate-300">FLIGHT</th>
                          <th className="py-2 px-2 font-bold border-r border-slate-300">ORIGIN</th>
                          <th className="py-2 px-2 font-bold border-r border-slate-300">DEST</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">NOP</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">CH.WT</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">RATE</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">FREIGHT</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">OTHER CHARGES</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">GROSS</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">TAXABLE</th>
                          <th className="py-2 px-2 font-bold text-right border-r border-slate-300">IGST 18%</th>
                          <th className="py-2 px-2 font-bold text-right">NET PAYABLE</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-slate-300">
                          <td className="py-2 px-2 text-center border-r border-slate-300">1</td>
                          <td className="py-2 px-2 border-r border-slate-300 whitespace-nowrap">{shipment.bookedDate}</td>
                          <td className="py-2 px-2 border-r border-slate-300 font-bold whitespace-nowrap">{shipment.awb}</td>
                          <td className="py-2 px-2 border-r border-slate-300">{shipment.flight || 'TBA'}</td>
                          <td className="py-2 px-2 border-r border-slate-300">{shipment.origin}</td>
                          <td className="py-2 px-2 border-r border-slate-300">{hasPitstop && activeBillType === 'prepaid' ? pitstop : shipment.destination}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{shipment.pieces}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{shipment.weight.replace(' kg','')}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{(billData.freight / parseInt(shipment.weight)).toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.freight.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.otherCharges.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.taxable.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.taxable.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.igst.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-bold">{billData.net.toFixed(2)}</td>
                        </tr>
                        {/* Empty filler rows */}
                        {[...Array(5)].map((_, i) => (
                          <tr key={i} className="h-8 border-b border-slate-300">
                            <td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td className="border-r border-slate-300"></td><td></td>
                          </tr>
                        ))}
                      </tbody>
                      <tfoot>
                        <tr className="bg-slate-100 font-bold">
                          <td colSpan={6} className="py-2 px-2 text-center border-r border-slate-300">GRAND TOTAL</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{shipment.pieces}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{shipment.weight.replace(' kg','')}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300"></td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.freight.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.otherCharges.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.taxable.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.taxable.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right border-r border-slate-300">{billData.igst.toFixed(2)}</td>
                          <td className="py-2 px-2 text-right font-black">{billData.net.toFixed(2)}</td>
                        </tr>
                      </tfoot>
                    </table>
                  </div>

                  {/* Bank Details & Terms */}
                  <div className="mt-auto flex border border-slate-300 mb-6 text-xs">
                    <div className="w-1/2 p-3 border-r border-slate-300">
                      <h4 className="font-bold underline mb-2">Terms & Conditions:</h4>
                      <ol className="list-decimal pl-4 space-y-1 font-medium">
                        <li>Difference or any Discrepancy in Bill must be informed within 3 days.</li>
                        <li>Payment should be made within 5 days from receipt of the Bill.</li>
                        <li>Interest @ 24% P.A. will be charged if not paid on time.</li>
                        <li>Payment should be made compulsorily by A/c payee Cheque / DD.</li>
                        <li>Subject to Chennai Jurisdiction only.</li>
                        <li>This is a computer generated invoice and does not require any signature.</li>
                      </ol>
                    </div>
                    <div className="w-1/2 p-3">
                      <h4 className="font-bold underline mb-2 text-fuchsia-900">Bank Details :</h4>
                      <p className="font-bold">M/s. SVL CARGO SERVICES,</p>
                      <p className="font-medium">HDFC BANK LIMITED, NANGANALLUR BRANCH, CHENNAI-600061</p>
                      <p className="font-mono mt-1"><span className="font-bold">IFSC CODE:</span> HDFC0000674</p>
                      <p className="font-mono"><span className="font-bold">Account Number:</span> 50200034478826</p>
                    </div>
                  </div>

                  {/* Signatures */}
                  <div className="flex justify-end pt-8">
                    <div className="text-center w-64">
                      <p className="font-bold mb-8">For - SVL CARGO SERVICES</p>
                      <div className="border-t-2 border-slate-800 pt-2 font-bold uppercase tracking-widest text-xs">
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
