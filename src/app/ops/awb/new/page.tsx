"use client";

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, PlaneTakeoff, PlaneLanding, Package, Scale, Box, Info, ShieldCheck, 
  Zap, ArrowRight, CheckCircle2, User, MapPin, Phone, Building, Hash, 
  Plus, Trash2, Save, Send, Printer, FileCheck2, ChevronDown, ChevronUp, Lock
} from 'lucide-react';

const CARRIERS = [
  { value: '6E', label: 'IndiGo (6E)' },
  { value: 'QP', label: 'Akasa Air (QP)' },
];

const RATE_CLASSES = [
  { value: 'N', label: 'N - Normal' },
  { value: 'Q', label: 'Q - Quantity' },
  { value: 'M', label: 'M - Minimum' },
];

const ANCILLARY_CODES = [
  { code: 'AA', desc: 'AWB Fees Due Agent', defaultAmount: 150, type: 'Agent' },
  { code: 'AC', desc: 'AWB Fees Due Carrier', defaultAmount: 100, type: 'Carrier' },
  { code: 'AD', desc: 'Administrative Charges', defaultAmount: 50, type: 'Agent' },
  { code: 'DO', desc: 'Delivery Order Charges', defaultAmount: 200, type: 'Agent' },
  { code: 'FS', desc: 'Fuel Surcharge', defaultAmount: 0, type: 'Carrier' },
  { code: 'HO', desc: 'Outbound Handling', defaultAmount: 0, type: 'Agent' },
  { code: 'TO', desc: 'Terminal Storage', defaultAmount: 0, type: 'Agent' },
  { code: 'XS', desc: 'X-Ray Screening', defaultAmount: 100, type: 'Carrier' },
  { code: 'XY', desc: 'X-Ray Screening', defaultAmount: 100, type: 'Carrier' },
];

const MOCK_SHIPPER = {
  name: 'Acme Corp Logistics',
  address: '123 Industrial Estate',
  city: 'Chennai',
  state: 'Tamil Nadu',
  pin: '600001',
  country: 'India',
  phone: '+91 98765 43210',
  accountNo: 'ACC-100234'
};

const MOCK_CONSIGNEE = {
  name: 'Global Tech Imports',
  address: '456 Tech Park, Phase 2',
  city: 'Delhi',
  state: 'Delhi',
  pin: '110020',
  country: 'India',
  phone: '+91 91234 56780',
  accountNo: 'ACC-998877'
};

function AWBFormContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [awbStatus, setAwbStatus] = useState<'Draft' | 'Confirmed'>('Draft');
  const [awbNumber, setAwbNumber] = useState('');
  
  // Header Section
  const [issuingCarrier, setIssuingCarrier] = useState('6E');
  const [agentName, setAgentName] = useState('MAA CARGO LOGISTICS CHENNAI');
  const [agentIata, setAgentIata] = useState('14-3 1234');
  const [agentAccount, setAgentAccount] = useState('AGT-9900');

  // Shipper & Consignee
  const [shipper, setShipper] = useState({
    name: '', address: '', city: '', state: '', pin: '', country: '', phone: '', accountNo: ''
  });
  const [consignee, setConsignee] = useState({
    name: '', address: '', city: '', state: '', pin: '', country: '', phone: '', accountNo: ''
  });

  const autoFillShipper = () => setShipper(MOCK_SHIPPER);
  const autoFillConsignee = () => setConsignee(MOCK_CONSIGNEE);

  // Routing
  const [departure, setDeparture] = useState('MAA-CHENNAI');
  const [destination, setDestination] = useState('DEL-DELHI');
  const [flightNumber, setFlightNumber] = useState('');
  const [flightDate, setFlightDate] = useState('');
  const [routingLegs, setRoutingLegs] = useState([{ id: 1, to: '', by: '' }]);

  const addRoutingLeg = () => {
    setRoutingLegs([...routingLegs, { id: Date.now(), to: '', by: '' }]);
  };
  const removeRoutingLeg = (id: number) => {
    setRoutingLegs(routingLegs.filter(leg => leg.id !== id));
  };

  // Cargo Details
  const [pieces, setPieces] = useState<number | ''>('');
  const [grossWeight, setGrossWeight] = useState<number | ''>('');
  const [rateClass, setRateClass] = useState('N');
  const [commodityItemNo, setCommodityItemNo] = useState('');
  const [chargeableWeight, setChargeableWeight] = useState<number | ''>('');
  const [rateCharge, setRateCharge] = useState<number | ''>('');
  const [natureOfGoods, setNatureOfGoods] = useState('');
  const [shc, setShc] = useState('');
  const [declaredValueCarriage, setDeclaredValueCarriage] = useState('NVD');
  const [declaredValueCustoms, setDeclaredValueCustoms] = useState('NCV');

  // Effect to read Query Params
  useEffect(() => {
    const originParam = searchParams.get('origin');
    const destParam = searchParams.get('dest');
    const wtParam = searchParams.get('wt');
    const comParam = searchParams.get('com');
    const carrParam = searchParams.get('carr');

    setTimeout(() => {
      if (originParam) setDeparture(originParam);
      if (destParam) setDestination(destParam);
      if (wtParam) {
        setChargeableWeight(Number(wtParam));
        setGrossWeight(Number(wtParam));
      }
      if (comParam) setShc(comParam === 'GEN' ? 'GEN' : comParam === 'DGR' ? 'DGR' : 'MAC');
      if (carrParam && carrParam !== 'ALL') setIssuingCarrier(carrParam);
    }, 0);
  }, [searchParams]);

  const totalCharge = useMemo(() => {
    return (Number(chargeableWeight) || 0) * (Number(rateCharge) || 0);
  }, [chargeableWeight, rateCharge]);

  // Charges Matrix (Ancillary)
  const [charges, setCharges] = useState([
    { id: 1, code: 'AW', desc: 'AWB Fee', amount: 150, type: 'Agent', payment: 'Prepaid' }
  ]);

  const addCharge = () => {
    setCharges([...charges, { id: Date.now(), code: '', desc: '', amount: 0, type: 'Agent', payment: 'Prepaid' }]);
  };
  const removeCharge = (id: number) => {
    setCharges(charges.filter(c => c.id !== id));
  };
  const updateCharge = (id: number, field: string, value: string | number) => {
    setCharges(charges.map(c => {
      if (c.id === id) {
        const updated = { ...c, [field]: value };
        if (field === 'code') {
          const found = ANCILLARY_CODES.find(ac => ac.code === value);
          if (found) {
            updated.desc = found.desc;
            updated.amount = found.defaultAmount;
            updated.type = found.type;
          }
        }
        return updated;
      }
      return c;
    }));
  };

  const { totalAgent, totalCarrier, totalPrepaid, totalCollect } = useMemo(() => {
    let tAgent = 0;
    let tCarrier = 0;
    let tPrepaid = 0;
    let tCollect = 0;
    
    charges.forEach(c => {
      const amt = Number(c.amount) || 0;
      if (c.type === 'Agent') tAgent += amt;
      else if (c.type === 'Carrier') tCarrier += amt;

      if (c.payment === 'Prepaid') tPrepaid += amt;
      else tCollect += amt;
    });

    return { totalAgent: tAgent, totalCarrier: tCarrier, totalPrepaid: tPrepaid, totalCollect: tCollect };
  }, [charges]);


  const handleGenerateAWB = () => {
    const prefix = issuingCarrier === '6E' ? '312' : '000';
    const random8 = Math.floor(10000000 + Math.random() * 90000000);
    setAwbNumber(`${prefix}-${random8}`);
    setAwbStatus('Confirmed');
  };

  const isLocked = awbStatus === 'Confirmed';

  return (
    <div className="min-h-screen bg-[#0A0A0B] text-slate-200 py-8 px-4 sm:px-6 lg:px-8 font-sans pb-32">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Top Header & Actions */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-slate-900/80 backdrop-blur-md p-6 rounded-2xl border border-slate-800 gap-4 sticky top-4 z-50">
          <div>
            <h1 className="text-2xl font-extrabold text-white flex items-center">
              <FileText className="w-6 h-6 mr-2 text-indigo-400" />
              Air Waybill Creation
            </h1>
            <div className="flex items-center mt-2 space-x-3">
              <span className={`px-3 py-1 text-xs font-bold rounded-full ${awbStatus === 'Draft' ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'}`}>
                {awbStatus.toUpperCase()}
              </span>
              {awbNumber && (
                <span className="font-mono text-lg font-bold text-indigo-300 tracking-wider bg-indigo-500/20 px-3 py-1 rounded-md border border-indigo-500/30">
                  AWB: {awbNumber}
                </span>
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            <button disabled={isLocked} className="px-4 py-2 bg-[#121622] border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-medium flex items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed">
              <Save className="w-4 h-4 mr-2" /> Save Draft
            </button>
            {!isLocked ? (
              <button onClick={handleGenerateAWB} className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white shadow-[0_0_15px_rgba(79,70,229,0.3)] hover:shadow-[0_0_25px_rgba(79,70,229,0.5)] font-bold flex items-center shadow-md shadow-indigo-200 transition-colors">
                <FileCheck2 className="w-4 h-4 mr-2" /> Generate AWB
              </button>
            ) : (
              <>
                <button onClick={() => window.print()} className="px-4 py-2 bg-slate-800 text-white rounded-lg hover:bg-slate-900 font-medium flex items-center transition-colors">
                  <Printer className="w-4 h-4 mr-2" /> Print PDF
                </button>
                <button onClick={() => alert('Email sent to shipper successfully.')} className="px-4 py-2 bg-[#121622] border border-slate-700 text-slate-300 rounded-lg hover:bg-slate-800 font-medium flex items-center transition-colors">
                  <Send className="w-4 h-4 mr-2" /> Email
                </button>
                <button onClick={() => router.push('/ops/outbound')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.3)] font-medium flex items-center transition-colors">
                  <PlaneTakeoff className="w-4 h-4 mr-2" /> Proceed to Buildup
                </button>
              </>
            )}
          </div>
        </div>

        {isLocked && (
          <div className="bg-blue-500/10 border border-blue-500/30 text-blue-300 px-6 py-4 rounded-xl flex items-start shadow-sm">
            <Lock className="w-5 h-5 mr-3 mt-0.5 flex-shrink-0 text-blue-600" />
            <div>
              <h4 className="font-bold">AWB Locked</h4>
              <p className="text-sm mt-1 opacity-90">This Air Waybill has been generated and is now locked for editing. You can print the PDF or email it to the shipper.</p>
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <div className="lg:col-span-8 space-y-6">
            
            {/* 3.3.1 Header Section */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-[#121622]/80 px-6 py-4 border-b border-slate-800 flex items-center">
                <Building className="w-5 h-5 mr-2 text-slate-400" />
                <h2 className="text-lg font-bold text-white">Header Information</h2>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Issuing Carrier</label>
                  <select 
                    disabled={isLocked}
                    value={issuingCarrier} onChange={e => setIssuingCarrier(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50"
                  >
                    {CARRIERS.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Agent Name</label>
                  <input 
                    type="text" disabled={isLocked} value={agentName} onChange={e => setAgentName(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Agent IATA Code</label>
                  <input 
                    type="text" disabled={isLocked} value={agentIata} onChange={e => setAgentIata(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5">Agent Account No.</label>
                  <input 
                    type="text" disabled={isLocked} value={agentAccount} onChange={e => setAgentAccount(e.target.value)}
                    className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50"
                  />
                </div>
              </div>
            </motion.div>

            {/* 3.3.2 Shipper & Consignee */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-[#121622]/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center">
                  <User className="w-5 h-5 mr-2 text-slate-400" />
                  <h2 className="text-lg font-bold text-white">Shipper & Consignee</h2>
                </div>
              </div>
              <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8 border-b border-slate-800/50">
                {/* Shipper */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-indigo-300 flex items-center">Shipper Details</h3>
                    {!isLocked && <button onClick={autoFillShipper} className="text-xs font-bold text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded hover:bg-indigo-500/20">Auto-fill</button>}
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Name" disabled={isLocked} value={shipper.name} onChange={e => setShipper({...shipper, name: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    <input type="text" placeholder="Address" disabled={isLocked} value={shipper.address} onChange={e => setShipper({...shipper, address: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="City" disabled={isLocked} value={shipper.city} onChange={e => setShipper({...shipper, city: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="State" disabled={isLocked} value={shipper.state} onChange={e => setShipper({...shipper, state: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="PIN" disabled={isLocked} value={shipper.pin} onChange={e => setShipper({...shipper, pin: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="Country" disabled={isLocked} value={shipper.country} onChange={e => setShipper({...shipper, country: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Phone" disabled={isLocked} value={shipper.phone} onChange={e => setShipper({...shipper, phone: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="Account No (Opt)" disabled={isLocked} value={shipper.accountNo} onChange={e => setShipper({...shipper, accountNo: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                  </div>
                </div>

                {/* Consignee */}
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold text-teal-400 flex items-center">Consignee Details</h3>
                    {!isLocked && <button onClick={autoFillConsignee} className="text-xs font-bold text-teal-400 bg-teal-500/10 px-2 py-1 rounded hover:bg-teal-500/20">Auto-fill</button>}
                  </div>
                  <div className="space-y-3">
                    <input type="text" placeholder="Name" disabled={isLocked} value={consignee.name} onChange={e => setConsignee({...consignee, name: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    <input type="text" placeholder="Address" disabled={isLocked} value={consignee.address} onChange={e => setConsignee({...consignee, address: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="City" disabled={isLocked} value={consignee.city} onChange={e => setConsignee({...consignee, city: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="State" disabled={isLocked} value={consignee.state} onChange={e => setConsignee({...consignee, state: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="PIN" disabled={isLocked} value={consignee.pin} onChange={e => setConsignee({...consignee, pin: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="Country" disabled={isLocked} value={consignee.country} onChange={e => setConsignee({...consignee, country: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <input type="text" placeholder="Phone" disabled={isLocked} value={consignee.phone} onChange={e => setConsignee({...consignee, phone: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" placeholder="Account No (Opt)" disabled={isLocked} value={consignee.accountNo} onChange={e => setConsignee({...consignee, accountNo: e.target.value})} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3.3.4 Cargo Details */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-[#121622]/80 px-6 py-4 border-b border-slate-800 flex items-center">
                <Package className="w-5 h-5 mr-2 text-slate-400" />
                <h2 className="text-lg font-bold text-white">Cargo Details</h2>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Pieces (RCP)</label>
                    <input type="number" disabled={isLocked} value={pieces} onChange={e => setPieces(Number(e.target.value))} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Gross Wt. (kg)</label>
                    <input type="number" disabled={isLocked} value={grossWeight} onChange={e => setGrossWeight(Number(e.target.value))} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Chargeable Wt. (kg)</label>
                    <input type="number" disabled={isLocked} value={chargeableWeight} onChange={e => setChargeableWeight(Number(e.target.value))} className="w-full bg-indigo-500/10 border border-indigo-500/30 rounded-lg px-3 py-2 text-indigo-300 font-bold focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Rate Class</label>
                    <select disabled={isLocked} value={rateClass} onChange={e => setRateClass(e.target.value)} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50">
                      {RATE_CLASSES.map(c => <option key={c.value} value={c.value}>{c.label}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-t border-slate-800/50 pt-6">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Commodity Item No.</label>
                    <input type="text" disabled={isLocked} value={commodityItemNo} onChange={e => setCommodityItemNo(e.target.value)} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Nature of Goods</label>
                    <input type="text" disabled={isLocked} value={natureOfGoods} onChange={e => setNatureOfGoods(e.target.value)} placeholder="e.g. MACHINERY PARTS" className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">SHC</label>
                    <input type="text" disabled={isLocked} value={shc} onChange={e => setShc(e.target.value.toUpperCase())} maxLength={3} placeholder="GEN" className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50 font-mono uppercase" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Rate/Charge</label>
                    <input type="number" disabled={isLocked} value={rateCharge} onChange={e => setRateCharge(Number(e.target.value))} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                </div>
                
                <div className="flex justify-between items-center bg-[#121622] p-4 rounded-xl border border-slate-800">
                  <div className="flex gap-4">
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Value for Carriage</label>
                      <select disabled={isLocked} value={declaredValueCarriage} onChange={e => setDeclaredValueCarriage(e.target.value)} className="w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50">
                        <option value="NVD">NVD</option>
                        <option value="VAL">Declared Value</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs font-semibold text-slate-400 mb-1">Value for Customs</label>
                      <select disabled={isLocked} value={declaredValueCustoms} onChange={e => setDeclaredValueCustoms(e.target.value)} className="w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-1.5 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50">
                        <option value="NCV">NCV</option>
                        <option value="VAL">Declared Value</option>
                      </select>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-400 uppercase">Total Weight Charge</div>
                    <div className="text-2xl font-extrabold text-white">₹{totalCharge.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* 3.3.5 Charges Matrix */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden">
              <div className="bg-[#121622]/80 px-6 py-4 border-b border-slate-800 flex justify-between items-center">
                <div className="flex items-center">
                  <Hash className="w-5 h-5 mr-2 text-slate-400" />
                  <h2 className="text-lg font-bold text-white">Ancillary Charges</h2>
                </div>
                {!isLocked && (
                  <button onClick={addCharge} className="text-sm font-bold text-indigo-400 bg-indigo-500/10 px-3 py-1.5 rounded-lg hover:bg-indigo-500/20 flex items-center">
                    <Plus className="w-4 h-4 mr-1" /> Add Charge
                  </button>
                )}
              </div>
              <div className="p-6">
                <div className="space-y-3 mb-6">
                  {charges.map((charge, idx) => (
                    <div key={charge.id} className="flex flex-wrap md:flex-nowrap items-center gap-3 bg-[#121622] p-3 rounded-xl border border-slate-800">
                      <select disabled={isLocked} value={charge.code} onChange={e => updateCharge(charge.id, 'code', e.target.value)} className="w-full md:w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-mono disabled:opacity-60 disabled:bg-slate-800/50">
                        <option value="">Code</option>
                        {ANCILLARY_CODES.map(ac => <option key={ac.code} value={ac.code}>{ac.code}</option>)}
                      </select>
                      <input type="text" disabled={isLocked} value={charge.desc} onChange={e => updateCharge(charge.id, 'desc', e.target.value)} placeholder="Description" className="w-full md:flex-1 bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <select disabled={isLocked} value={charge.type} onChange={e => updateCharge(charge.id, 'type', e.target.value)} className="w-full md:w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50">
                        <option value="Agent">Due Agent</option>
                        <option value="Carrier">Due Carrier</option>
                      </select>
                      <select disabled={isLocked} value={charge.payment} onChange={e => updateCharge(charge.id, 'payment', e.target.value)} className="w-full md:w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50">
                        <option value="Prepaid">Prepaid</option>
                        <option value="Collect">Collect</option>
                      </select>
                      <input type="number" disabled={isLocked} value={charge.amount} onChange={e => updateCharge(charge.id, 'amount', Number(e.target.value))} placeholder="Amount" className="w-full md:w-32 bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 font-bold disabled:opacity-60 disabled:bg-slate-800/50 text-right" />
                      {!isLocked && (
                        <button onClick={() => removeCharge(charge.id)} className="p-2 text-red-500 hover:bg-red-500/20 rounded-lg transition-colors">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                  {charges.length === 0 && (
                    <div className="text-center py-6 text-slate-400 text-sm italic">No ancillary charges added.</div>
                  )}
                </div>

                <div className="bg-slate-800 text-white rounded-xl p-6 grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Due Agent</div>
                    <div className="text-xl font-bold">₹{totalAgent.toFixed(2)}</div>
                  </div>
                  <div>
                    <div className="text-slate-400 text-xs font-bold uppercase mb-1">Due Carrier</div>
                    <div className="text-xl font-bold">₹{totalCarrier.toFixed(2)}</div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-4">
                    <div className="text-emerald-400 text-xs font-bold uppercase mb-1">Total Prepaid</div>
                    <div className="text-xl font-bold">₹{totalPrepaid.toFixed(2)}</div>
                  </div>
                  <div className="border-t md:border-t-0 md:border-l border-slate-700 pt-4 md:pt-0 md:pl-4">
                    <div className="text-amber-400 text-xs font-bold uppercase mb-1">Total Collect</div>
                    <div className="text-xl font-bold">₹{totalCollect.toFixed(2)}</div>
                  </div>
                </div>
              </div>
            </motion.div>

          </div>

          {/* Right Column: 3.3.3 Routing */}
          <div className="lg:col-span-4 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }} className="bg-slate-900/50 backdrop-blur-md rounded-2xl border border-slate-800 overflow-hidden sticky top-28">
              <div className="bg-[#121622]/80 px-6 py-4 border-b border-slate-800 flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-slate-400" />
                <h2 className="text-lg font-bold text-white">Routing</h2>
              </div>
              <div className="p-6 space-y-5">
                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center">
                    <PlaneTakeoff className="w-4 h-4 mr-1 text-slate-400" /> Airport of Departure
                  </label>
                  <input type="text" disabled={isLocked} value={departure} onChange={e => setDeparture(e.target.value)} placeholder="e.g. MAA-CHENNAI" className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <label className="block text-sm font-semibold text-slate-300">Routing Legs</label>
                  </div>
                  {routingLegs.map((leg, index) => (
                    <div key={leg.id} className="flex gap-2 items-center">
                      <input type="text" disabled={isLocked} value={leg.to} onChange={e => setRoutingLegs(routingLegs.map(l => l.id === leg.id ? {...l, to: e.target.value} : l))} placeholder="To" className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      <input type="text" disabled={isLocked} value={leg.by} onChange={e => setRoutingLegs(routingLegs.map(l => l.id === leg.id ? {...l, by: e.target.value} : l))} placeholder="By" className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                      {index === routingLegs.length - 1 && !isLocked && (
                         <button onClick={addRoutingLeg} className="p-2 bg-indigo-500/10 text-indigo-400 rounded-lg hover:bg-indigo-500/20 flex-shrink-0"><Plus className="w-4 h-4" /></button>
                      )}
                      {routingLegs.length > 1 && !isLocked && (
                         <button onClick={() => removeRoutingLeg(leg.id)} className="p-2 text-slate-400 hover:bg-slate-800 rounded-lg flex-shrink-0"><Trash2 className="w-4 h-4" /></button>
                      )}
                    </div>
                  ))}
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-300 mb-1.5 flex items-center">
                    <PlaneLanding className="w-4 h-4 mr-1 text-slate-400" /> Airport of Destination
                  </label>
                  <input type="text" disabled={isLocked} value={destination} onChange={e => setDestination(e.target.value)} placeholder="e.g. BDQ-VADODARA" className="w-full bg-[#121622] border border-slate-700 rounded-xl px-4 py-2.5 text-white focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                </div>

                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-800/50">
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Flight No.</label>
                    <input type="text" disabled={isLocked} value={flightNumber} onChange={e => setFlightNumber(e.target.value)} placeholder="e.g. 6E-1234" className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-400 mb-1">Date</label>
                    <input type="date" disabled={isLocked} value={flightDate} onChange={e => setFlightDate(e.target.value)} className="w-full bg-[#121622] border border-slate-700 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 disabled:opacity-60 disabled:bg-slate-800/50" />
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default function AWBCreationPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-indigo-400 font-bold">Loading Form...</div>}>
      <AWBFormContent />
    </Suspense>
  );
}
