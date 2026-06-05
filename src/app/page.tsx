"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, MapPin, Package, FileText, Activity, Zap, TrendingUp, CheckCircle, ArrowRight, ShieldCheck, Clock, PlaneTakeoff, Globe, Users, BarChart3, ChevronRight, Star } from 'lucide-react';

export default function LandingPage() {
  const [trackId, setTrackId] = useState('');
  const [trackingResult, setTrackingResult] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    if (!trackId.trim()) return;
    
    // Dynamic Mock Tracking Result based on AWB input
    const statuses = ['In Transit', 'Out for Delivery', 'Delivered', 'Customs Clearance', 'Processing'];
    const locations = ['MAA (Chennai)', 'DEL (New Delhi)', 'BOM (Mumbai)', 'BLR (Bengaluru)', 'JFK (New York)', 'LHR (London)', 'DXB (Dubai)'];
    
    // Hash the tracking ID to generate consistent pseudo-random results
    const hash = trackId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const status = statuses[hash % statuses.length];
    const lastScan = locations[hash % locations.length];
    
    const isDelivered = status === 'Delivered';
    const etaDays = isDelivered ? 0 : (hash % 5) + 1;
    const etaDate = new Date();
    etaDate.setDate(etaDate.getDate() + etaDays);

    setTrackingResult({
      awb: trackId,
      status: status,
      lastScan: isDelivered ? `Delivered at ${lastScan}` : `Departed from ${lastScan}`,
      timestamp: new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }) + ' Local Time',
      eta: isDelivered ? 'Delivered' : etaDate.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' }),
      progress: isDelivered ? 100 : Math.max(20, (hash % 80) + 10) // 20% to 90%
    });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-indigo-100 selection:text-indigo-900">
      
      {/* 3.1.1 Above the Fold Hero */}
      <section className="relative overflow-hidden bg-slate-900 pt-32 pb-40">
        {/* Animated Background Pattern */}
        <div className="absolute inset-0 opacity-20">
          <svg className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                <path d="M0 40L40 0H20L0 20M40 40V20L20 40" stroke="currentColor" strokeWidth="1" fill="none" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid-pattern)" />
          </svg>
        </div>
        
        {/* Floating elements animation */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-32 h-32 bg-rose-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-40 w-32 h-32 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700 text-indigo-300 text-sm font-medium mb-8 backdrop-blur-sm"
          >
            <Zap className="w-4 h-4 text-rose-400" />
            <span>SVL API v2.0 is now live. Faster, smarter logistics.</span>
            <ChevronRight className="w-4 h-4" />
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold text-white tracking-tight mb-6 leading-tight"
          >
            Logistics. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-rose-400">Reimagined.</span><br />For the Modern Web.
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-xl text-slate-300 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            An enterprise-grade platform unifying global freight, dynamic pricing, and real-time tracking into one seamless experience.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <Link href="/quote" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-gradient-to-r from-rose-500 to-rose-600 hover:from-rose-400 hover:to-rose-500 transition-all shadow-lg shadow-rose-500/30 hover:scale-105 active:scale-95 group">
              Calculate Freight
              <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <button 
              onClick={() => {
                document.getElementById('tracking-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-white bg-slate-800/50 border border-slate-700 hover:border-slate-500 hover:bg-slate-800 backdrop-blur-sm transition-all hover:scale-105 active:scale-95"
            >
              Track Shipment
            </button>
          </motion.div>
        </div>
      </section>

      {/* Partners Marquee */}
      <div className="bg-slate-900 border-b border-slate-800 overflow-hidden relative z-20 py-4 shadow-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-xs font-semibold text-slate-500 uppercase tracking-widest mb-4">Trusted by Industry Leaders</p>
          <div className="flex gap-8 md:gap-16 items-center justify-center flex-wrap opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
             {['Acme Corp', 'GlobalTech', 'Nexus', 'Stark Ind.', 'Wayne Ent.', 'Cyberdyne'].map((partner, i) => (
                <div key={i} className="text-xl font-black text-slate-300 tracking-tighter flex items-center">
                  <Globe className="w-5 h-5 mr-2 text-indigo-400" />
                  {partner}
                </div>
             ))}
          </div>
        </div>
      </div>

      {/* 3.1.2 Instant Tracking Widget */}
      <section id="tracking-section" className="relative -mt-16 z-30 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
          className="bg-white/80 backdrop-blur-xl rounded-3xl shadow-2xl p-8 border border-slate-200/50"
        >
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800 flex items-center">
              <Search className="w-6 h-6 mr-3 text-indigo-500" />
              Live Cargo Tracking
            </h2>
            <div className="flex items-center text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              <span className="relative flex h-2 w-2 mr-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              System Online
            </div>
          </div>
          <form onSubmit={handleTrack} className="flex flex-col md:flex-row gap-4">
            <div className="flex-grow relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Package className="h-5 w-5 text-slate-400" />
              </div>
              <input 
                type="text" 
                value={trackId}
                onChange={(e) => setTrackId(e.target.value.toUpperCase())}
                placeholder="Enter AWB / Tracking ID (e.g., SVL-98765)"
                className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-12 pr-5 py-4 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-lg uppercase tracking-wider shadow-inner transition-all"
              />
            </div>
            <button 
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-4 px-10 rounded-xl transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/50 whitespace-nowrap flex items-center justify-center active:scale-95"
            >
              Track Cargo <ArrowRight className="ml-2 w-5 h-5" />
            </button>
          </form>

          <AnimatePresence>
            {trackingResult && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-6">
                    <div className="flex items-center">
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center mr-4 ${trackingResult.status === 'Delivered' ? 'bg-emerald-100 text-emerald-600' : 'bg-indigo-100 text-indigo-600'}`}>
                        {trackingResult.status === 'Delivered' ? <CheckCircle className="w-6 h-6" /> : <Package className="w-6 h-6" />}
                      </div>
                      <div>
                        <div className="flex items-center mb-1">
                          <span className="font-bold text-slate-900 mr-3 text-lg">{trackingResult.awb}</span>
                          <span className={`text-xs font-bold px-3 py-1 rounded-full flex items-center ${
                            trackingResult.status === 'Delivered' ? 'bg-emerald-100 text-emerald-700' :
                            trackingResult.status === 'Processing' ? 'bg-amber-100 text-amber-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            <Activity className="w-3 h-3 mr-1" /> {trackingResult.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-500 font-medium flex items-center">
                          <MapPin className="w-4 h-4 mr-1" /> {trackingResult.lastScan}
                        </p>
                      </div>
                    </div>
                    <div className="text-left md:text-right bg-slate-50 p-3 rounded-lg border border-slate-100 w-full md:w-auto">
                      <p className="text-xs text-slate-500 font-semibold uppercase tracking-wider mb-1">ETA / Status</p>
                      <p className="font-bold text-slate-900 text-lg flex items-center justify-start md:justify-end">
                        <Clock className="w-4 h-4 mr-1 text-slate-400" /> {trackingResult.eta}
                      </p>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="relative pt-1">
                    <div className="flex mb-2 items-center justify-between">
                      <div>
                        <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-indigo-600 bg-indigo-50">
                          Progress
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-xs font-semibold inline-block text-indigo-600">
                          {trackingResult.progress}%
                        </span>
                      </div>
                    </div>
                    <div className="overflow-hidden h-2 mb-4 text-xs flex rounded-full bg-indigo-100">
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${trackingResult.progress}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-600"
                      ></motion.div>
                    </div>
                  </div>

                  <div className="mt-4 text-center border-t border-slate-100 pt-4">
                    <Link href={`/track/${trackingResult.awb}`} className="text-indigo-600 font-bold text-sm hover:text-indigo-800 flex items-center justify-center inline-flex group transition-colors">
                      View Detailed Timeline <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* 3.1.4 Global Network Stats */}
      <section className="py-24 bg-white relative z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center"
          >
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">150+</div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Countries Served</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Users className="w-6 h-6" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">10M+</div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Happy Clients</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">99.9%</div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Safe Delivery Rate</div>
            </motion.div>
            <motion.div variants={itemVariants} className="p-6 rounded-2xl bg-slate-50 border border-slate-100 hover:border-indigo-100 transition-colors">
              <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6" />
              </div>
              <div className="text-4xl font-extrabold text-slate-900 mb-2">$5B+</div>
              <div className="text-slate-500 font-semibold text-sm uppercase tracking-wide">Freight Managed</div>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* 3.1.3 Advanced Capabilities */}
      <section className="py-24 bg-slate-50 border-t border-slate-200 relative overflow-hidden">
        {/* Background Decoration */}
        <div className="absolute top-0 right-0 -mt-20 -mr-20 w-80 h-80 bg-indigo-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 -mb-20 -ml-20 w-80 h-80 bg-rose-50 rounded-full blur-3xl opacity-50 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center mb-20">
            <h2 className="text-sm font-bold text-indigo-600 uppercase tracking-widest mb-2">Industry Standard Solutions</h2>
            <h3 className="text-4xl font-extrabold text-slate-900 mb-6">Built for Scale and Speed</h3>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Our comprehensive suite of logistics tools is designed to optimize every facet of your supply chain, from quoting to final delivery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* API Integration */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <Zap className="w-32 h-32" />
              </div>
              <div className="w-16 h-16 bg-slate-900 text-white rounded-2xl flex items-center justify-center mb-8 shadow-md">
                <Zap className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Robust Operations API</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Integrate logistics directly into your ERP or WMS. Automate bookings, fetch real-time rates, and receive webhook updates for status changes.
              </p>
              <Link href="/ops/inbound" className="inline-flex items-center text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                Explore Documentation <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Smart Quoting */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <TrendingUp className="w-32 h-32" />
              </div>
              <div className="w-16 h-16 bg-rose-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-md shadow-rose-200">
                <TrendingUp className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Algorithmic Quoting</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Get instant, multi-modal quotes powered by live market data. Compare air, ocean, and ground freight options instantly to optimize ROI.
              </p>
              <Link href="/quote" className="inline-flex items-center text-slate-900 font-bold group-hover:text-rose-600 transition-colors">
                Try Calculator <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

            {/* Digital AWB */}
            <motion.div whileHover={{ y: -5 }} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-xl transition-all group relative overflow-hidden">
              <div className="absolute top-0 right-0 p-6 opacity-5 group-hover:opacity-10 transition-opacity">
                <FileText className="w-32 h-32" />
              </div>
              <div className="w-16 h-16 bg-indigo-500 text-white rounded-2xl flex items-center justify-center mb-8 shadow-md shadow-indigo-200">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Digital e-AWB</h3>
              <p className="text-slate-600 mb-8 leading-relaxed">
                Eliminate paper workflows. Generate, transmit, and track compliant e-AWBs globally. Streamline customs clearance with pre-validated data.
              </p>
              <Link href="/ops/awb/new" className="inline-flex items-center text-slate-900 font-bold group-hover:text-indigo-600 transition-colors">
                Create e-AWB <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>

          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
            <h2 className="text-3xl font-extrabold text-slate-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-slate-600 max-w-2xl mx-auto">
              We empower businesses of all sizes to manage their logistics efficiently.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { text: "SVL transformed our supply chain. The dynamic tracking and automated billing saved us hundreds of hours.", author: "Sarah Jenkins", role: "Logistics Director, TechCorp" },
              { text: "The API integration was seamless. We now have real-time visibility directly within our native ERP dashboard.", author: "Michael Chang", role: "CTO, Global Retail" },
              { text: "Unmatched speed and reliability. The quote calculator provides instant insights for our complex freight needs.", author: "Elena Rodriguez", role: "Operations Lead, InnovateInc" }
            ].map((testimonial, i) => (
              <div key={i} className="bg-slate-50 p-8 rounded-2xl border border-slate-100 relative">
                <div className="flex text-amber-400 mb-4">
                  {[1,2,3,4,5].map(star => <Star key={star} className="w-5 h-5 fill-current" />)}
                </div>
                <p className="text-slate-700 mb-6 italic">"{testimonial.text}"</p>
                <div>
                  <p className="font-bold text-slate-900">{testimonial.author}</p>
                  <p className="text-sm text-slate-500">{testimonial.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-indigo-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h2 className="text-3xl md:text-5xl font-extrabold text-white mb-6">Ready to Modernize Your Logistics?</h2>
          <p className="text-indigo-100 text-lg mb-10">Join thousands of companies using SVL to optimize their freight operations.</p>
          <Link href="/ops/awb/new" className="inline-flex items-center justify-center px-8 py-4 text-lg font-bold rounded-full text-indigo-600 bg-white hover:bg-slate-50 transition-all shadow-xl hover:scale-105 active:scale-95">
            Start Your First Shipment
          </Link>
        </div>
      </section>

    </div>
  );
}

