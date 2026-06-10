"use client";
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GPS_DEVICES, GPS_MILESTONES, GPS_ALERTS, BOOKINGS, GPSDevice } from "@/data/mockData";
import { MapPin, Wifi, WifiOff, Clock, Navigation, Gauge, Truck, AlertTriangle, Bell, CheckCircle, ArrowRight, Zap, Shield, Route } from "lucide-react";
import { toast } from "sonner";

const CITIES: Record<string, { name: string; x: number; y: number }> = {
  'DEL': { name: 'Delhi', x: 58, y: 18 }, 'BOM': { name: 'Mumbai', x: 30, y: 52 },
  'BLR': { name: 'Bengaluru', x: 42, y: 75 }, 'MAA': { name: 'Chennai', x: 55, y: 72 },
  'HYD': { name: 'Hyderabad', x: 48, y: 56 }, 'PNQ': { name: 'Pune', x: 34, y: 52 },
  'CCU': { name: 'Kolkata', x: 78, y: 32 }, 'GOA': { name: 'Goa', x: 32, y: 62 },
};

type TabType = 'map' | 'milestones' | 'alerts';

const MILESTONE_ICONS: Record<string, { icon: React.ElementType; color: string }> = {
  'Pickup Confirmed': { icon: Truck, color: 'text-blue-500 bg-blue-500/10 border-blue-500/20' },
  'In Transit': { icon: Navigation, color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20' },
  'Near Destination': { icon: MapPin, color: 'text-amber-500 bg-amber-500/10 border-amber-500/20' },
  'Delivered': { icon: CheckCircle, color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' },
  'Delay Alert': { icon: AlertTriangle, color: 'text-red-500 bg-red-500/10 border-red-500/20' },
  'Route Deviation': { icon: Route, color: 'text-orange-500 bg-orange-500/10 border-orange-500/20' },
};

const ALERT_SEVERITY: Record<string, string> = {
  'Low': 'bg-slate-100 text-slate-600 border-slate-200',
  'Medium': 'bg-amber-50 text-amber-700 border-amber-200',
  'High': 'bg-red-50 text-red-700 border-red-200',
};

export default function GPSTrackingPage() {
  const [devices, setDevices] = useState<GPSDevice[]>(GPS_DEVICES);
  const [selectedDevice, setSelectedDevice] = useState<GPSDevice | null>(null);
  const [simTick, setSimTick] = useState(0);
  const [activeTab, setActiveTab] = useState<TabType>('map');

  useEffect(() => {
    const interval = setInterval(() => {
      setSimTick(t => t + 1);
      setDevices(prev => prev.map(d => {
        if (d.status === 'Online') {
          return { ...d, lat: d.lat + (Math.random() - 0.5) * 0.01, lng: d.lng + (Math.random() - 0.5) * 0.01, speed: 55 + Math.floor(Math.random() * 30), lastPing: new Date().toISOString() };
        }
        return d;
      }));
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const statusIcon = (s: string) => s === 'Online' ? <Wifi className="w-4 h-4 text-emerald-500" /> : s === 'Idle' ? <Clock className="w-4 h-4 text-amber-500" /> : <WifiOff className="w-4 h-4 text-red-500" />;

  const selectedBooking = selectedDevice ? BOOKINGS.find(b => b.id === selectedDevice.bookingId) : null;
  const selectedMilestones = selectedBooking ? GPS_MILESTONES.filter(m => m.bookingId === selectedBooking.id) : GPS_MILESTONES;
  const selectedAlerts = selectedDevice ? GPS_ALERTS.filter(a => a.deviceId === selectedDevice.deviceId) : GPS_ALERTS;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <motion.div animate={{ rotateY: [0, 360] }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} style={{ perspective: 1000, transformStyle: "preserve-3d" }} className="inline-flex drop-shadow-lg"><MapPin className="w-6 h-6 text-indigo-500" /></motion.div>
            GPS Tracking — Road Shipments
          </h1>
          <p className="text-sm text-slate-500 mt-1">Real-time vehicle tracking, route monitoring, milestones & alerts.</p>
        </div>
        {/* Tab Switcher */}
        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-blue-200">
          {(['map', 'milestones', 'alerts'] as TabType[]).map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-1.5 rounded-lg text-xs font-medium transition-all capitalize ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm border border-blue-200' : 'text-slate-500 hover:text-slate-700'}`}>
              {tab === 'alerts' ? `Alerts (${GPS_ALERTS.length})` : tab}
            </button>
          ))}
        </div>
      </div>

      {activeTab === 'map' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Map */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
            <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
              <h2 className="text-sm font-semibold text-slate-700">Live Map — India</h2>
              <div className="flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /><span className="text-xs text-slate-500">Live</span></div>
            </div>
            <div className="relative bg-gradient-to-br from-slate-50 to-slate-100 h-[500px] overflow-hidden">
              <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-10" preserveAspectRatio="xMidYMid meet">
                <path d="M45,5 L65,5 L75,15 L80,25 L85,35 L80,45 L75,55 L70,65 L65,75 L55,85 L45,90 L35,85 L25,75 L20,65 L25,55 L30,45 L25,35 L30,25 L35,15 Z" fill="currentColor" className="text-indigo-500" />
              </svg>
              {Object.entries(CITIES).map(([code, city]) => (
                <div key={code} className="absolute transform -translate-x-1/2 -translate-y-1/2" style={{ left: `${city.x}%`, top: `${city.y}%` }}>
                  <div className="w-3 h-3 rounded-full bg-slate-400/50 border border-slate-400" />
                  <span className="absolute top-4 left-1/2 -translate-x-1/2 text-[10px] text-slate-500 font-medium whitespace-nowrap">{code}</span>
                </div>
              ))}
              {devices.map(d => {
                const booking = BOOKINGS.find(b => b.id === d.bookingId);
                const originCity = booking ? CITIES[booking.origin] : null;
                const destCity = booking ? CITIES[booking.destination] : null;
                const progress = d.status === 'Online' ? 0.3 + (simTick % 20) * 0.02 : d.status === 'Offline' ? 1 : 0.5;
                const x = originCity && destCity ? originCity.x + (destCity.x - originCity.x) * Math.min(progress, 1) : 50;
                const y = originCity && destCity ? originCity.y + (destCity.y - originCity.y) * Math.min(progress, 1) : 50;
                return (
                  <React.Fragment key={d.id}>
                    {originCity && destCity && (
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
                        {/* Planned route (dashed) */}
                        <line x1={originCity.x} y1={originCity.y} x2={destCity.x} y2={destCity.y} stroke="#94a3b8" strokeWidth="0.3" strokeDasharray="1,1" />
                        {/* Actual route (solid) */}
                        <line x1={originCity.x} y1={originCity.y} x2={x} y2={y} stroke={d.status === 'Online' ? '#6366f1' : '#94a3b8'} strokeWidth="0.5" />
                      </svg>
                    )}
                    <motion.div animate={{ x: [0, -2, 2, 0] }} transition={{ duration: 2, repeat: Infinity }} className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" style={{ left: `${x}%`, top: `${y}%`, zIndex: 10 }} onClick={() => setSelectedDevice(d)}>
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center shadow-lg border-2 ${d.status === 'Online' ? 'bg-indigo-600 border-indigo-400' : d.status === 'Idle' ? 'bg-amber-500 border-amber-400' : 'bg-slate-400 border-slate-300'}`}>
                        <Truck className="w-4 h-4 text-white" />
                      </div>
                      {d.status === 'Online' && <div className="absolute -inset-1 rounded-full border-2 border-indigo-400 animate-ping opacity-30" />}
                      <div className="absolute top-9 left-1/2 -translate-x-1/2 bg-white text-slate-900 px-1.5 py-0.5 rounded text-[9px] font-mono whitespace-nowrap shadow-sm border border-slate-200">{d.vehicleNo}</div>
                    </motion.div>
                  </React.Fragment>
                );
              })}
            </div>
            {/* Legend */}
            <div className="p-3 bg-slate-50 border-t border-blue-200 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-slate-400 inline-block" style={{ borderTop: '1px dashed #94a3b8' }} /> Planned Route</span>
              <span className="flex items-center gap-1"><span className="w-3 h-0.5 bg-indigo-500 inline-block" /> Actual Route</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500" /> Online</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-amber-500" /> Idle</span>
              <span className="flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-slate-400" /> Offline</span>
            </div>
          </div>

          {/* Vehicle List + ETA Panel */}
          <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d flex flex-col">
            <div className="p-4 border-b border-blue-200 bg-slate-100/80"><h2 className="text-sm font-semibold text-slate-700">Vehicles ({devices.length})</h2></div>
            <div className="flex-1 overflow-auto custom-scrollbar p-4 space-y-3">
              {devices.map(d => {
                const booking = BOOKINGS.find(b => b.id === d.bookingId);
                return (
                  <div key={d.id} onClick={() => setSelectedDevice(d)} className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedDevice?.id === d.id ? 'border-indigo-500 bg-indigo-500/5' : 'border-slate-200 bg-white hover:border-indigo-300'}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div><div className="font-bold text-slate-900 text-sm">{d.vehicleNo}</div><div className="text-xs text-slate-500 font-mono">{d.deviceId}</div></div>
                      <div className="flex items-center gap-1">{statusIcon(d.status)}<span className={`text-xs font-medium ${d.status === 'Online' ? 'text-emerald-600' : d.status === 'Idle' ? 'text-amber-600' : 'text-red-500'}`}>{d.status}</span></div>
                    </div>
                    {booking && <div className="text-xs text-slate-600 mb-1">{booking.origin} → {booking.destination} | {booking.bookingRef}</div>}
                    <div className="flex items-center gap-4 text-xs text-slate-500">
                      <span className="flex items-center gap-1"><Gauge className="w-3 h-3" />{d.speed} km/h</span>
                      <span className="flex items-center gap-1"><Navigation className="w-3 h-3" />{d.lat.toFixed(4)}, {d.lng.toFixed(4)}</span>
                    </div>
                    <div suppressHydrationWarning className="text-xs text-slate-600 mt-1">Last ping: {new Date(d.lastPing).toLocaleTimeString()}</div>
                  </div>
                );
              })}
            </div>
            {selectedDevice && (
              <div className="p-4 border-t border-blue-200 bg-slate-50 space-y-3">
                <div className="text-xs font-semibold text-slate-700 mb-2">Selected: {selectedDevice.vehicleNo}</div>
                <div className="grid grid-cols-2 gap-2">
                  <div className="bg-white p-2 rounded-lg border border-blue-200 text-center"><div className="text-xs text-slate-500">Speed</div><div className="font-bold text-slate-900">{selectedDevice.speed} km/h</div></div>
                  <div className="bg-white p-2 rounded-lg border border-blue-200 text-center"><div className="text-xs text-slate-500">ETA</div><div className="font-bold text-indigo-600">{selectedDevice.status === 'Online' ? `${Math.floor(2 + Math.random() * 6)}h ${Math.floor(Math.random() * 59)}m` : 'N/A'}</div></div>
                </div>
                {/* Alerts for this vehicle */}
                {selectedAlerts.length > 0 && (
                  <div className="mt-2">
                    <div className="text-xs font-semibold text-slate-600 mb-1">Recent Alerts</div>
                    {selectedAlerts.slice(0, 2).map(a => (
                      <div key={a.id} className={`text-xs p-2 rounded-lg border mb-1 ${ALERT_SEVERITY[a.severity]}`}>
                        <div className="flex items-center gap-1 font-medium"><AlertTriangle className="w-3 h-3" />{a.type}</div>
                        <div className="mt-0.5 opacity-80">{a.message}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Milestones Tab (Section 5.4) */}
      {activeTab === 'milestones' && (
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
          <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><Bell className="w-4 h-4 text-indigo-500" /> Shipment Milestones</h2>
            <span className="text-xs text-slate-500">{selectedMilestones.length} events</span>
          </div>
          <div className="p-6">
            {/* Milestone Reference Table */}
            <div className="mb-6 overflow-auto">
              <table className="w-full text-left text-sm">
                <thead className="border-b-2 border-blue-200 bg-slate-50">
                  <tr>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Milestone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Trigger</th>
                    <th className="px-4 py-3 text-xs font-semibold text-slate-500 uppercase">Notification To</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {[
                    { m: 'Pickup Confirmed', t: 'Vehicle departs origin hub', n: 'Consignor, Ops' },
                    { m: 'In Transit', t: 'Vehicle moving on route', n: 'Ops Dashboard' },
                    { m: 'Near Destination', t: 'Within defined radius of delivery', n: 'Consignee, Ops' },
                    { m: 'Delivered', t: 'GPS confirms arrival + POD captured', n: 'Consignor, Consignee, Ops' },
                    { m: 'Delay Alert', t: 'ETA exceeded by threshold', n: 'Ops, Manager' },
                    { m: 'Route Deviation', t: 'Vehicle off planned route', n: 'Ops, Manager' },
                  ].map(row => {
                    const mi = MILESTONE_ICONS[row.m] || MILESTONE_ICONS['In Transit'];
                    const MIcon = mi.icon;
                    return (
                      <tr key={row.m} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 flex items-center gap-2"><div className={`w-7 h-7 rounded-lg flex items-center justify-center border ${mi.color}`}><MIcon className="w-3.5 h-3.5" /></div><span className="font-medium text-slate-900">{row.m}</span></td>
                        <td className="px-4 py-3 text-slate-600">{row.t}</td>
                        <td className="px-4 py-3 text-slate-600">{row.n}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Live Milestone Timeline */}
            <h3 className="text-sm font-semibold text-slate-700 mb-4">Live Milestone Log</h3>
            <div className="space-y-4">
              {selectedMilestones.map((ms, i) => {
                const mi = MILESTONE_ICONS[ms.milestone] || MILESTONE_ICONS['In Transit'];
                const MIcon = mi.icon;
                return (
                  <motion.div key={ms.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.05 }} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${mi.color}`}><MIcon className="w-4 h-4" /></div>
                      {i < selectedMilestones.length - 1 && <div className="w-0.5 flex-1 bg-slate-200 mt-1" />}
                    </div>
                    <div className="flex-1 pb-4">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-semibold text-slate-900 text-sm">{ms.milestone}</span>
                        <span className="text-xs text-slate-500">• {ms.vehicleNo}</span>
                      </div>
                      <p className="text-xs text-slate-600">{ms.details}</p>
                      <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                        <span>{new Date(ms.timestamp).toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                        <span className="flex items-center gap-1"><Bell className="w-3 h-3" />{ms.notifiedTo.join(', ')}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Alerts Tab */}
      {activeTab === 'alerts' && (
        <div className="bg-white/80 backdrop-blur-xl border border-blue-200/50 shadow-[0_8px_40px_-12px_rgba(56,189,248,0.15)] rounded-2xl overflow-hidden card-3d">
          <div className="p-4 border-b border-blue-200 bg-slate-100/80 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-slate-700 flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-500" /> GPS Alerts — Speed, Idle, Geo-Fence, Route Deviation</h2>
          </div>
          <div className="divide-y divide-slate-100">
            {GPS_ALERTS.map((a, i) => (
              <motion.div key={a.id} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }} className={`p-4 flex items-start gap-4 ${a.severity === 'High' ? 'bg-red-50/30' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center border flex-shrink-0 ${a.severity === 'High' ? 'bg-red-500/10 text-red-500 border-red-500/20' : a.severity === 'Medium' ? 'bg-amber-500/10 text-amber-500 border-amber-500/20' : 'bg-slate-100 text-slate-500 border-slate-200'}`}>
                  {a.type === 'Speed' ? <Gauge className="w-5 h-5" /> : a.type === 'Idle' ? <Clock className="w-5 h-5" /> : a.type === 'Geo-Fence' ? <Shield className="w-5 h-5" /> : <Route className="w-5 h-5" />}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-slate-900 text-sm">{a.type} Alert</span>
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded border ${ALERT_SEVERITY[a.severity]}`}>{a.severity}</span>
                  </div>
                  <p className="text-sm text-slate-600">{a.message}</p>
                  <div className="flex items-center gap-3 mt-1.5 text-xs text-slate-500">
                    <span className="font-mono">{a.vehicleNo}</span>
                    <span>{new Date(a.timestamp).toLocaleString('en-IN', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</span>
                    <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{a.lat.toFixed(4)}, {a.lng.toFixed(4)}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
