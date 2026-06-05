"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { SHIPMENTS, getStatusColor } from "@/data/mockData";
import StatusBadge from "@/components/ui/StatusBadge";
import { Package, ArrowLeft, MapPin, Calendar, Truck, Plane, User, Phone, CheckCircle2, AlertCircle, FileText } from "lucide-react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";
import { toast } from "sonner";

const STAGES = [
  "Booked",
  "LR Generated",
  "Picked Up",
  "Inbound Received",
  "X-Ray Cleared",
  "Manifested/Outbound",
  "Received at Destination",
  "Out for Delivery",
  "Delivered"
];

export default function OpsShipmentDetailPage() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  // Find shipment or default to first for demo
  const shipment = SHIPMENTS.find(s => s.awb === id || s.lrNumber === id) || SHIPMENTS[0];

  const [currentStatus, setCurrentStatus] = useState(shipment.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusUpdate = (newStatus: string) => {
    setIsUpdating(true);
    setTimeout(() => {
      // Mutate global object directly to ensure it updates across the session
      shipment.status = newStatus as any;
      
      if (!shipment.events) {
        shipment.events = [];
      }
      
      shipment.events.unshift({
        id: Date.now(),
        timestamp: new Date().toISOString(),
        location: shipment.origin + ' Hub',
        status: newStatus,
        staff: 'OPS-ADMIN'
      });

      setCurrentStatus(newStatus);
      setIsUpdating(false);
      toast.success(`Shipment status updated to ${newStatus}`);
    }, 600);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <button onClick={() => router.back()} className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            Shipment {shipment.awb}
            <StatusBadge status={currentStatus} />
          </h1>
          <p className="text-sm text-slate-400 mt-1">LR Number: {shipment.lrNumber} • Booked: {shipment.bookedDate}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Main Info Column */}
        <div className="lg:col-span-2 space-y-6">

          {/* Route Card */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Route Information</h2>

            <div className="flex items-center justify-between">
              <div className="text-center w-24">
                <div className="text-3xl font-black text-white">{shipment.origin}</div>
              </div>
              <div className="flex-1 flex items-center justify-center relative px-2">
                <div className="w-full border-t-2 border-dashed border-slate-700"></div>
                <div className="absolute bg-[#121622] px-2 text-indigo-500">
                  {shipment.mode === 'Air' ? <Plane className="w-6 h-6" /> : <Truck className="w-6 h-6" />}
                </div>
              </div>
              <div className="text-center w-24">
                <div className="text-3xl font-black text-white">{shipment.destination}</div>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-6 border-t border-slate-800">
              <div>
                <div className="text-xs text-slate-500 mb-1">Carrier</div>
                <div className="text-sm font-semibold text-slate-200">{shipment.carrier}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Flight/Vehicle</div>
                <div className="text-sm font-semibold text-slate-200">{shipment.flight || 'TBA'}</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Total Pieces</div>
                <div className="text-sm font-semibold text-slate-200">{shipment.pieces} NOP</div>
              </div>
              <div>
                <div className="text-xs text-slate-500 mb-1">Gross Weight</div>
                <div className="text-sm font-semibold text-slate-200">{shipment.weight}</div>
              </div>
            </div>
          </div>

          {/* Update Status Actions */}
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-6">Manual Status Update</h2>

            <div className="flex flex-wrap gap-3">
              {STAGES.map(stage => (
                <button
                  key={stage}
                  onClick={() => handleStatusUpdate(stage)}
                  disabled={isUpdating || currentStatus === stage}
                  className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${currentStatus === stage
                    ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)]"
                    : "bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700"
                    } disabled:opacity-50 disabled:cursor-not-allowed`}
                >
                  {isUpdating && currentStatus === stage ? "Updating..." : stage}
                </button>
              ))}
              <div className="w-px bg-slate-800 mx-2"></div>
              <button
                onClick={() => handleStatusUpdate('Exception')}
                className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 rounded-xl text-sm font-medium transition-colors flex items-center gap-2"
              >
                <AlertCircle className="w-4 h-4" /> Mark Exception
              </button>
            </div>
            
            {shipment.events && shipment.events.length > 0 && (
              <div className="mt-8 border-t border-slate-800 pt-6">
                <h3 className="text-sm font-medium text-slate-400 mb-4">Recent Updates</h3>
                <div className="space-y-3">
                  {shipment.events.slice(0, 3).map((ev: any) => (
                    <div key={ev.id} className="flex justify-between items-center bg-slate-800/30 p-3 rounded-lg border border-slate-700/50">
                      <div>
                        <div className="text-sm font-medium text-slate-200">{ev.status}</div>
                        <div className="text-xs text-slate-500">{new Date(ev.timestamp).toLocaleString()} • {ev.location}</div>
                      </div>
                      <div className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">{ev.staff}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <div className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Parties</h2>

            <div className="space-y-6">
              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Shipper
                </div>
                <div className="bg-[#121622] border border-slate-800 rounded-lg p-3">
                  <div className="font-semibold text-slate-200">{shipment.shipper}</div>
                </div>
              </div>

              <div>
                <div className="text-xs text-slate-500 uppercase tracking-wider mb-2 flex items-center gap-2">
                  <User className="w-3.5 h-3.5" /> Consignee
                </div>
                <div className="bg-[#121622] border border-slate-800 rounded-lg p-3">
                  <div className="font-semibold text-slate-200">{shipment.consignee}</div>
                </div>
              </div>
            </div>
          </div>

          <Link href={`/track/${shipment.awb}`} target="_blank" className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-sm font-medium transition-colors border border-slate-700">
            View Public Tracking Page
          </Link>
        </div>

      </div>
    </div>
  );
}
