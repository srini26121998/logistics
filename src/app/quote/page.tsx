"use client";

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PlaneTakeoff, PlaneLanding, Scale, Box, Info, ShieldCheck, Zap, ArrowRight, CheckCircle2, ChevronDown, ChevronUp, Truck, ShieldAlert } from 'lucide-react';
import Link from 'next/link';

const AIRPORTS = [
  { code: 'MAA', name: 'Chennai International Airport', state: 'Tamil Nadu' },
  { code: 'PNQ', name: 'Pune Airport', state: 'Maharashtra' },
  { code: 'BDQ', name: 'Vadodara Airport', state: 'Gujarat' },
  { code: 'HYD', name: 'Rajiv Gandhi International Airport', state: 'Telangana' },
  { code: 'BLR', name: 'Kempegowda International Airport', state: 'Karnataka' },
  { code: 'BOM', name: 'Chhatrapati Shivaji Maharaj International Airport', state: 'Maharashtra' },
  { code: 'DEL', name: 'Indira Gandhi International Airport', state: 'Delhi' },
  { code: 'CCU', name: 'Netaji Subhas Chandra Bose International Airport', state: 'West Bengal' },
];

const COMMODITIES = [
  { value: 'GEN', label: 'General Cargo', defaultShc: 'GEN' },
  { value: 'DGR', label: 'Dangerous Goods', defaultShc: 'DGR' },
  { value: 'MAC', label: 'Machinery Parts', defaultShc: 'MAC' },
  { value: 'PHA', label: 'Pharmaceuticals', defaultShc: 'PIL' },
];

const CARRIERS = [
  { value: 'ALL', label: 'All Carriers (Best Rate)' },
  { value: '6E', label: 'IndiGo (6E)' },
  { value: 'QP', label: 'Akasa Air (QP)' },
];

const SERVICE_TYPES = [
  { value: 'A2A', label: 'Airport to Airport' },
  { value: 'D2D', label: 'Door to Door' },
  { value: 'D2A', label: 'Door to Airport' },
  { value: 'A2D', label: 'Airport to Door' },
];

export default function DynamicQuoteCalculator() {
  const [origin, setOrigin] = useState('MAA');
  const [destination, setDestination] = useState('DEL');
  const [length, setLength] = useState<number | ''>(50);
  const [width, setWidth] = useState<number | ''>(50);
  const [height, setHeight] = useState<number | ''>(50);
  const [actualWeight, setActualWeight] = useState<number | ''>(25);
  const [commodity, setCommodity] = useState('GEN');
  const [shcCode, setShcCode] = useState('GEN');
  const [carrier, setCarrier] = useState('ALL');
  const [serviceType, setServiceType] = useState('A2A');
  const [insurance, setInsurance] = useState(false);
  const [declaredValue, setDeclaredValue] = useState<number | ''>('');
  const [isAncillaryExpanded, setIsAncillaryExpanded] = useState(false);

  // Handle Commodity Change to auto-update SHC
  const handleCommodityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCom = e.target.value;
    setCommodity(newCom);
    const found = COMMODITIES.find(c => c.value === newCom);
    if (found) {
      setShcCode(found.defaultShc);
    }
  };

  // Calculations
  const volWeight = useMemo(() => {
    const l = Number(length) || 0;
    const w = Number(width) || 0;
    const h = Number(height) || 0;
    return Math.round((l * w * h) / 6000);
  }, [length, width, height]);

  const actWeight = Number(actualWeight) || 0;
  const chargeableWeight = Math.round(Math.max(actWeight, volWeight));

  const formatNum = (num: number) => {
    if (isNaN(num)) return '0';
    const numRound = Math.round(num);
    const parts = numRound.toString().split('.');
    let lastThree = parts[0].substring(parts[0].length - 3);
    const otherNumbers = parts[0].substring(0, parts[0].length - 3);
    if (otherNumbers !== '' && otherNumbers !== '-') lastThree = ',' + lastThree;
    return otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") + lastThree;
  };

  const pricing = useMemo(() => {
    if (origin === destination || chargeableWeight === 0) {
      return null;
    }

    const originApt = AIRPORTS.find(a => a.code === origin);
    const destApt = AIRPORTS.find(a => a.code === destination);
    const isInterstate = originApt?.state !== destApt?.state;

    // Mock Base Rate Logic
    let baseRate = 50;
    if ((origin === 'MAA' && destination === 'DEL') || (origin === 'DEL' && destination === 'MAA')) baseRate = 65;
    else if ((origin === 'BOM' && destination === 'DEL') || (origin === 'DEL' && destination === 'BOM')) baseRate = 55;
    else if ((origin === 'BLR' && destination === 'DEL') || (origin === 'DEL' && destination === 'BLR')) baseRate = 60;
    else if ((origin === 'PNQ' && destination === 'BLR') || (origin === 'BLR' && destination === 'PNQ')) baseRate = 45;

    // Multipliers
    let commodityMultiplier = 1.0;
    if (commodity === 'DGR') commodityMultiplier = 2.0;
    if (commodity === 'MAC') commodityMultiplier = 1.3;
    if (commodity === 'PHA') commodityMultiplier = 1.5;

    let carrierMultiplier = 1.0;
    if (carrier === 'QP') carrierMultiplier = 0.9;

    let finalRatePerKg = baseRate * commodityMultiplier * carrierMultiplier;
    
    let isMinRateApplied = false;
    if (chargeableWeight < 15 && finalRatePerKg < 70) {
      finalRatePerKg = 70;
      isMinRateApplied = true;
    }
    
    const baseFreight = Math.round(chargeableWeight * finalRatePerKg);
    
    // Ancillary Charges
    const awbAgent = 150;
    const awbCarrier = 100;
    const awbFeeTotal = awbAgent + awbCarrier;
    const adminCharges = 50;
    const deliveryOrder = 200;
    const fuelSurcharge = Math.round(chargeableWeight * 5); 
    const outboundHandling = 100;
    const terminalStorage = 0; 
    const xRayFee = Math.round(Math.max(100, chargeableWeight * 2));

    let pickupCharge = 0;
    let deliveryCharge = 0;
    
    if (serviceType === 'D2A' || serviceType === 'D2D') {
      pickupCharge = Math.round(Math.max(1500, chargeableWeight * 12));
    }
    if (serviceType === 'A2D' || serviceType === 'D2D') {
      deliveryCharge = Math.round(Math.max(1500, chargeableWeight * 12));
    }
    
    let insurancePremium = 0;
    if (insurance && typeof declaredValue === 'number' && declaredValue > 0) {
      insurancePremium = Math.round(Math.max(250, declaredValue * 0.005)); 
    }

    const totalAncillary = awbFeeTotal + adminCharges + deliveryOrder + fuelSurcharge + outboundHandling + terminalStorage + xRayFee + pickupCharge + deliveryCharge + insurancePremium;

    const taxableAmount = baseFreight + totalAncillary;
    
    let igst = 0;
    let cgst = 0;
    let sgst = 0;

    if (isInterstate) {
      igst = Math.round(taxableAmount * 0.18);
    } else {
      cgst = Math.round(taxableAmount * 0.09);
      sgst = Math.round(taxableAmount * 0.09);
    }

    const netPayable = taxableAmount + igst + cgst + sgst;

    return {
      ratePerKg: finalRatePerKg,
      isMinRateApplied,
      baseFreight,
      ancillary: {
        awbAgent,
        awbCarrier,
        awbFeeTotal,
        adminCharges,
        deliveryOrder,
        fuelSurcharge,
        outboundHandling,
        terminalStorage,
        xRayFee,
        pickupCharge,
        deliveryCharge,
        insurancePremium,
        total: totalAncillary
      },
      taxableAmount,
      isInterstate,
      igst,
      cgst,
      sgst,
      netPayable
    };
  }, [origin, destination, chargeableWeight, commodity, carrier, serviceType, insurance, declaredValue]);

  return (
    <div className="min-h-screen bg-[#0A0A0B] py-8 px-4 sm:px-6 lg:px-8 font-sans pb-32 text-slate-200">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-2">
              <Zap className="w-8 h-8 text-indigo-500" />
              Dynamic Quote Calculator
            </h1>
            <p className="text-sm text-slate-400 mt-1 max-w-2xl">
              Get instant, accurate pricing for your cargo shipments. Rates update in real-time as you type.
            </p>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-6">
          
          {/* Left Column: Shipment Input Panel */}
          <div className="w-full lg:w-[65%] space-y-6">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-800 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center">
                <Box className="w-5 h-5 mr-2 text-indigo-400" />
                Routing & Dimensions
              </h2>

              {/* Routing */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center">
                    <PlaneTakeoff className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    Origin Airport
                  </label>
                  <select 
                    value={origin}
                    onChange={(e) => setOrigin(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm appearance-none"
                  >
                    {AIRPORTS.map(apt => (
                      <option key={apt.code} value={apt.code}>{apt.code} - {apt.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center">
                    <PlaneLanding className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    Destination Airport
                  </label>
                  <select 
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                    className={`w-full bg-[#121622] border rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all shadow-sm appearance-none ${origin === destination ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-500' : 'border-slate-700/80'}`}
                  >
                    {AIRPORTS.map(apt => (
                      <option key={apt.code} value={apt.code} disabled={apt.code === origin}>{apt.code} - {apt.name}</option>
                    ))}
                  </select>
                  {origin === destination && (
                    <p className="text-red-400 text-[10px] mt-1 font-medium flex items-center">
                      <Info className="w-3 h-3 mr-1" /> Destination cannot be same as origin.
                    </p>
                  )}
                </div>
              </div>

              {/* Dimensions and Weight */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Length (cm)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={length}
                    onChange={(e) => setLength(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="L"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Width (cm)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={width}
                    onChange={(e) => setWidth(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="W"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Height (cm)</label>
                  <input 
                    type="number" 
                    min="0"
                    value={height}
                    onChange={(e) => setHeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="H"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center">
                    <Scale className="w-3.5 h-3.5 mr-1.5 text-slate-500" />
                    Gross Wt (kg)
                  </label>
                  <input 
                    type="number" 
                    min="0"
                    value={actualWeight}
                    onChange={(e) => setActualWeight(e.target.value === '' ? '' : Number(e.target.value))}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-sm"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-xl p-3 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-indigo-400" />
                  <span className="text-sm font-medium text-indigo-200">Chargeable Weight</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs text-indigo-400/70">Max(Act, Vol/6000)</span>
                  <span className="text-lg font-bold text-indigo-400">{chargeableWeight.toFixed(2)} kg</span>
                </div>
              </div>

            </motion.div>

            {/* Service & Cargo Details */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-slate-900/50 backdrop-blur-md rounded-2xl shadow-sm border border-slate-800 p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-5 flex items-center">
                <ShieldCheck className="w-5 h-5 mr-2 text-indigo-400" />
                Service & Cargo Profile
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center">
                    <Truck className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Service Type
                  </label>
                  <select 
                    value={serviceType}
                    onChange={(e) => setServiceType(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    {SERVICE_TYPES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5 flex items-center">
                    <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-slate-500" /> Cargo Insurance
                  </label>
                  <div className="flex items-center gap-3">
                    <div className="flex items-center bg-[#121622] rounded-xl p-1 border border-slate-700/80">
                      <button type="button" onClick={() => setInsurance(true)} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${insurance ? 'bg-indigo-500 text-white' : 'text-slate-400 hover:text-white'}`}>Yes</button>
                      <button type="button" onClick={() => {setInsurance(false); setDeclaredValue('');}} className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${!insurance ? 'bg-slate-700 text-white' : 'text-slate-400 hover:text-white'}`}>No</button>
                    </div>
                    {insurance && (
                      <input 
                        type="number"
                        placeholder="Declared Value (₹)"
                        value={declaredValue}
                        onChange={(e) => setDeclaredValue(e.target.value === '' ? '' : Number(e.target.value))}
                        className="flex-1 bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all"
                      />
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Commodity Type</label>
                  <select 
                    value={commodity}
                    onChange={handleCommodityChange}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    {COMMODITIES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">SHC Code</label>
                  <input 
                    type="text" 
                    value={shcCode}
                    onChange={(e) => setShcCode(e.target.value.toUpperCase())}
                    maxLength={3}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all font-mono text-center uppercase tracking-widest text-sm"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-400 mb-1.5">Preferred Carrier</label>
                  <select 
                    value={carrier}
                    onChange={(e) => setCarrier(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700/80 rounded-xl px-3 py-2.5 text-sm text-white focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all appearance-none"
                  >
                    {CARRIERS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column: Pricing Breakdown */}
          <div className="w-full lg:w-[35%]">
            <div className="sticky top-8">
              <AnimatePresence mode="wait">
                {pricing ? (
                  <motion.div 
                    key="pricing-card"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="bg-slate-900/80 backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden border border-slate-700 flex flex-col relative"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500"></div>
                    <div className="p-6 pb-4 border-b border-slate-800 relative overflow-hidden">
                      <div className="absolute -right-6 -top-6 opacity-5">
                        <Box className="w-32 h-32" />
                      </div>
                      <h3 className="text-sm font-medium text-slate-400 mb-1 uppercase tracking-wider">Estimated Net Payable</h3>
                      <div className="text-4xl font-bold text-white tracking-tight">
                        ₹{formatNum(pricing.netPayable)}
                      </div>
                      <div className="mt-3 flex items-center text-[11px] font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-md inline-flex w-fit">
                        <CheckCircle2 className="w-3.5 h-3.5 mr-1.5" /> Rate Locked for 24h
                      </div>
                    </div>

                    <div className="p-6 flex-grow flex flex-col justify-between space-y-5">
                      
                      <div className="space-y-4">
                        <div className="flex flex-col pb-3 border-b border-slate-800">
                          <div className="flex justify-between items-center">
                            <span className="text-slate-300 font-medium text-sm flex items-center">
                              Base Freight 
                              {pricing.isMinRateApplied && (
                                <span className="ml-2 px-1.5 py-0.5 bg-indigo-500/20 text-indigo-400 text-[9px] uppercase font-bold rounded">Min Rate</span>
                              )}
                            </span>
                            <span className="text-white font-semibold text-sm">₹{formatNum(pricing.baseFreight)}</span>
                          </div>
                          <div className="text-[11px] text-slate-500 mt-1">
                            {formatNum(chargeableWeight)} kg × ₹{formatNum(pricing.ratePerKg)}/kg
                          </div>
                        </div>
                        
                        {/* Ancillary Charges Accordion */}
                        <div className="border border-slate-800 rounded-xl overflow-hidden transition-all duration-300">
                          <button 
                            onClick={() => setIsAncillaryExpanded(!isAncillaryExpanded)}
                            className="w-full bg-[#121622] px-4 py-2.5 flex justify-between items-center hover:bg-slate-800 transition-colors"
                          >
                            <span className="text-slate-300 font-medium text-sm">Ancillary & Services</span>
                            <div className="flex items-center space-x-2">
                              <span className="text-white font-semibold text-sm">₹{formatNum(pricing.ancillary.total)}</span>
                              {isAncillaryExpanded ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </div>
                          </button>
                          
                          <AnimatePresence>
                            {isAncillaryExpanded && (
                              <motion.div 
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="bg-slate-900/50 px-4 py-3 space-y-2 border-t border-slate-800 text-xs"
                              >
                                <div className="flex justify-between"><span className="text-slate-400">AWB Fees</span><span className="text-slate-200">₹{formatNum(pricing.ancillary.awbFeeTotal)}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Admin (AD)</span><span className="text-slate-200">₹{formatNum(pricing.ancillary.adminCharges)}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Delivery Order (DO)</span><span className="text-slate-200">₹{formatNum(pricing.ancillary.deliveryOrder)}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">Fuel Surcharge (FS)</span><span className="text-slate-200">₹{formatNum(pricing.ancillary.fuelSurcharge)}</span></div>
                                <div className="flex justify-between"><span className="text-slate-400">X-Ray (XS)</span><span className="text-slate-200">₹{formatNum(pricing.ancillary.xRayFee)}</span></div>
                                {pricing.ancillary.pickupCharge > 0 && <div className="flex justify-between text-indigo-300"><span className="">Origin Pickup</span><span className="">₹{formatNum(pricing.ancillary.pickupCharge)}</span></div>}
                                {pricing.ancillary.deliveryCharge > 0 && <div className="flex justify-between text-indigo-300"><span className="">Dest Delivery</span><span className="">₹{formatNum(pricing.ancillary.deliveryCharge)}</span></div>}
                                {pricing.ancillary.insurancePremium > 0 && <div className="flex justify-between text-indigo-300"><span className="">Insurance Premium</span><span className="">₹{formatNum(pricing.ancillary.insurancePremium)}</span></div>}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>

                        <div className="flex justify-between items-center py-2 border-b border-slate-800">
                          <span className="text-slate-400 font-medium text-sm">Taxable Amount</span>
                          <span className="text-white font-semibold text-sm">₹{formatNum(pricing.taxableAmount)}</span>
                        </div>
                        
                        <div className="space-y-1 text-xs">
                          {pricing.isInterstate ? (
                            <div className="flex justify-between items-center">
                              <span className="text-slate-400">IGST (18%) <span className="text-[9px] ml-1 bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 uppercase">Interstate</span></span>
                              <span className="text-slate-300">₹{formatNum(pricing.igst)}</span>
                            </div>
                          ) : (
                            <>
                              <div className="flex justify-between items-center mb-1">
                                <span className="text-slate-400">CGST (9%) <span className="text-[9px] ml-1 bg-slate-800 px-1.5 py-0.5 rounded text-slate-500 uppercase">Intrastate</span></span>
                                <span className="text-slate-300">₹{formatNum(pricing.cgst)}</span>
                              </div>
                              <div className="flex justify-between items-center">
                                <span className="text-slate-400">SGST (9%)</span>
                                <span className="text-slate-300">₹{formatNum(pricing.sgst)}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      <div className="pt-4 mt-auto">
                        <Link 
                          href={`/booking/new?origin=${origin}&destination=${destination}&weight=${chargeableWeight}&commodity=${commodity}&baseFreight=${pricing.baseFreight}&otherCharges=${pricing.ancillary.total}&igst=${pricing.isInterstate ? pricing.igst : pricing.cgst + pricing.sgst}&total=${pricing.netPayable}`}
                          className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-medium py-3 px-4 rounded-xl shadow-[0_0_15px_rgba(79,70,229,0.3)] transition-all flex items-center justify-center group"
                        >
                          Book This Shipment
                          <ArrowRight className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
                        </Link>
                        <p className="text-center text-[10px] text-slate-500 mt-3">
                          By proceeding, you agree to our Terms of Carriage.
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty-state"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-slate-900/50 rounded-2xl shadow-sm border border-slate-800 border-dashed p-8 flex flex-col items-center justify-center text-center h-full min-h-[400px]"
                  >
                    <div className="w-14 h-14 bg-slate-800 rounded-full flex items-center justify-center mb-4">
                      <Box className="w-6 h-6 text-slate-400" />
                    </div>
                    <h3 className="text-base font-semibold text-white mb-2">Awaiting Details</h3>
                    <p className="text-slate-400 text-xs max-w-xs leading-relaxed">
                      Please ensure origin and destination are different, and chargeable weight is greater than zero to see your instant quote.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

