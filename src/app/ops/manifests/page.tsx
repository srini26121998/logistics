"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MANIFESTS, SHIPMENTS, Manifest, ULD } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { PlaneTakeoff, Search, Plus, Filter, FileOutput, Package, Settings2, X, Check, BarChart, Truck, Activity, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function FlightManifestsPage() {
  const [manifests, setManifests] = useState<Manifest[]>(MANIFESTS);
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedManifest, setSelectedManifest] = useState<Manifest | null>(null);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  
  // Modals for dynamic flow
  const [isAddUldModalOpen, setIsAddUldModalOpen] = useState(false);
  const [newUld, setNewUld] = useState({ type: "AKE", no: "", carrier: "IN" });

  const [isAddAwbModalOpen, setIsAddAwbModalOpen] = useState(false);
  const [selectedUldId, setSelectedUldId] = useState<string | null>(null);
  const [selectedAwb, setSelectedAwb] = useState("");

  const [newManifest, setNewManifest] = useState({
    flightNo: "",
    carrier: "",
    origin: "",
    destination: "",
    departureTime: ""
  });

  const handleCreateManifest = () => {
    if (!newManifest.flightNo || !newManifest.origin || !newManifest.destination) {
      toast.error("Please fill in the required fields (Flight No, Origin, Destination)");
      return;
    }

    const dateObj = newManifest.departureTime ? new Date(newManifest.departureTime) : new Date();
    const dateStr = dateObj.toISOString().split('T')[0];
    const timeStr = dateObj.toTimeString().split(':')[0] + ":" + dateObj.toTimeString().split(':')[1];

    const added: Manifest = {
      id: Date.now().toString(),
      flightNo: newManifest.flightNo.toUpperCase(),
      carrier: newManifest.carrier || "Unknown Carrier",
      origin: newManifest.origin.toUpperCase(),
      destination: newManifest.destination.toUpperCase(),
      date: dateStr,
      departure: timeStr,
      status: "Open",
      awbCount: 0,
      totalPieces: 0,
      totalWeight: "0 kg",
      ulds: []
    };

    setManifests([added, ...manifests]);
    toast.success("Manifest created successfully!");
    setIsCreateModalOpen(false);
    setNewManifest({ flightNo: "", carrier: "", origin: "", destination: "", departureTime: "" });
  };

  const handleAddUldSubmit = () => {
    if (!newUld.no) {
      toast.error("Please enter a ULD Number");
      return;
    }
    if (selectedManifest) {
      const uld: ULD = {
        id: Date.now().toString(),
        type: newUld.type,
        no: newUld.no,
        carrier: newUld.carrier,
        pcs: 0,
        wt: 0,
        awbs: []
      };
      
      const updatedManifest = {
        ...selectedManifest,
        ulds: [...(selectedManifest.ulds || []), uld]
      };
      
      updateManifestState(updatedManifest);
      setIsAddUldModalOpen(false);
      setNewUld({ type: "AKE", no: "", carrier: "IN" });
      toast.success("ULD added successfully!");
    }
  };

  const availableShipments = SHIPMENTS.filter(s => {
    if (!selectedManifest) return false;
    const isOriginMatch = s.origin === selectedManifest.origin;
    const isStatusReady = s.status === 'Booked' || s.status === 'Picked Up' || s.status === 'Warehouse';
    return isOriginMatch && isStatusReady;
  });

  const handleAddAwbSubmit = () => {
    if (!selectedAwb || !selectedUldId || !selectedManifest) return;

    const shipment = SHIPMENTS.find(s => s.awb === selectedAwb);
    if (!shipment) return;

    // Mutate global shipments
    shipment.status = `Manifested / Loaded on ${selectedManifest.flightNo}`;
    shipment.flight = selectedManifest.flightNo;

    const shipmentWt = parseFloat(shipment.weight) || 0;

    const updatedUlds = (selectedManifest.ulds || []).map(uld => {
      if (uld.id === selectedUldId) {
        return {
          ...uld,
          pcs: uld.pcs + shipment.pieces,
          wt: uld.wt + shipmentWt,
          awbs: [...uld.awbs, shipment.awb]
        };
      }
      return uld;
    });

    const currentWt = parseFloat(selectedManifest.totalWeight) || 0;
    
    const updatedManifest: Manifest = {
      ...selectedManifest,
      awbCount: selectedManifest.awbCount + 1,
      totalPieces: selectedManifest.totalPieces + shipment.pieces,
      totalWeight: `${currentWt + shipmentWt} kg`,
      ulds: updatedUlds
    };

    updateManifestState(updatedManifest);
    setIsAddAwbModalOpen(false);
    setSelectedAwb("");
    toast.success("AWB added to ULD successfully!");
  };

  const updateManifestState = (updated: Manifest) => {
    setSelectedManifest(updated);
    setManifests(prev => prev.map(m => m.id === updated.id ? updated : m));
    // Update global array for persistence across tabs
    const idx = MANIFESTS.findIndex(m => m.id === updated.id);
    if (idx !== -1) MANIFESTS[idx] = updated;
  };

  const handleFlightDispatch = (manifest: Manifest) => {
    if (manifest.status === 'Departed') return;
    
    const updated: Manifest = { ...manifest, status: 'Departed' };
    
    // Update all AWBs in this manifest to 'Departed Origin'
    if (manifest.ulds) {
      manifest.ulds.forEach(uld => {
        uld.awbs.forEach(awbNo => {
          const shipment = SHIPMENTS.find(s => s.awb === awbNo);
          if (shipment) {
            shipment.status = 'Departed Origin';
          }
        });
      });
    }

    setManifests(prev => prev.map(m => m.id === updated.id ? updated : m));
    const idx = MANIFESTS.findIndex(m => m.id === updated.id);
    if (idx !== -1) MANIFESTS[idx] = updated;
    
    toast.success(`Flight ${manifest.flightNo} has been dispatched.`);
  };

  const handleFlightClose = (manifest: Manifest) => {
    if (manifest.status !== 'Open') return;
    const updated: Manifest = { ...manifest, status: 'Closed' };
    updateManifestState(updated);
    toast.success(`Flight ${manifest.flightNo} is now closed.`);
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
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <PlaneTakeoff className="w-6 h-6 text-indigo-500" />
            Flight Manifests
          </h1>
          <p className="text-sm text-slate-400 mt-1">Manage outbound flight buildup and ULD containerization.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleGenerateReport} className="flex items-center gap-2 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors border border-slate-700">
            <FileOutput className="w-4 h-4" /> Reports
          </button>
          <button onClick={() => setIsCreateModalOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> Create Manifest
          </button>
        </div>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row justify-between items-center gap-4 bg-slate-900/80">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search flight number, sector..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className={`p-2 border rounded-lg sm:ml-auto transition-colors ${isFiltersOpen ? "bg-indigo-500/20 text-indigo-400 border-indigo-500/30" : "bg-slate-800 border-slate-700 text-slate-400 hover:text-white"}`}>
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-3 bg-slate-800/50 border-b border-slate-700/50 flex gap-4 items-center overflow-hidden"
            >
              <div className="text-sm text-slate-400">Quick Filters:</div>
              <div className="flex gap-2">
                {["All", "Departed", "Open", "Closed"].map(status => (
                  <button key={status} className="px-3 py-1 rounded bg-slate-700 text-xs text-slate-300 hover:bg-indigo-600 hover:text-white transition-colors">
                    {status}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-slate-900/90 sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-slate-800">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Flight Info</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Sector</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Cargo Summary</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Departure</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-400 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/50">
              {filteredManifests.map((manifest, idx) => (
                <motion.tr 
                  key={manifest.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-800/30 transition-colors group"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                        <PlaneTakeoff className="w-5 h-5 text-indigo-400" />
                      </div>
                      <div>
                        <div className="font-semibold text-white text-base">{manifest.flightNo}</div>
                        <div className="text-xs text-slate-400">{manifest.carrier}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2 text-sm font-semibold text-slate-300">
                      <span>{manifest.origin}</span>
                      <span className="text-slate-600">→</span>
                      <span>{manifest.destination}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-sm font-medium text-white flex items-center gap-1.5 justify-end">
                        <Package className="w-3.5 h-3.5 text-slate-500" />
                        {manifest.awbCount} AWBs ({manifest.totalPieces} Pcs)
                      </span>
                      <span className="text-xs text-indigo-300 font-mono">{manifest.totalWeight}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-300">{manifest.date}</div>
                    <div className="text-xs font-mono text-slate-500">STD: {manifest.departure}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={manifest.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right space-x-2">
                    <button onClick={() => handleFlightDispatch(manifest)} disabled={manifest.status === 'Departed'} className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-xs font-medium text-emerald-400 hover:bg-emerald-500 hover:text-white transition-all disabled:opacity-50">
                      Dispatch
                    </button>
                    <button onClick={() => setSelectedManifest(manifest)} className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-800 text-xs font-medium text-white hover:bg-indigo-600 hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all">
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
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800">
                <h2 className="text-xl font-bold text-white flex items-center gap-2">
                  <PlaneTakeoff className="w-5 h-5 text-indigo-400" />
                  Create New Manifest
                </h2>
                <button onClick={() => setIsCreateModalOpen(false)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Flight Number <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.flightNo} onChange={(e) => setNewManifest({...newManifest, flightNo: e.target.value})} placeholder="e.g. 6E-1234" className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Carrier</label>
                    <input type="text" value={newManifest.carrier} onChange={(e) => setNewManifest({...newManifest, carrier: e.target.value})} placeholder="e.g. IndiGo" className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Origin <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.origin} onChange={(e) => setNewManifest({...newManifest, origin: e.target.value})} placeholder="e.g. DEL" className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-400">Destination <span className="text-red-400">*</span></label>
                    <input type="text" value={newManifest.destination} onChange={(e) => setNewManifest({...newManifest, destination: e.target.value})} placeholder="e.g. BOM" className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                  </div>
                </div>
                <div className="space-y-1.5 mt-2">
                  <label className="text-xs font-medium text-slate-400">Departure Time</label>
                  <input type="datetime-local" value={newManifest.departureTime} onChange={(e) => setNewManifest({...newManifest, departureTime: e.target.value})} className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3">
                <button onClick={() => setIsCreateModalOpen(false)} className="px-4 py-2 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">
                  Cancel
                </button>
                <button onClick={handleCreateManifest} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                  <Check className="w-4 h-4" /> Save Manifest
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {selectedManifest && !isAddUldModalOpen && !isAddAwbModalOpen && (
          <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="flex justify-between items-center p-6 border-b border-slate-800 shrink-0">
                <div>
                  <h2 className="text-xl font-bold text-white flex items-center gap-2">
                    <Settings2 className="w-5 h-5 text-indigo-400" />
                    Manage ULD: {selectedManifest.flightNo}
                  </h2>
                  <p className="text-xs text-slate-400 mt-1">{selectedManifest.origin} → {selectedManifest.destination} | {selectedManifest.carrier}</p>
                </div>
                <button onClick={() => setSelectedManifest(null)} className="text-slate-400 hover:text-white transition-colors">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-6 space-y-6 overflow-y-auto custom-scrollbar flex-1">
                
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                    <Package className="w-6 h-6 text-indigo-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedManifest.awbCount}</div>
                    <div className="text-xs text-slate-400">Total AWBs</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                    <Activity className="w-6 h-6 text-emerald-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedManifest.totalPieces}</div>
                    <div className="text-xs text-slate-400">Total Pieces</div>
                  </div>
                  <div className="bg-slate-800/50 p-4 rounded-xl border border-slate-700/50 flex flex-col items-center justify-center text-center">
                    <BarChart className="w-6 h-6 text-blue-400 mb-2" />
                    <div className="text-2xl font-bold text-white">{selectedManifest.totalWeight}</div>
                    <div className="text-xs text-slate-400">Gross Weight</div>
                  </div>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <h3 className="text-sm font-semibold text-white">Assigned ULDs</h3>
                    <button onClick={() => setIsAddUldModalOpen(true)} className="text-xs font-medium text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded transition-colors">
                      <Plus className="w-3 h-3" /> Add Container
                    </button>
                  </div>
                  <div className="space-y-3">
                    <AnimatePresence>
                      {(selectedManifest.ulds || []).map((uld) => (
                        <motion.div 
                          key={uld.id} 
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="flex flex-col p-4 rounded-lg bg-slate-800/30 border border-slate-700"
                        >
                          <div className="flex items-center justify-between mb-3 border-b border-slate-700/50 pb-3">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded bg-slate-700 flex items-center justify-center">
                                <Truck className="w-4 h-4 text-slate-300" />
                              </div>
                              <div>
                                <div className="text-sm font-medium text-white">{uld.type}{uld.no}{uld.carrier}</div>
                                <div className="text-xs text-slate-400">{uld.pcs} Pieces • {uld.wt} kg</div>
                              </div>
                            </div>
                            <span className="text-xs font-medium px-2 py-1 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/20">Buildup</span>
                          </div>
                          
                          <div className="text-xs text-slate-400 mb-2 font-medium">Loaded AWBs ({uld.awbs.length})</div>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {uld.awbs.map(awb => (
                              <span key={awb} className="px-2 py-1 rounded bg-slate-800 border border-slate-600 text-xs text-slate-300 font-mono">
                                {awb}
                              </span>
                            ))}
                            {uld.awbs.length === 0 && <span className="text-xs text-slate-500 italic">No AWBs loaded yet</span>}
                          </div>

                          <button onClick={() => { setSelectedUldId(uld.id); setIsAddAwbModalOpen(true); }} className="mt-2 w-full py-2 rounded border border-dashed border-slate-600 text-slate-400 text-xs font-medium hover:border-indigo-500 hover:text-indigo-400 transition-colors flex items-center justify-center gap-2 bg-slate-900/50">
                            <ArrowRight className="w-3 h-3" /> Scan & Load AWB
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {(selectedManifest.ulds || []).length === 0 && (
                      <div className="text-center py-6 text-slate-500 border border-dashed border-slate-700 rounded-lg bg-slate-800/10">
                        <Package className="w-8 h-8 mx-auto mb-2 text-slate-600" />
                        <p className="text-sm">No ULDs added yet</p>
                      </div>
                    )}
                  </div>
                </div>

              </div>
              <div className="p-6 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-3 shrink-0">
                <button onClick={() => handleFlightClose(selectedManifest)} className="px-4 py-2 border border-slate-600 hover:bg-slate-700 text-white rounded-lg text-sm font-medium transition-colors">
                  Close Flight
                </button>
                <button onClick={() => setSelectedManifest(null)} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddUldModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-sm overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Add Container / Pallet</h3>
                <button onClick={() => setIsAddUldModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4 space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">ULD Type</label>
                  <select value={newUld.type} onChange={e => setNewUld({...newUld, type: e.target.value})} className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500">
                    <option value="AKE">AKE (Half Pallet Container)</option>
                    <option value="PMC">PMC (Main Deck Pallet)</option>
                    <option value="PAG">PAG (Lower Deck Pallet)</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">ULD Number (e.g. 88990)</label>
                  <input type="text" value={newUld.no} onChange={e => setNewUld({...newUld, no: e.target.value})} className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-slate-400">Carrier Code (e.g. IN)</label>
                  <input type="text" value={newUld.carrier} onChange={e => setNewUld({...newUld, carrier: e.target.value})} className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-2">
                <button onClick={() => setIsAddUldModalOpen(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleAddUldSubmit} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors">Save ULD</button>
              </div>
            </motion.div>
          </div>
        )}

        {isAddAwbModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4">
            <motion.div 
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-slate-900 border border-slate-700 rounded-xl w-full max-w-md overflow-hidden shadow-2xl"
            >
              <div className="flex justify-between items-center p-4 border-b border-slate-800">
                <h3 className="text-base font-bold text-white">Select AWB to Load</h3>
                <button onClick={() => setIsAddAwbModalOpen(false)} className="text-slate-400 hover:text-white">
                  <X className="w-4 h-4" />
                </button>
              </div>
              <div className="p-4">
                {availableShipments.length === 0 ? (
                  <div className="text-sm text-slate-400 text-center py-4">No eligible AWBs found in warehouse for this origin.</div>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto custom-scrollbar pr-2">
                    {availableShipments.map(s => (
                      <div key={s.id} onClick={() => setSelectedAwb(s.awb)} className={`p-3 rounded-lg border cursor-pointer transition-all ${selectedAwb === s.awb ? 'border-indigo-500 bg-indigo-500/10' : 'border-slate-700 bg-[#0A0A0B] hover:border-slate-500'}`}>
                        <div className="flex justify-between items-center">
                          <div className="font-mono text-sm text-white">{s.awb}</div>
                          <div className="text-xs text-slate-400">{s.origin} → {s.destination}</div>
                        </div>
                        <div className="flex justify-between items-center mt-1">
                          <div className="text-xs text-slate-500">{s.pieces} Pcs | {s.weight}</div>
                          <div className="text-xs text-indigo-400">{s.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="p-4 border-t border-slate-800 bg-slate-800/30 flex justify-end gap-2">
                <button onClick={() => setIsAddAwbModalOpen(false)} className="px-3 py-1.5 rounded-lg text-sm font-medium text-slate-300 hover:text-white transition-colors">Cancel</button>
                <button onClick={handleAddAwbSubmit} disabled={!selectedAwb} className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50">Load AWB</button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
