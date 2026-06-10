"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  TrendingUp,
  Package,
  Clock,
  AlertCircle,
  Activity,
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Plane,
  Truck,
  Ship,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  MoreVertical,
  Bell,
  FileText,
  X
} from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";
import { SHIPMENTS, INVOICES, formatINR, type Shipment } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";

// Mock Data for Dashboard
const KPI_STATS = [
  {
    title: "Total Revenue",
    value: "₹24,50,000",
    change: "+12.5%",
    isPositive: true,
    icon: DollarSign,
    color: "text-emerald-500",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20"
  },
  {
    title: "Active Shipments",
    value: "1,248",
    change: "+5.2%",
    isPositive: true,
    icon: Package,
    color: "text-indigo-500",
    bg: "bg-indigo-500/10",
    border: "border-indigo-500/20"
  },
  {
    title: "Pending Actions",
    value: "34",
    change: "-2.4%",
    isPositive: true,
    icon: Clock,
    color: "text-amber-500",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20"
  },
  {
    title: "Exception Alerts",
    value: "12",
    change: "+8.1%",
    isPositive: false,
    icon: AlertCircle,
    color: "text-rose-500",
    bg: "bg-rose-500/10",
    border: "border-rose-500/20"
  }
];

const RECENT_SHIPMENTS = [
  { id: "AWB-892345", origin: "DEL", dest: "BOM", status: "In Transit", carrier: "IndiGo Cargo", type: "Air", time: "10 mins ago" },
  { id: "AWB-100293", origin: "BLR", dest: "DXB", status: "Customs Hold", carrier: "Emirates", type: "Air", time: "45 mins ago" },
  { id: "LR-774821", origin: "PNQ", dest: "MAA", status: "Delivered", carrier: "VRL Logistics", type: "Surface", time: "2 hours ago" },
  { id: "AWB-992104", origin: "HYD", dest: "CCU", status: "Booked", carrier: "Air India", type: "Air", time: "3 hours ago" },
  { id: "LR-443920", origin: "AMD", dest: "DEL", status: "In Transit", carrier: "Safexpress", type: "Surface", time: "5 hours ago" },
];

const PENDING_ACTIONS = [
  { id: 1, title: "Approve Invoice #INV-2026", type: "Finance", priority: "High", time: "1 hour ago" },
  { id: 2, title: "Clear Customs for AWB-100293", type: "Operations", priority: "Critical", time: "45 mins ago" },
  { id: 3, title: "Assign Fleet for Route PNQ-MAA", type: "Logistics", priority: "Medium", time: "2 hours ago" },
  { id: 4, title: "Review Pricing Tariff Q3", type: "Admin", priority: "Low", time: "1 day ago" },
];

export default function OperationsDashboard() {
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");
  const [filterOpen, setFilterOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState("All");
  
  // Review Case State
  const [selectedException, setSelectedException] = useState<Shipment | null>(null);
  const [resolutionNote, setResolutionNote] = useState("");
  const [resolutionAction, setResolutionAction] = useState("Clear Customs");
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const filterOptions = ["All", "Booked", "In Transit", "Customs Hold", "Delivered", "Exception"];
  
  const filteredShipments = SHIPMENTS.filter(s => activeFilter === "All" || s.status === activeFilter);

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      // Just visually refresh without changing data for demo effect
      // In a real app, this would fetch new data
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 1000);
  };

  const handleResolveCase = () => {
    if (!selectedException) return;
    
    // Mutate the global mock array to simulate backend update
    const idx = SHIPMENTS.findIndex(s => s.id === selectedException.id);
    if (idx !== -1) {
      if (resolutionAction === 'Clear Customs' || resolutionAction === 'Mark as In Transit') {
        SHIPMENTS[idx].status = 'In Transit';
      } else if (resolutionAction === 'Hold for Inspection') {
        SHIPMENTS[idx].status = 'Customs Hold';
      }
    }
    
    toast.success(`Case for ${selectedException.awb} resolved successfully.`);
    setRefreshTrigger(prev => prev + 1);
    setSelectedException(null);
    setResolutionNote("");
    setResolutionAction("Clear Customs");
  };

  const activeExceptionsCount = SHIPMENTS.filter(s => s.status === 'Exception' || s.status === 'Customs Hold').length;
  
  const displayKPIs = KPI_STATS.map(kpi => {
    if (kpi.title === "Exception Alerts") {
      return { ...kpi, value: activeExceptionsCount.toString() };
    }
    return kpi;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Delivered": return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
      case "In Transit": return "bg-indigo-500/10 text-indigo-400 border-indigo-500/20";
      case "Customs Hold": return "bg-rose-500/10 text-rose-400 border-rose-500/20";
      case "Booked": return "bg-amber-500/10 text-amber-400 border-amber-500/20";
      default: return "bg-slate-500/10 text-slate-600 border-slate-500/20";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "Critical": return "bg-rose-500 text-white";
      case "High": return "bg-orange-500 text-slate-900";
      case "Medium": return "bg-amber-500 text-white";
      case "Low": return "bg-blue-500 text-white";
      default: return "bg-slate-500 text-slate-900";
    }
  };

  return (
    <div className="space-y-8">

      <main className="space-y-8">
        
        {/* Actions & Filters */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex bg-white p-1 rounded-xl border border-blue-200">
            {['overview', 'shipments', 'revenue', 'exceptions'].map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-all ${
                  activeTab === tab 
                    ? 'bg-indigo-600 text-white shadow-md' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <button 
                onClick={() => setFilterOpen(!filterOpen)} 
                className={`flex items-center gap-2 px-4 py-2 bg-white border ${filterOpen ? 'border-indigo-500 text-indigo-400' : 'border-slate-200 text-slate-700'} rounded-xl text-sm font-medium hover:bg-slate-100 transition-colors`}
              >
                <Filter className="w-4 h-4" /> 
                {activeFilter === 'All' ? 'Filters' : activeFilter}
              </button>
              
              <AnimatePresence>
                {filterOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute right-0 mt-2 w-48 bg-white border border-blue-200 rounded-xl shadow-xl overflow-hidden z-50"
                  >
                    {filterOptions.map(option => (
                      <button
                        key={option}
                        onClick={() => {
                          setActiveFilter(option);
                          setFilterOpen(false);
                          toast.success(`Filter applied: ${option}`);
                        }}
                        className={`w-full text-left px-4 py-2.5 text-sm transition-colors ${
                          activeFilter === option 
                            ? 'bg-indigo-600/20 text-indigo-400 font-medium' 
                            : 'text-slate-700 hover:bg-slate-100 hover:text-slate-900'
                        }`}
                      >
                        {option}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <button 
              onClick={handleRefresh}
              className={`flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 rounded-xl text-sm font-medium text-white transition-all shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]`}
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} /> 
              Refresh
            </button>
          </div>
        </div>

        {/* KPI Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {displayKPIs.map((stat, idx) => (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white/80 backdrop-blur-xl border border-blue-200 hover:border-indigo-500/50 hover:bg-slate-100/60 rounded-2xl p-6 relative overflow-hidden group transition-all duration-300 shadow-lg shadow-black/20 hover:shadow-indigo-500/10"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
              
              <div className="flex justify-between items-start mb-4 relative z-10">
                <div className={`p-3 rounded-xl ${stat.bg} ${stat.border} border shadow-inner`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
                <div className={`flex items-center gap-1 text-sm font-semibold ${stat.isPositive ? 'text-emerald-400' : 'text-rose-400'} bg-slate-50/50 px-2 py-1 rounded-full border border-slate-200/80 backdrop-blur-sm`}>
                  {stat.isPositive ? <ArrowUpRight className="w-3.5 h-3.5" /> : <ArrowDownRight className="w-3.5 h-3.5" />}
                  {stat.change}
                </div>
              </div>
              <div className="relative z-10">
                <div className="text-3xl font-bold text-slate-900 mb-1 tracking-tight drop-shadow-md">{stat.value}</div>
                <div className="text-sm font-medium text-slate-600">{stat.title}</div>
              </div>
              
              {/* Decorative Background Element */}
              <div className="absolute -right-6 -bottom-6 opacity-5 group-hover:opacity-10 group-hover:scale-110 transition-all duration-500">
                <stat.icon className="w-32 h-32" />
              </div>
              
              {/* Hover glow effect */}
              <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/0 via-indigo-500/0 to-indigo-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
            </motion.div>
          ))}
        </div>

        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Main Dashboard Area - Left 2 Columns */}
            <div className="lg:col-span-2 space-y-8">
            
            {/* Real-time Tracking Widget */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 flex flex-col h-[400px] shadow-lg shadow-black/20 relative"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 drop-shadow-md">
                  <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                    <TrendingUp className="w-5 h-5 text-indigo-400" />
                  </div>
                  Live Shipments Tracker
                </h2>
                <Link href="/track/AWB-892345" className="text-sm text-indigo-400 hover:text-indigo-300 font-medium">
                  View All Map →
                </Link>
              </div>

              <div className="flex-1 overflow-auto pr-2 custom-scrollbar space-y-4">
                {filteredShipments.slice(0, 5).map((shipment, idx) => (
                  <motion.div
                    key={shipment.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="group bg-white hover:bg-slate-100/50 border border-blue-200 hover:border-blue-200 rounded-xl p-4 transition-all cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center border border-blue-200 group-hover:border-indigo-500/50 transition-colors">
                        {shipment.mode === 'Air' ? <Plane className="w-5 h-5 text-slate-700" /> : <Truck className="w-5 h-5 text-slate-700" />}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 group-hover:text-indigo-400 transition-colors">{shipment.awb}</div>
                        <div className="text-xs text-slate-600 flex items-center gap-2">
                          <span>{shipment.origin} → {shipment.destination}</span>
                          <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                          <span>{shipment.carrier}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      <StatusBadge status={shipment.status} />
                      <div className="text-xs text-slate-500">Booked: {shipment.bookedDate}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
            
            {/* Quick Access Tools */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link href="/quote" className="bg-white/80 hover:bg-slate-100 border border-blue-200 hover:border-indigo-500/50 rounded-2xl p-6 text-center transition-all group flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-indigo-500/10 text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Quote Calculator</span>
              </Link>
              <Link href="/ops/awb/new" className="bg-white/80 hover:bg-slate-100 border border-blue-200 hover:border-purple-500/50 rounded-2xl p-6 text-center transition-all group flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">AWB Generation</span>
              </Link>
              <Link href="/ops/inbound" className="bg-white/80 hover:bg-slate-100 border border-blue-200 hover:border-emerald-500/50 rounded-2xl p-6 text-center transition-all group flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Package className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Inbound Ops</span>
              </Link>
              <Link href="/ops/invoices/generate" className="bg-white/80 hover:bg-slate-100 border border-blue-200 hover:border-amber-500/50 rounded-2xl p-6 text-center transition-all group flex flex-col items-center justify-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <DollarSign className="w-6 h-6" />
                </div>
                <span className="font-medium text-slate-700 group-hover:text-slate-900">Tax Invoices</span>
              </Link>
            </div>

          </div>

          {/* Right Sidebar - Pending Actions */}
          <div className="space-y-8">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 h-full flex flex-col shadow-lg shadow-black/20 relative"
            >
              {/* Subtle top glow */}
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/20 to-transparent"></div>
              
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2 drop-shadow-md">
                  <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
                    <Clock className="w-5 h-5 text-amber-400" />
                  </div>
                  Pending Actions
                </h2>
                <div className="w-6 h-6 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center text-xs font-bold shadow-inner">
                  {PENDING_ACTIONS.length}
                </div>
              </div>

              <div className="flex-1 space-y-4">
                {PENDING_ACTIONS.map((action, idx) => (
                  <motion.div
                    key={action.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6 + (idx * 0.1) }}
                    className="p-4 rounded-xl border border-blue-200 bg-white hover:border-blue-200 transition-colors"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded ${getPriorityColor(action.priority)}`}>
                        {action.priority}
                      </span>
                      <span className="text-xs text-slate-500">{action.time}</span>
                    </div>
                    <h3 className="font-medium text-slate-900 mb-1">{action.title}</h3>
                    <div className="text-xs text-slate-600 flex items-center justify-between mt-3">
                      <span>{action.type}</span>
                      <button onClick={() => toast.success(`Action resolved: ${action.title}`)} className="text-indigo-400 hover:text-indigo-300 font-medium">Resolve →</button>
                    </div>
                  </motion.div>
                ))}
              </div>

              <button onClick={() => toast.info('Viewing all tasks')} className="w-full mt-6 py-3 rounded-xl border border-blue-200 text-slate-700 text-sm font-medium hover:bg-slate-100 transition-colors">
                View All Tasks
              </button>
            </motion.div>
          </div>
        </div>
        )}

        {/* Shipments Tab Content */}
        {activeTab === 'shipments' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/20">
                  <Package className="w-5 h-5 text-indigo-400" />
                </div>
                All Shipments
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-blue-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-medium">AWB / LR Number</th>
                    <th className="p-4 font-medium">Route</th>
                    <th className="p-4 font-medium">Carrier</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {filteredShipments.map((shipment) => (
                    <tr key={shipment.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4">
                        <div className="font-medium text-slate-900">{shipment.awb}</div>
                        <div className="text-xs text-slate-500">{shipment.lrNumber}</div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2 text-slate-700">
                          <span>{shipment.origin}</span>
                          <ArrowUpRight className="w-3 h-3 text-slate-500" />
                          <span>{shipment.destination}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {shipment.mode === 'Air' ? <Plane className="w-4 h-4 text-slate-600" /> : <Truck className="w-4 h-4 text-slate-600" />}
                          <span className="text-sm text-slate-600">{shipment.carrier}</span>
                        </div>
                      </td>
                      <td className="p-4">
                        <StatusBadge status={shipment.status} />
                      </td>
                      <td className="p-4 text-right">
                        <Link href={`/track/${shipment.awb}`} className="inline-flex items-center justify-center p-2 rounded-lg bg-white border border-blue-200 hover:border-indigo-500/50 text-slate-600 hover:text-indigo-400 transition-all">
                          <Search className="w-4 h-4" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                  {filteredShipments.length === 0 && (
                    <tr>
                      <td colSpan={5} className="p-8 text-center text-slate-500">
                        No shipments found matching the selected filter.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Revenue Tab Content */}
        {activeTab === 'revenue' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                  <DollarSign className="w-5 h-5 text-emerald-400" />
                </div>
                Recent Invoices
              </h2>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-blue-200 text-xs uppercase tracking-wider text-slate-500">
                    <th className="p-4 font-medium">Invoice No</th>
                    <th className="p-4 font-medium">Client</th>
                    <th className="p-4 font-medium">Date</th>
                    <th className="p-4 font-medium">Status</th>
                    <th className="p-4 font-medium text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {INVOICES.map((invoice) => (
                    <tr key={invoice.id} className="hover:bg-slate-50 transition-colors">
                      <td className="p-4 font-medium text-slate-900">{invoice.invoiceNo}</td>
                      <td className="p-4 text-slate-700">{invoice.clientName}</td>
                      <td className="p-4 text-slate-600 text-sm">{invoice.date}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${
                          invoice.status === 'Paid' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          invoice.status === 'Overdue' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                          invoice.status === 'Sent' ? 'bg-blue-500/10 text-blue-400 border-blue-500/20' :
                          'bg-slate-500/10 text-slate-600 border-slate-500/20'
                        }`}>
                          {invoice.status}
                        </span>
                      </td>
                      <td className="p-4 text-right font-medium text-slate-900">{formatINR(invoice.total)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {/* Exceptions Tab Content */}
        {activeTab === 'exceptions' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white/80 backdrop-blur-xl border border-blue-200 rounded-2xl p-6 shadow-lg shadow-black/20"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
                  <AlertCircle className="w-5 h-5 text-rose-400" />
                </div>
                Active Exceptions
              </h2>
            </div>
            
            <div className="space-y-4">
              {SHIPMENTS.filter(s => s.status === 'Exception' || s.status === 'Customs Hold').map((shipment) => (
                <div key={shipment.id} className="p-4 rounded-xl border border-rose-500/20 bg-rose-500/5 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-rose-500/10 flex items-center justify-center border border-rose-500/20">
                      <AlertCircle className="w-5 h-5 text-rose-500" />
                    </div>
                    <div>
                      <div className="font-semibold text-slate-900">{shipment.awb} <span className="text-xs text-slate-600 font-normal ml-2">({shipment.origin} → {shipment.destination})</span></div>
                      <div className="text-sm text-rose-400 mt-0.5">{shipment.status} - Requires immediate attention</div>
                    </div>
                  </div>
                  <button onClick={() => setSelectedException(shipment)} className="px-4 py-2 bg-white border border-blue-200 hover:border-rose-500/50 rounded-lg text-sm text-slate-700 transition-colors">
                    Review Case
                  </button>
                </div>
              ))}
              {SHIPMENTS.filter(s => s.status === 'Exception' || s.status === 'Customs Hold').length === 0 && (
                <div className="text-center p-8 text-slate-500">
                  <CheckCircle2 className="w-12 h-12 text-emerald-500/50 mx-auto mb-3" />
                  No active exceptions. All shipments are running smoothly.
                </div>
              )}
            </div>
          </motion.div>
        )}

      </main>

      {/* Review Case Modal */}
      <AnimatePresence>
        {selectedException && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white border border-blue-200 rounded-2xl p-6 w-full max-w-lg shadow-2xl relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-1">Review Case: {selectedException.awb}</h3>
                  <p className="text-sm text-slate-600">Current Status: <span className="text-rose-400 font-medium">{selectedException.status}</span></p>
                </div>
                <button onClick={() => setSelectedException(null)} className="text-slate-600 hover:text-slate-900 transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div className="p-4 bg-slate-100/50 rounded-xl border border-blue-200">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-slate-500 block mb-1">Route</span>
                      <span className="text-slate-900 font-medium">{selectedException.origin} → {selectedException.destination}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Carrier</span>
                      <span className="text-slate-900 font-medium">{selectedException.carrier}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Commodity</span>
                      <span className="text-slate-900 font-medium">{selectedException.commodity}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block mb-1">Booked Date</span>
                      <span className="text-slate-900 font-medium">{selectedException.bookedDate}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resolution Action</label>
                  <select
                    value={resolutionAction}
                    onChange={(e) => setResolutionAction(e.target.value)}
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors"
                  >
                    <option value="Clear Customs">Clear Customs & Proceed</option>
                    <option value="Re-route Shipment">Re-route Shipment</option>
                    <option value="Hold for Inspection">Hold for Inspection</option>
                    <option value="Mark as In Transit">Mark as In Transit</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Resolution Notes</label>
                  <textarea
                    value={resolutionNote}
                    onChange={(e) => setResolutionNote(e.target.value)}
                    placeholder="Add details about the resolution..."
                    className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-slate-900 focus:outline-none focus:border-indigo-500 transition-colors h-24 resize-none custom-scrollbar"
                  />
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button 
                  onClick={() => setSelectedException(null)}
                  className="px-5 py-2.5 rounded-xl border border-blue-200 text-slate-700 font-medium hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleResolveCase}
                  className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-colors shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)]"
                >
                  Apply Resolution
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
