"use client";

import React from "react";
import { motion } from "framer-motion";
import { MONTHLY_REVENUE, ROUTE_PERFORMANCE, CARRIER_STATS, formatINR } from "@/data/mockData";
import { BarChart3, LineChart, PieChart, TrendingUp, Download, Calendar } from "lucide-react";

export default function AnalyticsDashboard() {
  const [timeRange, setTimeRange] = React.useState('Last 6 Months');
  
  const displayRevenue = React.useMemo(() => {
    if (timeRange === 'Last 7 Days') {
      return [
        { month: 'Mon', revenue: 45000, shipments: 12 },
        { month: 'Tue', revenue: 52000, shipments: 14 },
        { month: 'Wed', revenue: 48000, shipments: 13 },
        { month: 'Thu', revenue: 61000, shipments: 18 },
        { month: 'Fri', revenue: 59000, shipments: 15 },
        { month: 'Sat', revenue: 32000, shipments: 8 },
        { month: 'Sun', revenue: 28000, shipments: 7 },
      ];
    } else if (timeRange === 'Last Month') {
      return [
        { month: 'Week 1', revenue: 610000, shipments: 105 },
        { month: 'Week 2', revenue: 580000, shipments: 98 },
        { month: 'Week 3', revenue: 640000, shipments: 112 },
        { month: 'Week 4', revenue: 620000, shipments: 95 },
      ];
    }
    return MONTHLY_REVENUE;
  }, [timeRange]);

  // Max values for relative bar chart heights
  const maxRevenue = Math.max(...displayRevenue.map(m => m.revenue));
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <BarChart3 className="w-6 h-6 text-fuchsia-500" />
            Revenue & Performance Analytics
          </h1>
          <p className="text-sm text-slate-600 mt-1">Key metrics and insights for logistics operations.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative flex items-center bg-white border border-blue-200 rounded-lg hover:border-blue-200 transition-colors">
            <Calendar className="w-4 h-4 text-slate-500 absolute left-3 pointer-events-none" />
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="pl-9 pr-4 py-2 bg-transparent text-sm text-slate-700 appearance-none focus:outline-none cursor-pointer w-full hover:text-slate-900"
            >
              <option className="bg-white text-slate-700" value="Last 7 Days">Last 7 Days</option>
              <option className="bg-white text-slate-700" value="Last Month">Last Month</option>
              <option className="bg-white text-slate-700" value="Last 6 Months">Last 6 Months</option>
            </select>
          </div>
          <button 
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-900 rounded-lg text-sm font-medium transition-colors border border-blue-200"
          >
            <Download className="w-4 h-4" /> Export PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Revenue Chart */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="lg:col-span-2 bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6"
        >
          <div className="flex justify-between items-center mb-8">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Monthly Revenue</h2>
              <p className="text-xs text-slate-600">Total gross revenue across all modes</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-emerald-400">{formatINR(displayRevenue.reduce((a, b) => a + b.revenue, 0))}</div>
              <p className="text-xs text-emerald-500/80 flex items-center justify-end gap-1">
                <TrendingUp className="w-3 h-3" /> +14.2% {timeRange === 'Last 6 Months' ? 'YoY' : 'vs Prev'}
              </p>
            </div>
          </div>

          <div className="h-[250px] flex items-end justify-between gap-2 sm:gap-4 mt-8 pt-4 border-b border-blue-200 relative pb-6">
            {/* Y-axis guidelines */}
            <div className="absolute inset-0 pb-6 flex flex-col justify-between pointer-events-none z-0">
              {[1, 0.75, 0.5, 0.25, 0].map((tick) => (
                <div key={tick} className="flex items-center w-full">
                  <span className="text-[10px] text-slate-600 w-12">
                    {tick > 0 
                      ? maxRevenue >= 1000000 
                        ? `${(maxRevenue * tick / 1000000).toFixed(1)}M`
                        : `${(maxRevenue * tick / 1000).toFixed(0)}K`
                      : '0'}
                  </span>
                  <div className="h-px bg-slate-100 flex-1 border-dashed border-blue-200" />
                </div>
              ))}
            </div>

            {/* Bars */}
            {displayRevenue.map((data, idx) => (
              <div key={data.month} className="flex flex-col justify-end items-center flex-1 h-full z-10 group relative">
                {/* Tooltip */}
                <div className="opacity-0 group-hover:opacity-100 absolute -top-8 bg-white border border-blue-200 text-slate-900 text-xs px-2 py-1 rounded transition-opacity whitespace-nowrap pointer-events-none z-20">
                  {formatINR(data.revenue)}
                  <div className="text-slate-600 text-[10px]">{data.shipments} shipments</div>
                </div>
                
                {/* The Bar */}
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${(data.revenue / maxRevenue) * 100}%` }}
                  transition={{ delay: 0.2 + (idx * 0.1), duration: 0.8, type: "spring" }}
                  className="w-full max-w-[40px] bg-gradient-to-t from-fuchsia-600 to-indigo-500 rounded-t-sm"
                />
                
                <span className="text-xs text-slate-600 absolute -bottom-6">{data.month}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Carrier Performance */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl p-6"
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-slate-900">Carrier Share & OTP</h2>
            <p className="text-xs text-slate-600">On-time performance by carrier</p>
          </div>

          <div className="space-y-5">
            {CARRIER_STATS.map((stat, idx) => (
              <div key={stat.carrier} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="font-medium text-slate-900">{stat.carrier}</span>
                  <span className="text-fuchsia-400 font-mono">{stat.share}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: `${stat.share}%` }}
                    transition={{ delay: 0.5 + (idx * 0.1), duration: 0.8 }}
                    className="bg-fuchsia-500 h-full rounded-full"
                  />
                </div>
                <div className="flex justify-between text-[10px] text-slate-500">
                  <span>Rating: {stat.rating} ★</span>
                  <span className={stat.onTime > 95 ? "text-emerald-500" : "text-amber-500"}>
                    OTP: {stat.onTime}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Route Performance Table */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-3 bg-white/80 backdrop-blur-md border border-blue-200 rounded-2xl overflow-hidden"
        >
          <div className="p-6 border-b border-blue-200 flex justify-between items-center">
            <div>
              <h2 className="text-lg font-semibold text-slate-900">Top Routes Performance</h2>
              <p className="text-xs text-slate-600">Profitability and efficiency by sector</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-white border-b border-blue-200">
                <tr>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Sector / Route</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Shipments</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Revenue</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">Avg Transit</th>
                  <th className="px-6 py-4 text-xs font-semibold text-slate-600 uppercase tracking-wider">OTP Score</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {ROUTE_PERFORMANCE.map((route, idx) => (
                  <motion.tr 
                    key={route.route}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + (idx * 0.1) }}
                    className="hover:bg-slate-100/30 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap font-medium text-slate-900">{route.route}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">{route.shipments}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-emerald-400 font-mono">{formatINR(route.revenue)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-slate-700">{route.avgDelivery}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 rounded text-xs font-medium ${route.onTime > 95 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-amber-500/10 text-amber-400'}`}>
                        {route.onTime}%
                      </span>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

      </div>
    </div>
  );
}
