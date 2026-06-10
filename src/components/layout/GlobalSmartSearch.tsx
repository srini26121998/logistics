"use client";

import React, { useState, useRef, useEffect, useMemo, useCallback } from "react";
import { Search, X, FileText, Package, Truck, Plane, Receipt, DollarSign, ArrowRight, ExternalLink, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { buildLinkedDocumentIndex, LinkedDocumentResult, AIRLINE_TRACKING_CONFIG } from "@/data/mockData";
import { detectAirlineFromAWB, openAirlineTracking } from "@/utils/airlineTracker";
import { toast } from "sonner";

const DOC_TYPE_STYLES: Record<string, { bg: string; text: string; icon: React.ElementType }> = {
  'AWB':              { bg: 'bg-indigo-500/10', text: 'text-indigo-600', icon: Package },
  'LR':               { bg: 'bg-blue-500/10', text: 'text-blue-600', icon: Truck },
  'Booking':          { bg: 'bg-emerald-500/10', text: 'text-emerald-600', icon: Plane },
  'Manifest':         { bg: 'bg-amber-500/10', text: 'text-amber-600', icon: FileText },
  'Sales Invoice':    { bg: 'bg-teal-500/10', text: 'text-teal-600', icon: DollarSign },
  'Purchase Invoice': { bg: 'bg-purple-500/10', text: 'text-purple-600', icon: Receipt },
};

interface GlobalSmartSearchProps {
  className?: string;
}

export function GlobalSmartSearch({ className }: GlobalSmartSearchProps) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Build the document index once
  const documentIndex = useMemo(() => buildLinkedDocumentIndex(), []);

  // Filter results — minimum 3 characters to activate (Section 5.5.1)
  const results = useMemo(() => {
    if (query.length < 3) return [];
    
    const q = query.toLowerCase();
    
    return documentIndex.filter(doc => {
      return (
        doc.refNumber.toLowerCase().includes(q) ||
        doc.summary.toLowerCase().includes(q) ||
        (doc.awbNumber && doc.awbNumber.toLowerCase().includes(q)) ||
        (doc.customer && doc.customer.toLowerCase().includes(q)) ||
        (doc.vendor && doc.vendor.toLowerCase().includes(q)) ||
        (doc.origin && doc.origin.toLowerCase().includes(q)) ||
        (doc.destination && doc.destination.toLowerCase().includes(q))
      );
    }).slice(0, 15); // Cap results
  }, [query, documentIndex]);

  // Check if query matches an airline AWB for "Track Shipment" button
  const airlineDetection = useMemo(() => {
    if (query.length < 3) return null;
    return detectAirlineFromAWB(query);
  }, [query]);

  // Keyboard shortcut: Cmd+K / Ctrl+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
      if (e.key === 'Escape') {
        setIsOpen(false);
        inputRef.current?.blur();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Keyboard navigation within results
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex(prev => Math.min(prev + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === 'Enter' && selectedIndex >= 0 && results[selectedIndex]) {
      e.preventDefault();
      navigateToResult(results[selectedIndex]);
    }
  }, [results, selectedIndex]);

  const navigateToResult = (result: LinkedDocumentResult) => {
    router.push(result.link);
    setIsOpen(false);
    setQuery("");
    toast.success(`Opened ${result.type}: ${result.refNumber}`);
  };

  const handleTrackShipment = () => {
    if (!airlineDetection?.found) {
      toast.error("Airline not configured. Please contact Admin to add the tracking URL.", { duration: 5000 });
      return;
    }
    const result = openAirlineTracking(query);
    if (result.found) {
      toast.success(`Opening ${result.airline?.airline} tracking in new tab...`);
    }
  };

  return (
    <div className={`relative ${className || ''}`} ref={dropdownRef}>
      {/* Search Input */}
      <div className="relative group">
        <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2 group-focus-within:text-indigo-500 transition-colors z-10" />
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setIsOpen(true);
            setSelectedIndex(-1);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search AWB, Docket, LR, Invoice... (⌘K)"
          className="bg-white/80 border border-blue-200 rounded-lg pl-9 pr-20 py-1.5 text-sm text-slate-900 placeholder-slate-500 focus:outline-none focus:border-indigo-500/50 focus:bg-slate-50 transition-all w-64 lg:w-96"
          suppressHydrationWarning
        />
        {query ? (
          <button
            onClick={() => { setQuery(""); setIsOpen(false); }}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        ) : (
          <span className="absolute right-3 text-[10px] font-mono text-slate-500 border border-blue-200 rounded px-1.5 py-0.5 bg-slate-100/50 top-1/2 -translate-y-1/2">⌘K</span>
        )}
      </div>

      {/* Results Dropdown */}
      <AnimatePresence>
        {isOpen && query.length >= 3 && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.97 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-blue-200 rounded-xl shadow-2xl shadow-indigo-500/5 overflow-hidden z-[100] max-h-[70vh] flex flex-col"
          >
            {/* Airline Track Shipment Button (Section 5.5.2) */}
            {airlineDetection?.found && (
              <div className="p-3 border-b border-blue-200 bg-gradient-to-r from-indigo-50 to-blue-50">
                <button
                  onClick={handleTrackShipment}
                  className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-white border border-indigo-200 hover:border-indigo-400 hover:shadow-md transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center text-white font-bold text-sm shadow-lg shadow-indigo-500/30">
                      {airlineDetection.airline?.awbPrefix.replace('-', '') || '✈'}
                    </div>
                    <div className="text-left">
                      <div className="text-sm font-semibold text-slate-900">{airlineDetection.airline?.airline}</div>
                      <div className="text-xs text-slate-500">Track Shipment on official airline portal</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 text-indigo-600 group-hover:text-indigo-800 transition-colors">
                    <span className="text-xs font-medium">Open</span>
                    <ExternalLink className="w-4 h-4" />
                  </div>
                </button>
              </div>
            )}

            {/* "Airline not configured" fallback */}
            {query.length >= 3 && airlineDetection && !airlineDetection.found && results.length === 0 && (
              <div className="p-4 border-b border-blue-200 bg-amber-50/50">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-amber-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="text-sm font-medium text-amber-700">Airline not configured</div>
                    <div className="text-xs text-amber-600 mt-0.5">Please contact Admin with an option to enter a custom tracking URL manually.</div>
                  </div>
                </div>
              </div>
            )}

            {/* Results List */}
            {results.length > 0 ? (
              <>
                <div className="px-3 py-2 border-b border-blue-200/50 bg-slate-50/80">
                  <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                    {results.length} Document{results.length !== 1 ? 's' : ''} Found
                  </span>
                </div>
                <div className="overflow-y-auto max-h-[55vh] custom-scrollbar">
                  {results.map((result, index) => {
                    const style = DOC_TYPE_STYLES[result.type] || DOC_TYPE_STYLES['AWB'];
                    const Icon = style.icon;
                    const isSelected = index === selectedIndex;

                    return (
                      <button
                        key={`${result.type}-${result.refNumber}-${index}`}
                        onClick={() => navigateToResult(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-all border-b border-slate-100/80 last:border-none group ${
                          isSelected ? 'bg-indigo-50/70' : 'hover:bg-slate-50'
                        }`}
                      >
                        {/* Document Type Badge */}
                        <div className={`w-9 h-9 rounded-lg ${style.bg} flex items-center justify-center flex-shrink-0 border border-opacity-20 ${style.text}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        {/* Content */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${style.bg} ${style.text}`}>
                              {result.type}
                            </span>
                            <span className="text-sm font-semibold text-slate-900 font-mono truncate">
                              {result.refNumber}
                            </span>
                          </div>
                          <div className="text-xs text-slate-500 mt-0.5 truncate">
                            {result.summary}
                          </div>
                        </div>

                        {/* Arrow */}
                        <ArrowRight className={`w-4 h-4 text-slate-400 flex-shrink-0 transition-transform ${isSelected ? 'translate-x-1 text-indigo-500' : 'group-hover:translate-x-1'}`} />
                      </button>
                    );
                  })}
                </div>
              </>
            ) : (
              !airlineDetection?.found && (
                <div className="p-6 text-center">
                  <Search className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                  <p className="text-sm text-slate-500">No documents found for "{query}"</p>
                  <p className="text-xs text-slate-400 mt-1">Try searching with AWB, LR, Docket, or Invoice numbers</p>
                </div>
              )
            )}

            {/* Footer Hint */}
            <div className="px-3 py-2 border-t border-blue-200/50 bg-slate-50/80 flex items-center justify-between">
              <span className="text-[10px] text-slate-400">↑↓ Navigate · ↵ Open · Esc Close</span>
              <span className="text-[10px] text-slate-400">Min 3 chars to search</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
