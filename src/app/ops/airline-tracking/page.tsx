"use client";
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AIRLINE_AWB_PREFIXES, AIRLINE_TRACKING_CONFIG, SHIPMENTS } from "@/data/mockData";
import { detectAirlineFromAWB, openAirlineTracking } from "@/utils/airlineTracker";
import { Plane, Search, ExternalLink, Package, Clock, MapPin, AlertTriangle, Settings, Plus, X, Check } from "lucide-react";
import { toast } from "sonner";

export default function AirlineTrackingPage() {
  const [awbInput, setAwbInput] = useState("");
  const [detected, setDetected] = useState<ReturnType<typeof detectAirlineFromAWB> | null>(null);
  const [shipment, setShipment] = useState<typeof SHIPMENTS[0] | null>(null);
  const [showManualUrlModal, setShowManualUrlModal] = useState(false);
  const [manualUrl, setManualUrl] = useState("");

  const handleLookup = () => {
    if (!awbInput || awbInput.length < 3) { toast.error("Enter a valid AWB number (e.g. 312-66761752 or 6E-1234)"); return; }

    const result = detectAirlineFromAWB(awbInput);
    setDetected(result);

    if (result.found) {
      toast.success(`Airline detected: ${result.airline?.airline}`);
    } else {
      toast.error("Airline not configured. Please contact Admin or enter a custom tracking URL.");
    }

    const found = SHIPMENTS.find(s => s.awb === awbInput || s.awb.includes(awbInput));
    setShipment(found || null);
  };

  const handleTrackShipment = () => {
    if (!detected?.found) {
      setShowManualUrlModal(true);
      return;
    }
    const result = openAirlineTracking(awbInput);
    if (result.found) {
      toast.success(`Opening ${result.airline?.airline} tracking in new tab. You remain on this page.`);
    }
  };

  const handleManualTrack = () => {
    if (!manualUrl) { toast.error("Please enter a valid tracking URL"); return; }
    window.open(manualUrl, '_blank', 'noopener,noreferrer');
    toast.success("Opening custom tracking URL in new tab...");
    setShowManualUrlModal(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Plane className="w-6 h-6 text-indigo-500" /></motion.div>
          Airline Docket Smart Tracking
        </h1>
        <p className="text-sm text-slate-500 mt-1">Lookup AWB numbers and redirect to airline cargo tracking portals. System auto-detects airline from AWB prefix.</p>
      </div>

      {/* Search */}
      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl p-8 card-3d">
        <div className="w-full">
          <label className="text-sm font-semibold text-slate-700 mb-2 block">Enter AWB / Docket Number</label>
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input type="text" value={awbInput} onChange={e => setAwbInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleLookup()} placeholder="e.g. 312-66761752 or 6E-1234" className="w-full bg-white border border-blue-200 rounded-xl pl-10 pr-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 text-lg font-mono" />
            </div>
            <button onClick={handleLookup} className="px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-medium transition-colors">Detect</button>
          </div>
        </div>

        {/* Result */}
        {detected && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full mt-8 space-y-4">
            {detected.found ? (
              <div className="bg-slate-50 rounded-xl border border-blue-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-bold text-lg shadow-lg shadow-indigo-500/20">
                      {detected.airline?.awbPrefix?.replace('-', '') || detected.prefix || '✈'}
                    </div>
                    <div>
                      <div className="font-bold text-slate-900 text-lg">{detected.airline?.airline}</div>
                      <div className="text-sm text-slate-500 font-mono">AWB: {awbInput}</div>
                    </div>
                  </div>
                  <button onClick={handleTrackShipment} className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl text-sm font-medium transition-all shadow-lg shadow-indigo-500/20 hover:shadow-indigo-500/30">
                    Track Shipment <ExternalLink className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 mt-2 p-3 bg-white rounded-lg border border-blue-200 font-mono truncate">
                  URL: {detected.trackingUrl}
                </div>

                {shipment && (
                  <div className="space-y-3 pt-4 mt-4 border-t border-blue-200">
                    <div className="text-xs font-semibold text-slate-500 uppercase">Internal System Tracking</div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded-lg border border-blue-200"><div className="text-xs text-slate-500">Route</div><div className="text-sm font-bold text-slate-900">{shipment.origin} → {shipment.destination}</div></div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200"><div className="text-xs text-slate-500">Status</div><div className="text-sm font-bold text-indigo-600">{shipment.status}</div></div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200"><div className="text-xs text-slate-500">Carrier</div><div className="text-sm font-bold text-slate-900">{shipment.carrier}</div></div>
                      <div className="bg-white p-3 rounded-lg border border-blue-200"><div className="text-xs text-slate-500">Cargo</div><div className="text-sm font-bold text-slate-900">{shipment.pieces} pcs | {shipment.weight}</div></div>
                    </div>
                    {/* Timeline */}
                    <div className="mt-4">
                      <div className="text-xs font-semibold text-slate-500 uppercase mb-3">Tracking Timeline</div>
                      <div className="space-y-0">
                        {[
                          { status: 'Booked', date: shipment.bookedDate, done: true },
                          { status: 'Picked Up', date: '', done: ['Picked Up', 'In Transit', 'Delivered', 'Out for Delivery', 'Departed Origin', 'Manifested'].includes(shipment.status) },
                          { status: 'Manifested', date: '', done: ['In Transit', 'Delivered', 'Out for Delivery', 'Departed Origin', 'Manifested'].includes(shipment.status) },
                          { status: 'In Transit', date: '', done: ['In Transit', 'Delivered', 'Out for Delivery'].includes(shipment.status) },
                          { status: 'Delivered', date: shipment.status === 'Delivered' ? shipment.eta : '', done: shipment.status === 'Delivered' },
                        ].map((step, i) => (
                          <div key={step.status} className="flex items-start gap-3">
                            <div className="flex flex-col items-center">
                              <div className={`w-3 h-3 rounded-full border-2 ${step.done ? 'bg-indigo-600 border-indigo-600' : 'bg-white border-slate-300'}`} />
                              {i < 4 && <div className={`w-0.5 h-6 ${step.done ? 'bg-indigo-600' : 'bg-slate-200'}`} />}
                            </div>
                            <div className="pb-4"><div className={`text-sm font-medium ${step.done ? 'text-slate-900' : 'text-slate-600'}`}>{step.status}</div>{step.date && <div className="text-xs text-slate-500">{step.date}</div>}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              /* Airline not configured fallback */
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-6">
                <div className="flex items-start gap-3 mb-4">
                  <AlertTriangle className="w-6 h-6 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <h3 className="font-bold text-amber-800 text-lg">Airline Not Configured</h3>
                    <p className="text-sm text-amber-700 mt-1">The AWB prefix "{detected.prefix || awbInput.split('-')[0]}" is not recognized. Please contact Admin to add this airline.</p>
                  </div>
                </div>
                <button onClick={() => setShowManualUrlModal(true)} className="flex items-center gap-2 px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white rounded-lg text-sm font-medium transition-colors">
                  <Plus className="w-4 h-4" /> Enter Custom Tracking URL
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>

      {/* User Flow Summary (Section 5.5.4) */}
      {/* <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
        <div className="p-4 border-b border-blue-200 bg-slate-100/80"><h2 className="text-sm font-semibold text-slate-700">User Flow Summary</h2></div>
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/90 border-b border-blue-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase w-16">Step</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">User Action</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">System Response</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {[
                { step: 1, action: 'Types docket/AWB no. in search box', response: 'Typeahead shows all linked documents (AWB, LR, Booking, Invoice)' },
                { step: 2, action: 'Clicks on AWB suggestion', response: 'Opens AWB detail page' },
                { step: 3, action: "Clicks 'Track Shipment' button", response: "System reads AWB prefix and identifies airline (e.g., '6E-' → IndiGo)" },
                { step: 4, action: '— (automatic)', response: "Opens airline's official cargo tracking in new tab, AWB pre-filled" },
                { step: 5, action: 'Views live status on airline site', response: 'Airline site shows real-time flight/cargo status directly' },
                { step: 6, action: 'Returns to system tab', response: 'All internal records remain open — no navigation lost' },
              ].map(row => (
                <tr key={row.step} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3"><span className="w-7 h-7 rounded-full bg-indigo-500/10 text-indigo-600 text-xs font-bold flex items-center justify-center">{row.step}</span></td>
                  <td className="px-6 py-3 text-sm text-slate-700 font-medium">{row.action}</td>
                  <td className="px-6 py-3 text-sm text-slate-600">{row.response}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div> */}

      {/* Airline Config Table (Section 5.5.2) */}
      <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
        <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
          <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Settings className="w-4 h-4 text-slate-500" /> Supported Airlines — Tracking URL Mapping</h2>
          <span className="text-xs text-slate-500">Admin configurable • No code deployment required</span>
        </div>
        <div className="overflow-auto custom-scrollbar">
          <table className="w-full text-left">
            <thead className="bg-white/90 border-b border-blue-200">
              <tr>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Airline</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">AWB Prefix</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Tracking URL Pattern</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Description</th>
                <th className="px-6 py-3 text-xs font-semibold text-slate-500 uppercase text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {AIRLINE_TRACKING_CONFIG.map(cfg => (
                <tr key={cfg.awbPrefix} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-3 text-sm font-medium text-slate-900">{cfg.airline}</td>
                  <td className="px-6 py-3"><span className="font-mono font-bold text-indigo-600 bg-indigo-500/10 px-2 py-0.5 rounded">{cfg.awbPrefix}</span></td>
                  <td className="px-6 py-3 text-xs text-slate-500 font-mono truncate max-w-[300px]">{cfg.trackingUrlPattern}</td>
                  <td className="px-6 py-3 text-xs text-slate-600">{cfg.description}</td>
                  <td className="px-6 py-3 text-right">
                    <a href={cfg.trackingUrlPattern.replace('{AWB}', '')} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-200 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all">Visit <ExternalLink className="w-3 h-3" /></a>
                  </td>
                </tr>
              ))}
              {/* Other / Unknown row */}
              <tr className="hover:bg-slate-50 transition-colors bg-amber-50/30">
                <td className="px-6 py-3 text-sm font-medium text-slate-600">Other / Unknown</td>
                <td className="px-6 py-3"><span className="text-xs text-slate-500">N/A</span></td>
                <td className="px-6 py-3 text-xs text-slate-500 italic">User prompted to enter tracking URL manually</td>
                <td className="px-6 py-3 text-xs text-slate-600">Manual fallback — admin can configure new airlines</td>
                <td className="px-6 py-3 text-right"><span className="text-xs text-slate-400">—</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Manual URL Modal */}
      <AnimatePresence>
        {showManualUrlModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/60 backdrop-blur-sm px-4">
            <motion.div initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.95, opacity: 0 }} className="bg-white border border-blue-200 rounded-2xl w-full max-w-md shadow-2xl">
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-lg font-bold text-slate-900">Enter Custom Tracking URL</h2>
                <button onClick={() => setShowManualUrlModal(false)} className="text-slate-500 hover:text-indigo-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-slate-600">The airline for this AWB is not configured. Enter the tracking portal URL manually:</p>
                <input type="url" value={manualUrl} onChange={e => setManualUrl(e.target.value)} placeholder="https://..." className="w-full bg-white border border-blue-200 rounded-lg px-4 py-3 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 font-mono" />
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-50 flex justify-end gap-3">
                <button onClick={() => setShowManualUrlModal(false)} className="px-4 py-2 text-sm text-slate-600">Cancel</button>
                <button onClick={handleManualTrack} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium flex items-center gap-2"><ExternalLink className="w-4 h-4" /> Open Tracking</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
