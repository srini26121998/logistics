"use client";

import React, { ReactNode } from "react";
import { motion } from "framer-motion";
import { Plane } from "lucide-react";
import Link from "next/link";

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle: string;
}

export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4 sm:p-8 relative overflow-hidden font-sans">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.3, 0.2, 0.3],
            rotate: [0, 90, 0],
          }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-blue-600/30 blur-[120px]"
        />
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.2, 0.4, 0.2],
            rotate: [0, -90, 0],
          }}
          transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
          className="absolute -bottom-[20%] -right-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/30 blur-[150px]"
        />
        <motion.div
          animate={{
            y: [0, -50, 0],
            opacity: [0.4, 0.6, 0.4],
          }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[30%] left-[40%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[100px]"
        />
      </div>

      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-0 bg-white/80 backdrop-blur-xl rounded-3xl border border-white/10 shadow-2xl overflow-hidden relative z-10">
        {/* Left Side: Branding/Visuals */}
        <div className="hidden lg:flex flex-col justify-between p-12 bg-gradient-to-br from-blue-900/40 to-indigo-900/40 border-r border-white/5 relative overflow-hidden">
          {/* Subtle grid pattern overlay */}
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent bg-[length:20px_20px]"></div>
          
          <div className="relative z-10">
            <Link href="/" className="flex items-center gap-3 text-slate-900 mb-16 hover:opacity-80 transition-opacity">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30 border border-white/10">
                <Plane className="w-6 h-6 text-slate-900" />
              </div>
              <span className="text-2xl font-bold tracking-tight">NexusLogistics</span>
            </Link>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.8 }}
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium mb-6">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                System Operational
              </div>
              <h1 className="text-4xl font-bold text-slate-900 mb-6 leading-tight">
                Global supply chain <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-indigo-400">
                  intelligence.
                </span>
              </h1>
              <p className="text-slate-700 text-lg leading-relaxed max-w-md">
                Orchestrate your freight, track shipments in real-time, and optimize your global operations with our enterprise logistics platform.
              </p>
            </motion.div>
          </div>

          <div className="relative z-10 flex flex-col gap-4">
            <div className="flex items-center gap-4 text-sm text-slate-600">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map((i) => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-100 flex items-center justify-center overflow-hidden relative">
                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 opacity-20"></div>
                     <img src={`https://i.pravatar.cc/100?img=${i+10}`} alt="User" className="w-full h-full rounded-full object-cover mix-blend-overlay opacity-80" />
                  </div>
                ))}
              </div>
              <p>Trusted by 10,000+ professionals</p>
            </div>
          </div>
        </div>

        {/* Right Side: Form Content */}
        <div className="p-8 sm:p-12 lg:p-16 flex flex-col justify-center relative bg-slate-950/50">
          {/* Mobile Logo */}
          <div className="lg:hidden flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
              <Plane className="w-5 h-5 text-slate-900" />
            </div>
            <span className="text-xl font-bold text-slate-900 tracking-tight">NexusLogistics</span>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="w-full max-w-md mx-auto"
          >
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-slate-900 mb-2">{title}</h2>
              <p className="text-slate-600">{subtitle}</p>
            </div>

            {children}
            
          </motion.div>
        </div>
      </div>
    </div>
  );
}
