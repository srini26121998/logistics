"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { 
  Code2, 
  Terminal, 
  Key, 
  Book, 
  ChevronRight, 
  Copy, 
  CheckCircle2, 
  Play,
  Activity,
  Box,
  Plane
} from "lucide-react";

const ENDPOINTS = [
  {
    id: "auth",
    method: "POST",
    path: "/v1/auth/token",
    title: "Generate API Token",
    description: "Exchange your API key for a short-lived bearer token to authenticate subsequent requests.",
    req: `{\n  "api_key": "sk_live_123456789"\n}`,
    res: `{\n  "token": "ey...",\n  "expires_in": 3600,\n  "type": "Bearer"\n}`
  },
  {
    id: "create-awb",
    method: "POST",
    path: "/v1/awb/create",
    title: "Create Air Waybill",
    description: "Generate a new Air Waybill in the system. Returns the confirmed AWB number and routing details.",
    req: `{\n  "origin": "MAA",\n  "destination": "DEL",\n  "pieces": 10,\n  "weight": 250.5,\n  "commodity": "General Cargo"\n}`,
    res: `{\n  "awb_number": "312-66761752",\n  "status": "Confirmed",\n  "routing": ["MAA", "DEL"]\n}`
  },
  {
    id: "track",
    method: "GET",
    path: "/v1/track/{awb}",
    title: "Track Shipment",
    description: "Get real-time tracking events and current status for a specific Air Waybill.",
    req: null,
    res: `{\n  "awb": "312-66761752",\n  "status": "In Transit",\n  "events": [\n    {\n      "code": "RCS",\n      "location": "MAA",\n      "time": "2026-06-05T08:00:00Z"\n    }\n  ]\n}`
  }
];

export default function OperationsAPIDocs() {
  const [activeEndpoint, setActiveEndpoint] = useState(ENDPOINTS[0]);
  const [copied, setCopied] = useState<string | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const [testResult, setTestResult] = useState<string | null>(null);

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopied(type);
    setTimeout(() => setCopied(null), 2000);
  };

  const handleRunTest = () => {
    setIsRunning(true);
    setTestResult(null);
    setTimeout(() => {
      setIsRunning(false);
      setTestResult(activeEndpoint.res);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-700 font-sans flex flex-col selection:bg-indigo-500/30">
      {/* Header */}
      <header className="border-b border-blue-200 bg-slate-50/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <Terminal className="w-5 h-5 text-slate-900" />
            </div>
            <h1 className="text-xl font-bold text-slate-900 tracking-tight">Operations API</h1>
            <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 ml-2">
              v1.0 Live
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
              <Book className="w-4 h-4" /> Documentation
            </button>
            <button className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors flex items-center gap-2">
              <Key className="w-4 h-4" /> API Keys
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full flex flex-col md:flex-row overflow-hidden">
        {/* Sidebar Navigation */}
        <aside className="w-full md:w-64 border-r border-blue-200 bg-white overflow-y-auto">
          <div className="p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 px-2">Endpoints</div>
            <nav className="space-y-1">
              {ENDPOINTS.map((endpoint) => (
                <button
                  key={endpoint.id}
                  onClick={() => {
                    setActiveEndpoint(endpoint);
                    setTestResult(null);
                  }}
                  className={`w-full flex flex-col items-start px-3 py-3 rounded-xl transition-all ${
                    activeEndpoint.id === endpoint.id 
                      ? "bg-indigo-500/10 border border-indigo-500/30 text-indigo-600" 
                      : "hover:bg-slate-100/50 text-slate-600 border border-transparent"
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1 w-full">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded uppercase ${
                      endpoint.method === 'GET' ? 'bg-emerald-500/20 text-emerald-400' :
                      endpoint.method === 'POST' ? 'bg-blue-500/20 text-blue-400' :
                      'bg-amber-500/20 text-amber-400'
                    }`}>
                      {endpoint.method}
                    </span>
                    <span className="text-sm font-medium truncate">{endpoint.title}</span>
                  </div>
                  <div className="text-xs font-mono truncate w-full text-left opacity-60">
                    {endpoint.path}
                  </div>
                </button>
              ))}
            </nav>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 flex flex-col lg:flex-row gap-10">
          
          {/* Documentation Details */}
          <div className="flex-1 space-y-8">
            <motion.div
              key={activeEndpoint.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <span className={`text-sm font-bold px-2.5 py-1 rounded-md uppercase ${
                  activeEndpoint.method === 'GET' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                  activeEndpoint.method === 'POST' ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20' :
                  'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                }`}>
                  {activeEndpoint.method}
                </span>
                <code className="text-lg text-slate-900 font-mono">{activeEndpoint.path}</code>
              </div>
              
              <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-3">
                {activeEndpoint.title}
              </h2>
              
              <p className="text-slate-600 text-lg max-w-2xl leading-relaxed">
                {activeEndpoint.description}
              </p>

              <hr className="my-8 border-blue-200" />

              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-900 mb-4">Parameters</h3>
                  {activeEndpoint.req ? (
                    <div className="bg-white border border-blue-200 rounded-xl overflow-hidden">
                      <table className="w-full text-left text-sm">
                        <thead className="bg-slate-100 border-b border-blue-200 text-slate-700">
                          <tr>
                            <th className="px-4 py-3 font-semibold">Name</th>
                            <th className="px-4 py-3 font-semibold">Type</th>
                            <th className="px-4 py-3 font-semibold">Description</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800">
                          {activeEndpoint.id === 'auth' && (
                            <tr>
                              <td className="px-4 py-3 font-mono text-indigo-600">api_key</td>
                              <td className="px-4 py-3 font-mono text-slate-500">string</td>
                              <td className="px-4 py-3 text-slate-600">Your secret API key found in the dashboard.</td>
                            </tr>
                          )}
                          {activeEndpoint.id === 'create-awb' && (
                            <>
                              <tr>
                                <td className="px-4 py-3 font-mono text-indigo-600">origin</td>
                                <td className="px-4 py-3 font-mono text-slate-500">string</td>
                                <td className="px-4 py-3 text-slate-600">3-letter IATA airport code.</td>
                              </tr>
                              <tr>
                                <td className="px-4 py-3 font-mono text-indigo-600">pieces</td>
                                <td className="px-4 py-3 font-mono text-slate-500">integer</td>
                                <td className="px-4 py-3 text-slate-600">Total number of packages.</td>
                              </tr>
                            </>
                          )}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="text-slate-500 italic">No request body parameters required.</div>
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Interactive Request/Response Panel */}
          <div className="w-full lg:w-[450px] space-y-6">
            <div className="bg-slate-100 rounded-2xl border border-blue-200 shadow-2xl overflow-hidden flex flex-col">
              
              {/* Panel Header */}
              <div className="bg-slate-200 px-4 py-3 border-b border-blue-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-slate-600" />
                  <span className="text-sm font-medium text-slate-700">Request Demo</span>
                </div>
                <button 
                  onClick={handleRunTest}
                  disabled={isRunning}
                  className="flex items-center gap-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-slate-900 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                >
                  {isRunning ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Play className="w-3.5 h-3.5" />}
                  {isRunning ? 'Sending...' : 'Send Request'}
                </button>
              </div>

              {/* Request Body Area */}
              <div className="p-4 bg-slate-100 border-b border-blue-200">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Payload</span>
                  {activeEndpoint.req && (
                    <button onClick={() => handleCopy(activeEndpoint.req!, 'req')} className="text-slate-500 hover:text-slate-700">
                      {copied === 'req' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                {activeEndpoint.req ? (
                  <pre className="font-mono text-sm text-indigo-600 overflow-x-auto p-3 bg-white rounded-xl border border-blue-200/80">
                    <code>{activeEndpoint.req}</code>
                  </pre>
                ) : (
                  <div className="text-sm text-slate-600 italic py-2">Empty payload</div>
                )}
              </div>

              {/* Response Area */}
              <div className="p-4 bg-white flex-1 min-h-[250px]">
                <div className="flex justify-between items-center mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Response</span>
                    {testResult && (
                      <span className="text-[10px] bg-emerald-500/20 text-emerald-400 px-1.5 py-0.5 rounded font-bold">200 OK</span>
                    )}
                  </div>
                  {testResult && (
                    <button onClick={() => handleCopy(testResult, 'res')} className="text-slate-500 hover:text-slate-700">
                      {copied === 'res' ? <CheckCircle2 className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  )}
                </div>
                
                {isRunning ? (
                  <div className="flex flex-col items-center justify-center h-[150px] text-slate-500">
                    <Activity className="w-6 h-6 animate-spin mb-2 text-indigo-500" />
                    <span className="text-sm animate-pulse">Awaiting response...</span>
                  </div>
                ) : testResult ? (
                  <pre className="font-mono text-sm text-emerald-600 overflow-x-auto p-3 bg-slate-50 rounded-xl border border-blue-200/80">
                    <code>{testResult}</code>
                  </pre>
                ) : (
                  <div className="flex flex-col items-center justify-center h-[150px] text-slate-600 border border-dashed border-blue-200 rounded-xl">
                    <span className="text-sm">Click Send Request to view response</span>
                  </div>
                )}
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
