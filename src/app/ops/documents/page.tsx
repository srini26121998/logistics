"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, FileText, CheckCircle2, X, AlertCircle, FileCheck, Search } from "lucide-react";

type DocUpload = {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
};

export default function DocumentUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<DocUpload[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const simulateUpload = (file: File) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newUpload: DocUpload = {
      id,
      name: file.name,
      size: (file.size / 1024 / 1024).toFixed(2) + ' MB',
      type: file.name.split('.').pop() || 'unknown',
      status: 'uploading',
      progress: 0
    };
    
    setUploads(prev => [newUpload, ...prev]);

    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 30;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        setUploads(prev => prev.map(u => u.id === id ? { ...u, status: 'completed', progress } : u));
      } else {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress } : u));
      }
    }, 400);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      Array.from(e.dataTransfer.files).forEach(simulateUpload);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      Array.from(e.target.files).forEach(simulateUpload);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <FileCheck className="w-6 h-6 text-indigo-500" />
          Document Center
        </h1>
        <p className="text-sm text-slate-400 mt-1">Upload and manage commercial invoices, packing lists, and KYC documents.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Upload Area */}
        <div className="lg:col-span-2 space-y-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6"
          >
            <h2 className="text-lg font-semibold text-white mb-4">Upload Documents</h2>
            
            <form 
              onDragEnter={handleDrag} 
              onDragLeave={handleDrag} 
              onDragOver={handleDrag} 
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all flex flex-col items-center justify-center min-h-[300px] ${
                dragActive 
                  ? "border-indigo-500 bg-indigo-500/10 scale-[1.02]" 
                  : "border-slate-700 bg-[#0A0A0B]/50 hover:border-slate-600 hover:bg-[#121622]"
              }`}
            >
              <input 
                ref={inputRef} 
                type="file" 
                multiple 
                className="hidden" 
                onChange={handleChange} 
                accept=".pdf,.jpg,.jpeg,.png,.doc,.docx,.xls,.xlsx"
              />
              
              <div className="w-20 h-20 bg-indigo-500/10 text-indigo-400 rounded-full flex items-center justify-center mb-6">
                <UploadCloud className="w-10 h-10" />
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Drag & Drop files here</h3>
              <p className="text-sm text-slate-400 mb-6">Support for PDF, JPG, PNG, DOC, XLS up to 50MB</p>
              
              <button 
                type="button" 
                onClick={() => inputRef.current?.click()}
                className="px-6 py-3 bg-slate-800 hover:bg-slate-700 text-white rounded-xl font-medium transition-colors border border-slate-700"
              >
                Browse Files
              </button>
            </form>
          </motion.div>

          {/* Upload Queue */}
          {uploads.length > 0 && (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl p-6"
            >
              <h2 className="text-lg font-semibold text-white mb-4">Upload Queue</h2>
              <div className="space-y-4">
                <AnimatePresence>
                  {uploads.map(upload => (
                    <motion.div 
                      key={upload.id}
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="bg-[#121622] border border-slate-800 rounded-xl p-4 overflow-hidden relative"
                    >
                      {/* Progress Bar Background */}
                      {upload.status === 'uploading' && (
                        <div 
                          className="absolute bottom-0 left-0 h-1 bg-indigo-500 transition-all duration-300 ease-linear"
                          style={{ width: `${upload.progress}%` }}
                        />
                      )}
                      
                      <div className="flex items-center gap-4 relative z-10">
                        <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-medium text-white truncate text-sm">{upload.name}</div>
                          <div className="text-xs text-slate-500 flex items-center gap-2 mt-0.5">
                            <span>{upload.size}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                            {upload.status === 'uploading' ? (
                              <span className="text-indigo-400 font-medium">Uploading... {Math.round(upload.progress)}%</span>
                            ) : upload.status === 'completed' ? (
                              <span className="text-emerald-400 font-medium flex items-center gap-1">
                                <CheckCircle2 className="w-3 h-3" /> Completed
                              </span>
                            ) : (
                              <span className="text-rose-400 font-medium">Failed</span>
                            )}
                          </div>
                        </div>
                        <button 
                          onClick={() => setUploads(prev => prev.filter(u => u.id !== upload.id))}
                          className="p-2 hover:bg-slate-800 rounded-lg text-slate-500 transition-colors shrink-0"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}
        </div>

        {/* Recent Documents Sidebar */}
        <div className="lg:col-span-1">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-slate-900/50 backdrop-blur-md border border-slate-800 rounded-2xl h-[calc(100vh-140px)] flex flex-col overflow-hidden"
          >
            <div className="p-4 border-b border-slate-800 bg-slate-900/80">
              <h2 className="text-lg font-semibold text-white">Recent Files</h2>
            </div>
            
            <div className="p-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search files..."
                  className="w-full bg-[#0A0A0B] border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500"
                />
              </div>
            </div>

            <div className="flex-1 overflow-auto p-4 pt-0 custom-scrollbar space-y-2">
              {/* Dummy Recent Files */}
              {[
                { name: "Commercial_Invoice_INV2026.pdf", date: "Today", size: "2.4 MB" },
                { name: "Packing_List_312-66761752.xlsx", date: "Yesterday", size: "156 KB" },
                { name: "KYC_Docs_AcmeCorp.pdf", date: "Jun 03, 2026", size: "5.1 MB" },
                { name: "Customs_Declaration_DXB.doc", date: "Jun 02, 2026", size: "890 KB" },
                { name: "Air_Waybill_Copy_AI882.pdf", date: "May 28, 2026", size: "1.2 MB" },
              ].map((file, i) => (
                <div key={i} className="group p-3 hover:bg-[#121622] rounded-xl border border-transparent hover:border-slate-800 transition-colors cursor-pointer flex items-center gap-3">
                  <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors shrink-0">
                    <File className="w-4 h-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{file.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{file.date} • {file.size}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  );
}
