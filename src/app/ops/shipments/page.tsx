"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { SHIPMENTS } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { Package, Search, Filter, Download, Plus, MapPin, Plane, Truck, Calendar } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ShipmentsListPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const filteredShipments = SHIPMENTS.filter((s) => {
    const matchesSearch = 
      s.awb.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.origin.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.destination.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.consignee.toLowerCase().includes(searchTerm.toLowerCase());
      
    const matchesStatus = statusFilter === "All" || s.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const handleExportCSV = () => {
    toast.success('Exporting shipments to CSV...');
    setTimeout(() => {
        const headers = ["AWB", "LR Number", "Origin", "Destination", "Mode", "Carrier", "Booked Date", "ETA", "Consignee", "Pieces", "Weight", "Status"];
        const csvContent = "data:text/csv;charset=utf-8," 
            + headers.join(",") + "\n"
            + filteredShipments.map(s => `${s.awb},${s.lrNumber},${s.origin},${s.destination},${s.mode},${s.carrier},${s.bookedDate},${s.eta},"${s.consignee}",${s.pieces},${s.weight},${s.status}`).join("\n");
        
        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", `shipments_export_${new Date().toISOString().split('T')[0]}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        toast.success("Export downloaded successfully!");
    }, 1500);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Package className="w-6 h-6 text-indigo-500" />
            Shipments
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage and track all active and historical shipments.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleExportCSV} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200">
            <Download className="w-4 h-4" /> Export
          </button>
          <Link href="/quote" className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> New Booking
          </Link>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        {/* Filters */}
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
              <input
                type="text"
                placeholder="Search AWBs, Cities, Clients..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
          <div className="flex items-center gap-2 overflow-x-auto pb-2 sm:pb-0 hide-scrollbar w-full sm:w-auto">
            {["All", "Booked", "In Transit", "Delivered", "Exception", "Customs Hold"].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`whitespace-nowrap px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  statusFilter === status 
                    ? "bg-indigo-500/20 text-indigo-400 border border-indigo-500/30" 
                    : "bg-slate-100 text-slate-600 hover:text-slate-900 border border-slate-300 hover:border-slate-300"
                }`}
              >
                {status}
              </button>
            ))}
            <button onClick={() => setIsFiltersOpen(!isFiltersOpen)} className={`p-2 border rounded-lg ml-auto sm:ml-2 transition-colors ${isFiltersOpen ? "bg-indigo-50 text-indigo-600 border-indigo-200" : "bg-slate-100 border-slate-300 text-slate-600 hover:text-slate-900 hover:bg-slate-200"}`}>
              <Filter className="w-4 h-4" />
            </button>
          </div>
        </div>

        <AnimatePresence>
          {isFiltersOpen && (
            <motion.div 
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="px-4 py-3 bg-slate-100/50 border-b border-blue-200 grid grid-cols-1 sm:grid-cols-3 gap-4 overflow-hidden"
            >
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Date Range</label>
                <div className="relative">
                  <Calendar className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                  <select className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none">
                    <option>Last 7 Days</option>
                    <option>Last 30 Days</option>
                    <option>This Month</option>
                    <option>Custom Range</option>
                  </select>
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Mode of Transport</label>
                <select className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none">
                  <option>All Modes</option>
                  <option>Air Freight</option>
                  <option>Road Transport</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-slate-600">Carrier</label>
                <select className="w-full bg-slate-50 border border-blue-200 rounded-lg px-3 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 appearance-none">
                  <option>All Carriers</option>
                  <option>IndiGo</option>
                  <option>Air India</option>
                  <option>Emirates</option>
                  <option>BlueDart</option>
                </select>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Table */}
        <div className="flex-1 overflow-auto custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">AWB / LR</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Route & Mode</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Dates</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Consignee</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {filteredShipments.map((item, idx) => (
                <motion.tr 
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="hover:bg-slate-100/30 transition-colors"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col">
                      <Link href={`/track/${item.awb}`} className="text-sm font-medium text-slate-900 hover:text-indigo-400 transition-colors">
                        {item.awb}
                      </Link>
                      <span className="text-xs text-slate-500 font-mono mt-0.5">{item.lrNumber}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2 text-sm">
                        <span className="font-semibold text-slate-700">{item.origin}</span>
                        <span className="text-slate-600">→</span>
                        <span className="font-semibold text-slate-700">{item.destination}</span>
                      </div>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500">
                        {item.mode === 'Air' ? <Plane className="w-3 h-3" /> : <Truck className="w-3 h-3" />}
                        {item.carrier}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <div className="flex flex-col gap-1">
                      <span className="text-slate-700">B: {item.bookedDate}</span>
                      <span className="text-slate-500">E: {item.eta}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-700 truncate max-w-[150px]">{item.consignee}</div>
                    <div className="text-xs text-slate-500">{item.pieces} NOP | {item.weight}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <StatusBadge status={item.status} />
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <Link 
                      href={`/track/${item.awb}`}
                      className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white hover:shadow-[0_0_10px_rgba(79,70,229,0.3)] transition-all"
                    >
                      View Details
                    </Link>
                  </td>
                </motion.tr>
              ))}
              
              {filteredShipments.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                    <Package className="w-12 h-12 mx-auto mb-4 text-slate-600" />
                    <p className="text-base font-medium text-slate-600">No shipments found</p>
                    <p className="text-sm mt-1">Try adjusting your search or filters.</p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
