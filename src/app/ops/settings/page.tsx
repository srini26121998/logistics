"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { AUTOMATION_RULES, AIRLINE_TRACKING_CONFIG, AutomationRule } from "@/data/mockData";
import { Settings, Zap, Plane, ToggleLeft, ToggleRight, ExternalLink, Plus, Shield } from "lucide-react";
import { toast } from "sonner";
import { triggerAutomation } from "@/hooks/useAutomationRules";

export default function SettingsPage() {
  const [rules, setRules] = useState<AutomationRule[]>(AUTOMATION_RULES);
  const [activeSection, setActiveSection] = useState<'automation' | 'airlines'>('automation');

  const toggleRule = (id: string) => {
    setRules(prev => prev.map(r => r.id === id ? { ...r, isActive: !r.isActive } : r));
    const rule = rules.find(r => r.id === id);
    if (rule) {
      toast.success(`Rule "${rule.triggerEvent}" ${rule.isActive ? 'disabled' : 'enabled'}`);
    }
  };

  const testAutomation = (event: string) => {
    if (event.includes('AWB Executed')) triggerAutomation('AWB_EXECUTED');
    else if (event.includes('Delivery')) triggerAutomation('DELIVERY_COMPLETED_POD');
    else if (event.includes('Sales')) triggerAutomation('SALES_INVOICE_GENERATED');
    else if (event.includes('Purchase')) triggerAutomation('PURCHASE_INVOICE_APPROVED');
    else if (event.includes('Road')) triggerAutomation('ROAD_BOOKING_CREATED', { vehicleNo: 'KA-01-CD-7890' });
    else if (event.includes('Track')) triggerAutomation('TRACK_SHIPMENT_CLICKED');
    else if (event.includes('Excel')) triggerAutomation('EXCEL_UPLOADED');
    else if (event.includes('Duplicate')) triggerAutomation('DUPLICATE_INVOICE');
    else toast.info(`⚡ Testing: ${event}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
          <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><Settings className="w-6 h-6 text-indigo-500" /></motion.div>
          System Settings
        </h1>
        <p className="text-sm text-slate-500 mt-1">Manage automation rules, airline configurations, and system preferences.</p>
      </div>

      {/* Section Tabs */}
      <div className="flex gap-2">
        <button onClick={() => setActiveSection('automation')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === 'automation' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 border border-blue-200 hover:bg-slate-200'}`}>
          <Zap className="w-4 h-4" /> Automation Rules
        </button>
        <button onClick={() => setActiveSection('airlines')} className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${activeSection === 'airlines' ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/20' : 'bg-slate-100 text-slate-600 border border-blue-200 hover:bg-slate-200'}`}>
          <Plane className="w-4 h-4" /> Airline Configuration
        </button>
      </div>

      {/* Automation Rules Section (Section 6) */}
      {activeSection === 'automation' && (
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
          <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Zap className="w-4 h-4 text-amber-500" /> Automation & Integration Rules</h2>
            <span className="text-xs text-slate-500">Reduce manual effort and ensure data consistency</span>
          </div>
          <div className="divide-y divide-slate-100">
            {rules.map((rule, i) => (
              <motion.div key={rule.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="p-4 flex items-center gap-4 hover:bg-slate-50/80 transition-colors">
                <button onClick={() => toggleRule(rule.id)} className="flex-shrink-0">
                  {rule.isActive ? <ToggleRight className="w-8 h-8 text-indigo-500" /> : <ToggleLeft className="w-8 h-8 text-slate-300" />}
                </button>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-slate-900">{rule.triggerEvent}</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${rule.isActive ? 'bg-emerald-500/10 text-emerald-600' : 'bg-slate-200 text-slate-500'}`}>{rule.isActive ? 'Active' : 'Disabled'}</span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">{rule.action}</p>
                </div>
                <button onClick={() => testAutomation(rule.triggerEvent)} className="px-3 py-1.5 bg-slate-100 hover:bg-indigo-600 hover:text-white text-xs font-medium text-slate-700 rounded-lg transition-all border border-blue-200 flex-shrink-0">
                  Test
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Airline Configuration Section */}
      {activeSection === 'airlines' && (
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
          <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Plane className="w-4 h-4 text-indigo-500" /> Airline Tracking URL Configuration</h2>
            <button className="flex items-center gap-1 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-medium transition-colors" onClick={() => toast.info("Add new airline feature coming soon")}>
              <Plus className="w-3 h-3" /> Add Airline
            </button>
          </div>
          <div className="p-4">
            <p className="text-sm text-slate-600 mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <Shield className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
              Admin can add new airlines or update tracking URLs from this screen — no code deployment required. The {"'{AWB}'"} placeholder in the URL pattern is automatically replaced with the actual AWB number at runtime.
            </p>
            <div className="space-y-3">
              {AIRLINE_TRACKING_CONFIG.map((cfg, i) => (
                <motion.div key={cfg.awbPrefix} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }} className="p-4 bg-white rounded-xl border border-blue-200 hover:border-indigo-300 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow">
                        {cfg.awbPrefix.replace('-', '')}
                      </div>
                      <div>
                        <div className="font-semibold text-slate-900 text-sm">{cfg.airline}</div>
                        <div className="text-xs text-slate-500 font-mono mt-0.5">Prefix: {cfg.awbPrefix}</div>
                      </div>
                    </div>
                    <a href={cfg.trackingUrlPattern.replace('{AWB}', '')} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-100 text-xs font-medium text-slate-700 hover:bg-indigo-600 hover:text-white transition-all">
                      Visit <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                  <div className="mt-2 text-xs font-mono text-slate-500 bg-slate-50 rounded-lg px-3 py-2 border border-slate-100 truncate">{cfg.trackingUrlPattern}</div>
                  <div className="mt-1 text-xs text-slate-400">{cfg.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
