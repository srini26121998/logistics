"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Settings, 
  Search, 
  Plus, 
  Edit2, 
  Save, 
  X, 
  Trash2, 
  ArrowRight,
  TrendingUp,
  Percent,
  AlertCircle,
  CheckCircle2
} from "lucide-react";
import { toast } from "sonner";

// Mock Data
interface Rate {
  id: number;
  origin: string;
  dest: string;
  airline: string;
  baseRate: number;
  fuelSurcharge: number;
  handling: number;
  active: boolean;
  isNew?: boolean;
}

const INITIAL_RATES: Rate[] = [
  { id: 1, origin: "PNQ", dest: "MAA", airline: "IndiGo 6E", baseRate: 45, fuelSurcharge: 15, handling: 5, active: true },
  { id: 2, origin: "PNQ", dest: "MAA", airline: "Air India AI", baseRate: 42, fuelSurcharge: 18, handling: 6, active: true },
  { id: 3, origin: "DEL", dest: "BOM", airline: "Vistara UK", baseRate: 35, fuelSurcharge: 12, handling: 5, active: true },
  { id: 4, origin: "BLR", dest: "DXB", airline: "Emirates EK", baseRate: 120, fuelSurcharge: 45, handling: 15, active: true },
];

export default function PricingAdmin() {
  const [rates, setRates] = useState(INITIAL_RATES);
  const [searchTerm, setSearchTerm] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<any>({});
  const [showToast, setShowToast] = useState(false);

  const filteredRates = rates.filter(r => 
    r.origin.toLowerCase().includes(searchTerm.toLowerCase()) || 
    r.dest.toLowerCase().includes(searchTerm.toLowerCase()) ||
    r.airline.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleEdit = (rate: any) => {
    setEditingId(rate.id);
    setEditForm({ ...rate });
  };

  const handleAddNew = () => {
    const newRate = {
      id: Date.now(),
      origin: "",
      dest: "",
      airline: "",
      baseRate: 0,
      fuelSurcharge: 0,
      handling: 0,
      active: true,
      isNew: true
    };
    setRates([newRate, ...rates]);
    setEditingId(newRate.id);
    setEditForm({ ...newRate });
  };

  const handleSave = () => {
    if (!editForm.origin || !editForm.dest || !editForm.airline) {
      toast.error("Please fill in Origin, Destination, and Airline");
      return;
    }
    const cleanForm = { ...editForm };
    delete cleanForm.isNew;
    setRates(rates.map(r => r.id === editingId ? cleanForm : r));
    setEditingId(null);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleCancel = (rate: any) => {
    if (rate.isNew) {
      setRates(rates.filter(r => r.id !== rate.id));
    }
    setEditingId(null);
  };

  const handleDelete = (id: number) => {
    setRates(rates.filter(r => r.id !== id));
  };

  const handleToggleActive = (id: number) => {
    setRates(rates.map(r => r.id === id ? { ...r, active: !r.active } : r));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans selection:bg-indigo-500/30 pt-8 pb-24">
      
      {/* Toast Notification */}
      <AnimatePresence>
        {showToast && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-emerald-500/90 backdrop-blur text-white px-6 py-3 rounded-full shadow-lg flex items-center gap-2 font-medium"
          >
            <CheckCircle2 className="w-5 h-5" />
            Tariff updated successfully
          </motion.div>
        )}
      </AnimatePresence>

      <div className="w-full">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4"
        >
          <div>
            <h1 className="text-3xl font-bold text-slate-900 tracking-tight flex items-center gap-3">
              <Settings className="w-8 h-8 text-indigo-500" />
              Pricing & Tariff Admin
            </h1>
            <p className="text-slate-600 mt-2">
              Manage live airline rates, surcharges, and routing fees.
            </p>
          </div>
          <button onClick={handleAddNew} className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-medium transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] flex items-center gap-2">
            <Plus className="w-5 h-5" /> Add New Route
          </button>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-4 mb-6 flex items-center gap-4"
        >
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search route (e.g., PNQ) or airline..."
              className="w-full bg-white border border-blue-200 rounded-xl py-2 pl-10 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
          <div className="text-sm text-slate-600">
            Showing {filteredRates.length} active routes
          </div>
        </motion.div>

        {/* Rates Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden"
        >
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-white border-b border-blue-200 text-slate-600 uppercase text-xs font-semibold">
                <tr>
                  <th className="px-6 py-4">Route</th>
                  <th className="px-6 py-4">Airline / Carrier</th>
                  <th className="px-6 py-4 text-right">Base Rate (₹/kg)</th>
                  <th className="px-6 py-4 text-right">FSC (₹/kg)</th>
                  <th className="px-6 py-4 text-right">Handling (₹/kg)</th>
                  <th className="px-6 py-4 text-right">Total (₹/kg)</th>
                  <th className="px-6 py-4 text-center">Status</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {filteredRates.map((rate) => (
                  <tr key={rate.id} className="hover:bg-slate-100/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      {editingId === rate.id && rate.isNew ? (
                        <div className="flex items-center gap-2">
                          <input type="text" placeholder="Orig" value={editForm.origin} onChange={(e) => setEditForm({...editForm, origin: e.target.value.toUpperCase()})} className="w-16 bg-white border border-indigo-500 rounded px-2 py-1 text-slate-900 uppercase" maxLength={3} />
                          <ArrowRight className="w-3 h-3 text-slate-500" />
                          <input type="text" placeholder="Dest" value={editForm.dest} onChange={(e) => setEditForm({...editForm, dest: e.target.value.toUpperCase()})} className="w-16 bg-white border border-indigo-500 rounded px-2 py-1 text-slate-900 uppercase" maxLength={3} />
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          {rate.origin} <ArrowRight className="w-3 h-3 text-slate-500" /> {rate.dest}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {editingId === rate.id && rate.isNew ? (
                        <input type="text" placeholder="Airline Name" value={editForm.airline} onChange={(e) => setEditForm({...editForm, airline: e.target.value})} className="w-32 bg-white border border-indigo-500 rounded px-2 py-1 text-slate-900" />
                      ) : (
                        rate.airline
                      )}
                    </td>
                    
                    {/* Editable Fields */}
                    {editingId === rate.id ? (
                      <>
                        <td className="px-6 py-4 text-right">
                          <input type="number" value={editForm.baseRate} onChange={(e) => setEditForm({...editForm, baseRate: Number(e.target.value)})} className="w-20 bg-white border border-indigo-500 rounded px-2 py-1 text-right text-slate-900" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input type="number" value={editForm.fuelSurcharge} onChange={(e) => setEditForm({...editForm, fuelSurcharge: Number(e.target.value)})} className="w-20 bg-white border border-indigo-500 rounded px-2 py-1 text-right text-slate-900" />
                        </td>
                        <td className="px-6 py-4 text-right">
                          <input type="number" value={editForm.handling} onChange={(e) => setEditForm({...editForm, handling: Number(e.target.value)})} className="w-20 bg-white border border-indigo-500 rounded px-2 py-1 text-right text-slate-900" />
                        </td>
                        <td className="px-6 py-4 text-right font-bold text-indigo-400">
                          {editForm.baseRate + editForm.fuelSurcharge + editForm.handling}
                        </td>
                      </>
                    ) : (
                      <>
                        <td className="px-6 py-4 text-right">₹{rate.baseRate}</td>
                        <td className="px-6 py-4 text-right">₹{rate.fuelSurcharge}</td>
                        <td className="px-6 py-4 text-right">₹{rate.handling}</td>
                        <td className="px-6 py-4 text-right font-bold text-indigo-400">
                          ₹{rate.baseRate + rate.fuelSurcharge + rate.handling}
                        </td>
                      </>
                    )}

                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => handleToggleActive(rate.id)}
                        className={`px-3 py-1 rounded-full text-xs font-medium border transition-colors ${rate.active ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20' : 'bg-slate-100 text-slate-600 border-slate-300 hover:bg-slate-700'}`}
                      >
                        {rate.active ? 'Active' : 'Inactive'}
                      </button>
                    </td>

                    <td className="px-6 py-4 text-center">
                      {editingId === rate.id ? (
                        <div className="flex items-center justify-center gap-2">
                          <button onClick={handleSave} className="p-1.5 bg-indigo-500/20 text-indigo-400 rounded-lg hover:bg-indigo-500/30 transition-colors" title="Save">
                            <Save className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleCancel(rate)} className="p-1.5 bg-slate-100 text-slate-600 rounded-lg hover:bg-slate-700 transition-colors" title="Cancel">
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center justify-center gap-2 transition-opacity">
                          <button onClick={() => handleEdit(rate)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-indigo-500/30 hover:text-indigo-400 transition-colors" title="Edit">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDelete(rate.id)} className="p-1.5 bg-slate-100 text-slate-700 rounded-lg hover:bg-rose-500/30 hover:text-rose-400 transition-colors" title="Delete">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {filteredRates.length === 0 && (
              <div className="text-center py-12 text-slate-500 flex flex-col items-center">
                <AlertCircle className="w-8 h-8 mb-3 opacity-50" />
                <p>No rates found matching your search.</p>
              </div>
            )}
          </div>
        </motion.div>
        
      </div>
    </div>
  );
}
