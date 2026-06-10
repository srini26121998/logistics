"use client";
import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { OPS_SIDEBAR_NAV } from "@/config/navigation";
import { motion } from "framer-motion";
import { Menu, X, Bell, Search, User } from "lucide-react";
import { toast } from "sonner";
import { NotificationBell } from "@/components/layout/NotificationBell";
import { GlobalSmartSearch } from "@/components/layout/GlobalSmartSearch";
export default function OpsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-slate-50 bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,119,198,0.15),rgba(255,255,255,0))] flex overflow-hidden font-sans text-slate-900 selection:bg-indigo-500/30">
      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div 
          className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar Navigation */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r border-slate-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} flex flex-col`}>
        <div className="h-16 flex items-center px-6 border-b border-blue-200 bg-slate-50">
          <span className="text-xl font-bold tracking-tight text-slate-900 flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.3)]">
              <svg className="w-5 h-5 text-slate-900" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </span>
            SVL Ops Platform
          </span>
          <button className="ml-auto lg:hidden" onClick={() => setIsMobileMenuOpen(false)} suppressHydrationWarning>
            <X className="w-5 h-5 text-slate-600" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-8">
          {OPS_SIDEBAR_NAV.map((section, idx) => (
            <div key={idx}>
              <h3 className="text-[11px] font-semibold text-slate-500 uppercase tracking-widest mb-3 px-3">
                {section.title}
              </h3>
              <div className="space-y-1">
                {section.items.map((item) => {
                  const isActive = pathname === item.href || (item.href !== '/ops' && pathname.startsWith(item.href));
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.label}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-xl text-sm transition-all duration-200 ${
                        isActive 
                          ? "bg-indigo-50 text-indigo-600 font-medium" 
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${isActive ? "text-indigo-600" : "text-slate-500"}`} />
                      {item.label}
                      {isActive && (
                        <motion.div layoutId="sidebar-active" className="absolute left-0 w-1 h-6 bg-indigo-500 rounded-r-full" />
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* User Footer */}
        <div className="p-4 border-t border-blue-200 bg-slate-50/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-slate-100 border border-blue-200 flex items-center justify-center text-sm font-bold text-slate-900 shadow-inner">
              JD
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">John Doe</p>
              <p className="text-xs text-slate-500">Ops Manager</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col min-w-0 lg:pl-72 transition-all duration-300">
        
        {/* Top Header */}
        <header className="h-16 flex items-center justify-between px-4 sm:px-6 lg:px-8 border-b border-blue-200 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-30">
          <div className="flex items-center gap-4">
            <button 
              className="lg:hidden p-2 -ml-2 rounded-lg text-slate-600 hover:text-slate-900 hover:bg-slate-100/50"
              onClick={() => setIsMobileMenuOpen(true)}
              suppressHydrationWarning
            >
              <Menu className="w-5 h-5" />
            </button>
            
            {/* Global Smart Search (Section 5.5.1) */}
            <GlobalSmartSearch className="hidden sm:block" />
          </div>

          <div className="flex items-center gap-4">
            <NotificationBell />
            <div className="h-8 w-px bg-slate-100/60 hidden sm:block"></div>
            <Link href="/" className="text-xs font-medium text-slate-600 hover:text-slate-900 hidden sm:block">Exit Ops</Link>
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 overflow-y-auto py-4 sm:py-6 lg:py-8 px-4 sm:px-6 lg:px-8 custom-scrollbar relative">
           {children}
        </div>
      </main>
    </div>
  );
}
