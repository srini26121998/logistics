"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CUSTOMERS, formatINR } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { Users, Search, Plus, Filter, MoreVertical, Mail, Phone, ExternalLink, Download, X, Edit, Trash2, CheckCircle } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function ClientDirectoryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [customers, setCustomers] = useState(CUSTOMERS);
  const [isAddClientOpen, setIsAddClientOpen] = useState(false);
  const [isEditClientOpen, setIsEditClientOpen] = useState(false);
  const [isViewClientOpen, setIsViewClientOpen] = useState(false);
  const [selectedClient, setSelectedClient] = useState<typeof CUSTOMERS[0] | null>(null);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  
  // Form State
  const [newClient, setNewClient] = useState({
    name: "", contactPerson: "", email: "", phone: "", city: "", state: "", gstin: "", creditLimit: ""
  });

  const dropdownRef = useRef<HTMLTableElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleAddClient = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) {
      toast.error("Please fill in required fields (Name, Email)");
      return;
    }
    const client = {
      id: `c${customers.length + 1}`,
      name: newClient.name,
      contactPerson: newClient.contactPerson || "N/A",
      email: newClient.email,
      phone: newClient.phone || "N/A",
      city: newClient.city || "N/A",
      state: newClient.state || "N/A",
      stateCode: "00",
      gstin: newClient.gstin || "N/A",
      outstanding: 0,
      creditLimit: Number(newClient.creditLimit) || 100000,
      totalShipments: 0,
      status: "Active" as const,
      joinedDate: new Date().toISOString().split("T")[0],
      kycVerified: false,
    };
    setCustomers([client, ...customers]);
    setIsAddClientOpen(false);
    setNewClient({ name: "", contactPerson: "", email: "", phone: "", city: "", state: "", gstin: "", creditLimit: "" });
    toast.success("Client added successfully");
  };

  const handleEditClient = (e: React.FormEvent) => {
    e.preventDefault();
    setCustomers(customers.map(c => c.id === selectedClient!.id ? { ...c, ...newClient, creditLimit: Number(newClient.creditLimit) || c.creditLimit } : c));
    setIsEditClientOpen(false);
    toast.success("Client updated successfully");
  };

  const openEditModal = (client: typeof CUSTOMERS[0]) => {
    setSelectedClient(client);
    setNewClient({
      name: client.name,
      contactPerson: client.contactPerson,
      email: client.email,
      phone: client.phone,
      city: client.city,
      state: client.state,
      gstin: client.gstin,
      creditLimit: client.creditLimit.toString()
    });
    setIsEditClientOpen(true);
    setActiveDropdown(null);
  };

  const openViewModal = (client: typeof CUSTOMERS[0]) => {
    setSelectedClient(client);
    setIsViewClientOpen(true);
    setActiveDropdown(null);
  };

  const handleDeleteClient = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id));
    toast.success("Client removed");
    setActiveDropdown(null);
  };
  
  const filteredCustomers = customers.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.gstin.toLowerCase().includes(searchTerm.toLowerCase()) ||
    c.city.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-500" />
            Client Directory
          </h1>
          <p className="text-sm text-slate-600 mt-1">Manage corporate clients, credit limits, and KYC status.</p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={() => toast.success('Exporting client directory...')} className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200">
            <Download className="w-4 h-4" /> Export CSV
          </button>
          <button onClick={() => setIsAddClientOpen(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-sm font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)]">
            <Plus className="w-4 h-4" /> Add Client
          </button>
        </div>
      </div>

      <div className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden flex flex-col h-[calc(100vh-140px)]">
        <div className="p-4 border-b border-blue-200 flex flex-col sm:flex-row justify-between items-center gap-4 bg-white">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, GSTIN, city..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 border border-blue-200 rounded-lg pl-9 pr-4 py-2 text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>
          <button className="p-2 bg-slate-100 border border-blue-200 rounded-lg text-slate-600 hover:text-slate-900 sm:ml-auto">
            <Filter className="w-4 h-4" />
          </button>
        </div>

        <div className="flex-1 overflow-auto custom-scrollbar">
          <table ref={dropdownRef} className="w-full text-left border-collapse min-w-[1000px]">
            <thead className="bg-white sticky top-0 z-10 backdrop-blur-md shadow-sm border-b border-blue-200">
              <tr>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Company</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Contact Details</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Location & Tax</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Financials</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Status</th>
                <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              <AnimatePresence>
                {filteredCustomers.map((client, idx) => (
                  <motion.tr 
                    key={client.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-100/30 transition-colors group"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold">
                          {client.name.substring(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-slate-900">{client.name}</div>
                          <div className="text-xs text-slate-500">Joined: {client.joinedDate}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700">{client.contactPerson}</div>
                      <div className="text-xs text-slate-500 flex flex-col mt-0.5 gap-0.5">
                        <span className="flex items-center gap-1"><Mail className="w-3 h-3" /> {client.email}</span>
                        <span className="flex items-center gap-1"><Phone className="w-3 h-3" /> {client.phone}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-slate-700">{client.city}, {client.state}</div>
                      <div className="text-xs font-mono text-slate-500 mt-0.5">GST: {client.gstin}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <div className="text-sm font-mono text-emerald-400">
                        {formatINR(client.outstanding)} <span className="text-slate-500 text-xs">due</span>
                      </div>
                      <div className="text-xs text-slate-500 mt-0.5">Limit: {formatINR(client.creditLimit)}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col items-start gap-1">
                        <StatusBadge status={client.status} />
                        {client.kycVerified && <span className="text-[10px] text-emerald-500 border border-emerald-500/20 bg-emerald-500/10 px-1.5 rounded">KYC Verified</span>}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right relative">
                      <button 
                        onClick={() => setActiveDropdown(activeDropdown === client.id ? null : client.id)}
                        className="p-2 text-slate-600 hover:text-slate-900 transition-colors rounded-lg hover:bg-slate-700 focus:outline-none"
                      >
                        <MoreVertical className="w-4 h-4" />
                      </button>
                      
                      <AnimatePresence>
                        {activeDropdown === client.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: -10 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: -10 }}
                            transition={{ duration: 0.15 }}
                            className="absolute right-6 top-12 w-48 bg-white border border-blue-200 rounded-xl shadow-xl z-50 overflow-hidden py-1"
                          >
                            <button onClick={() => openViewModal(client)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 flex items-center gap-2 transition-colors">
                              <ExternalLink className="w-4 h-4 text-indigo-400" /> View Details
                            </button>
                            <button onClick={() => openEditModal(client)} className="w-full text-left px-4 py-2.5 text-sm text-slate-700 hover:text-slate-900 hover:bg-slate-100/50 flex items-center gap-2 transition-colors">
                              <Edit className="w-4 h-4 text-emerald-400" /> Edit Client
                            </button>
                            <div className="h-px bg-slate-700/50 my-1"></div>
                            <button onClick={() => handleDeleteClient(client.id)} className="w-full text-left px-4 py-2.5 text-sm text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 flex items-center gap-2 transition-colors">
                              <Trash2 className="w-4 h-4" /> Delete Client
                            </button>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      {/* Add Client Modal */}
      <AnimatePresence>
        {isAddClientOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-blue-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-blue-200/60 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Plus className="w-5 h-5 text-indigo-500" /> Add New Client
                </h2>
                <button
                  onClick={() => setIsAddClientOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleAddClient} className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Company Name *</label>
                    <input
                      required
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      placeholder="e.g. Global Exports Ltd"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Contact Person</label>
                    <input
                      type="text"
                      value={newClient.contactPerson}
                      onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                      placeholder="John Doe"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      placeholder="contact@company.com"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Phone Number</label>
                    <input
                      type="text"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      placeholder="+91 98765 43210"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">City & State</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                        placeholder="City"
                        className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                      />
                      <input
                        type="text"
                        value={newClient.state}
                        onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                        placeholder="State"
                        className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">GSTIN</label>
                    <input
                      type="text"
                      value={newClient.gstin}
                      onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                      placeholder="27AADCA1122Q1Z9"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50 uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Credit Limit (₹)</label>
                    <input
                      type="number"
                      value={newClient.creditLimit}
                      onChange={(e) => setNewClient({ ...newClient, creditLimit: e.target.value })}
                      placeholder="100000"
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500/50"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-blue-200">
                  <button
                    type="button"
                    onClick={() => setIsAddClientOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Save Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Edit Client Modal */}
      <AnimatePresence>
        {isEditClientOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-blue-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-blue-200/60 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Edit className="w-5 h-5 text-emerald-500" /> Edit Client
                </h2>
                <button
                  onClick={() => setIsEditClientOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleEditClient} className="p-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-medium text-slate-600">Company Name *</label>
                    <input
                      required
                      type="text"
                      value={newClient.name}
                      onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Contact Person</label>
                    <input
                      type="text"
                      value={newClient.contactPerson}
                      onChange={(e) => setNewClient({ ...newClient, contactPerson: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Email Address *</label>
                    <input
                      required
                      type="email"
                      value={newClient.email}
                      onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Phone Number</label>
                    <input
                      type="text"
                      value={newClient.phone}
                      onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">City & State</label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={newClient.city}
                        onChange={(e) => setNewClient({ ...newClient, city: e.target.value })}
                        className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                      />
                      <input
                        type="text"
                        value={newClient.state}
                        onChange={(e) => setNewClient({ ...newClient, state: e.target.value })}
                        className="w-1/2 bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">GSTIN</label>
                    <input
                      type="text"
                      value={newClient.gstin}
                      onChange={(e) => setNewClient({ ...newClient, gstin: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50 uppercase"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-medium text-slate-600">Credit Limit (₹)</label>
                    <input
                      type="number"
                      value={newClient.creditLimit}
                      onChange={(e) => setNewClient({ ...newClient, creditLimit: e.target.value })}
                      className="w-full bg-slate-50 border border-blue-200 rounded-xl px-4 py-2.5 text-sm text-slate-900 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/50"
                    />
                  </div>
                </div>

                <div className="mt-8 flex justify-end gap-3 pt-6 border-t border-blue-200">
                  <button
                    type="button"
                    onClick={() => setIsEditClientOpen(false)}
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-slate-700 hover:text-slate-900 hover:bg-slate-100 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-500 transition-colors shadow-[0_0_15px_rgba(16,185,129,0.3)] flex items-center gap-2"
                  >
                    <CheckCircle className="w-4 h-4" /> Update Client
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* View Client Details Modal */}
      <AnimatePresence>
        {isViewClientOpen && selectedClient && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white border border-blue-200 rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden"
            >
              <div className="px-6 py-4 border-b border-blue-200/60 flex justify-between items-center bg-slate-50">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-indigo-400" /> Client Details
                </h2>
                <button
                  onClick={() => setIsViewClientOpen(false)}
                  className="p-2 hover:bg-slate-100 rounded-full text-slate-600 hover:text-slate-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-6">
                <div className="flex items-start gap-4 mb-8">
                  <div className="w-16 h-16 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 flex items-center justify-center font-bold text-2xl">
                    {selectedClient.name.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-slate-900">{selectedClient.name}</h3>
                    <p className="text-sm text-slate-600 flex items-center gap-2 mt-1">
                      <StatusBadge status={selectedClient.status} />
                      Joined: {selectedClient.joinedDate}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Contact Information</h4>
                    <div>
                      <div className="text-sm text-slate-700 font-medium">{selectedClient.contactPerson}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Mail className="w-3 h-3" /> {selectedClient.email}</div>
                      <div className="text-xs text-slate-500 flex items-center gap-1 mt-1"><Phone className="w-3 h-3" /> {selectedClient.phone}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Location & Tax</h4>
                    <div>
                      <div className="text-sm text-slate-700">{selectedClient.city}, {selectedClient.state}</div>
                      <div className="text-xs font-mono text-slate-500 mt-1">GSTIN: {selectedClient.gstin}</div>
                    </div>
                  </div>

                  <div className="bg-slate-50 border border-blue-200 rounded-xl p-4 space-y-3 sm:col-span-2">
                    <h4 className="text-xs font-bold text-slate-500 uppercase">Financial Overview</h4>
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="text-xs text-slate-500">Outstanding Balance</div>
                        <div className="text-lg font-mono font-bold text-rose-400">{formatINR(selectedClient.outstanding)}</div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-slate-500">Credit Limit</div>
                        <div className="text-lg font-mono font-bold text-emerald-400">{formatINR(selectedClient.creditLimit)}</div>
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
