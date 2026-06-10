"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MANIFESTS } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { PlaneTakeoff, Search, Plus, Filter, FileOutput, Package, Settings2, X, Check, Upload, BarChart, Truck, Users, Activity } from "lucide-react";
import { toast } from "sonner";

export default function FlightManifestsPage() {
  const [manifests, setManifests] = useState(MANIFESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<any>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  const [assignedUlds, setAssignedUlds] = useState<any[]>([]);
  const [newManifest, setNewManifest] = useState({
    flightNo: "",
    carrier: "",
    origin: "",
    destination: "",
    departureTime: ""
  });

  useEffect(() => {
    if (selectedManifest) {
      setAssignedUlds([
        { id: 1, type: "AKE", no: Math.floor(Math.random() * 90000 + 10000), pcs: Math.floor(Math.random() * 50 + 10), wt: Math.floor(Math.random() * 500 + 100) },
        { id: 2, type: "AKE", no: Math.floor(Math.random() * 90000 + 10000), pcs: Math.floor(Math.random() * 50 + 10), wt: Math.floor(Math.random() * 500 + 100) }
      ]);
    }
  }, [selectedManifest]);

  const handleAddUld = () => {
    setAssignedUlds([
      ...assignedUlds,
      { id: Date.now(), type: "AKE", no: Math.floor(Math.random() * 90000 + 10000), pcs: Math.floor(Math.random() * 50 + 10), wt: Math.floor(Math.random() * 500 + 100) }
    ]);
  };

  const handleCreateManifest = () => {
    if (!newManifest.flightNo || !newManifest.origin || !newManifest.destination) {
      toast.error("Please fill in the required fields (Flight No, Origin, Destination)");
      return;
    }

    const dateObj = newManifest.departureTime ? new Date(newManifest.departureTime) : new Date();
    const dateStr = dateObj.toISOString().split('T')[0];
    const timeStr = dateObj.toTimeString().split(':')[0] + ":" + dateObj.toTimeString().split(':')[1];

    const added = {
      id: Date.now().toString(),
      flightNo: newManifest.flightNo.toUpperCase(),
      carrier: newManifest.carrier || "Unknown Carrier",
      origin: newManifest.origin.toUpperCase(),
      destination: newManifest.destination.toUpperCase(),
      date: dateStr,
      departure: timeStr,
      status: "Open" as "Open" | "Closed" | "Departed",
      awbCount: 0,
      totalPieces: 0,
      totalWeight: "0 kg"
    };

    setManifests([added, ...manifests]);
    toast.success("Manifest created successfully!");
    setIsCreateModalOpen(false);
    setNewManifest({ flightNo: "", carrier: "", origin: "", destination: "", departureTime: "" });
  };

  const filteredManifests = manifests.filter(m => 
    m.flightNo.toLowerCase().includes(searchTerm.toLowerCase()) || 
    m.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    m.destination.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGenerateReport = () => {
    toast.success('Generating flight manifests report...');
    setTimeout(() => {
        const headers = ["Flight No", "Carrier", "Origin", "Destination", "AWBs", "Pieces", "Weight", "Date", "Status"];
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + filteredManifests.map(m => `${m.flightNo},${m.carrier},${m.origin},${m.destination},${m.awbCount},${m.totalPieces},${m.totalWeight},${m.date},${m.status}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `flight_manifests_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Report downloaded successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <PlaneTakeoff className="w-6 h-6 text-indigo-500" />
            Flight Manifests
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage outbound flight buildup and ULD containerization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200">
            <FileOutput className="w-4 h-4" /> Reports
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> Create Manifest
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search flight number, sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className={`p-2 border rounded-lg sm:ml-auto transition-colors ${isFiltersOpen ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200"}`}>
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-3 bg-slate-100/50 border-b border-blue-200 flex gap-4 items-center overflow-hidden"
            >
              <div className="text-sm text-slate-600">Quick Filters:</div>
              <div className="flex gap-2">
                {["All", "Departed", "Open", "Closed"].map(status => (
                  <button key={status} className="px-3 py-1 rounded bg-slate-100 border border-slate-200 text-xs text-slate-700 hover:bg-indigo-600 hover:text-white transition-colors">
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Flight Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Cargo Summary</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredManifests.map((manifest, idx) => (
                <motion.tr 
                  key={manifest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-100/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <PlaneTakeoff className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-base">{manifest.flightNo}</div>
                        <div className="text-xs text-slate-600">{manifest.carrier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
                      <span>{manifest.origin}</span>
                      <span className="text-slate-600">→</span>
                      <span>{manifest.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-slate-900 flex items-center gap-1.5 justify-end">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        {manifest.awbCount} AWBs ({manifest.totalPieces} Pcs)
                      </span>
                      <span className="text-xs text-indigo-600 font-mono">{manifest.totalWeight}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700">{manifest.date}</div>
                    <div className="text-xs font-mono text-slate-500">STD: {manifest.departure}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={manifest.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <button onClick={() => setSelectedManifest(manifest)} className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:text-white hover:bg-indigo-600 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all">
                      Manage ULD
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-blue-200 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5 text-indigo-400" />
                  Create New Manifest
                </h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-600 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Flight Number <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.flightNo} onChange={(e) => setNewManifest({...newManifest, flightNo: e.target.value})} placeholder="e.g. 6E-1234" className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Carrier</label>
                    <input type="text" value={newManifest.carrier} onChange={(e) => setNewManifest({...newManifest, carrier: e.target.value})} placeholder="e.g. IndiGo" className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Origin <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.origin} onChange={(e) => setNewManifest({...newManifest, origin: e.target.value})} placeholder="e.g. DEL" className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Destination <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.destination} onChange={(e) => setNewManifest({...newManifest, destination: e.target.value})} placeholder="e.g. BOM" className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                  <label className="text-xs font-medium text-slate-600">Departure Time</label>
                  <input type="datetime-local" value={newManifest.departureTime} onChange={(e) => setNewManifest({...newManifest, departureTime: e.target.value})} className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-100/30 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-700 hover:text-slate-900 transition-colors">
                  Cancel
                </button>
                <button 
                  onClick={handleCreateManifest} 
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Manifest
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedManifest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white border border-blue-200 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-blue-200">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-indigo-400" />
                    Manage ULD: {selectedManifest.flightNo}
                  </h2>
                  <p className="text-xs text-slate-600 mt-1">{selectedManifest.origin} → {selectedManifest.destination} | {selectedManifest.carrier}</p>
                </div>
                <button onClick={() => setSelectedManifest(null)} className="text-slate-600 hover:text-slate-900 transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6">
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-100/50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center text-center">
                    <Package className="w-6 h-6 text-indigo-400 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{selectedManifest.awbCount}</div>
                    <div className="text-xs text-slate-600">Total AWBs</div>
                  </div>
                  <div className="bg-slate-100/50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center text-center">
                    <Activity className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{selectedManifest.totalPieces}</div>
                    <div className="text-xs text-slate-600">Total Pieces</div>
                  </div>
                  <div className="bg-slate-100/50 p-4 rounded-xl border border-blue-200 flex flex-col items-center justify-center text-center">
                    <BarChart className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-slate-900">{selectedManifest.totalWeight}</div>
                    <div className="text-xs text-slate-600">Gross Weight</div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-semibold text-slate-900 mb-3">Assigned ULDs</h3>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {assignedUlds.map((uld) => (
                        <motion.div 
                          key={uld.id} 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex items-center justify-between p-3 rounded-lg bg-slate-100/30 border border-blue-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                              <Truck className="w-4 h-4 text-slate-700" />
                            </div>
                            <div>
                              <div className="text-sm font-medium text-slate-900">{uld.type}{uld.no}{(selectedManifest?.carrier?.substring(0, 2) || 'XX').toUpperCase()}</div>
                              <div className="text-xs text-slate-600">{uld.pcs} Pieces • {uld.wt} kg</div>
                            </div>
                          </div>
                          <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Loaded</span>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <button onClick={handleAddUld} className="w-full py-3 rounded-lg border border-dashed border-blue-200 text-slate-600 text-sm font-medium hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2">
                      <Plus className="w-4 h-4" /> Add Container / Pallet
                    </button>
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-blue-200 bg-slate-100/30 flex justify-end gap-3">
                <button onClick={() => setSelectedManifest(null)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
