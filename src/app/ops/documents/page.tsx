"use client";

import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { UploadCloud, File, FileText, CheckCircle2, X, AlertCircle, FileCheck, Search, Download, Eye } from "lucide-react";
import { toast } from "sonner";

type DocUpload = {
  id: string;
  name: string;
  size: string;
  type: string;
  status: 'uploading' | 'completed' | 'failed';
  progress: number;
};

type RecentFile = {
  id: string;
  name: string;
  date: string;
  size: string;
  type: string;
};

export default function DocumentUploadPage() {
  const [dragActive, setDragActive] = useState(false);
  const [uploads, setUploads] = useState<DocUpload[]>([]);
  const [recentFiles, setRecentFiles] = useState<RecentFile[]>([
    { id: 'f1', name: "Commercial_Invoice_INV2026.pdf", date: "Today", size: "2.4 MB", type: "pdf" },
    { id: 'f2', name: "Packing_List_312-66761752.xlsx", date: "Yesterday", size: "156 KB", type: "xlsx" },
    { id: 'f3', name: "KYC_Docs_AcmeCorp.pdf", date: "Jun 03, 2026", size: "5.1 MB", type: "pdf" },
    { id: 'f4', name: "Customs_Declaration_DXB.doc", date: "Jun 02, 2026", size: "890 KB", type: "doc" },
    { id: 'f5', name: "Air_Waybill_Copy_AI882.pdf", date: "May 28, 2026", size: "1.2 MB", type: "pdf" },
  ]);
  const [selectedFile, setSelectedFile] = useState<RecentFile | null>(null);
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
        
        toast.success(`${file.name} uploaded successfully`);

        setTimeout(() => {
          setRecentFiles(prev => [{
            id,
            name: newUpload.name,
            date: "Just now",
            size: newUpload.size,
            type: newUpload.type
          }, ...prev]);
          
          setUploads(prev => prev.filter(u => u.id !== id));
        }, 1500);

      } else {
        setUploads(prev => prev.map(u => u.id === id ? { ...u, progress } : u));
      }
    }, 400);
  };

  const handleDeleteRecentFile = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setRecentFiles(prev => prev.filter(f => f.id !== id));
    toast.success("File deleted successfully");
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
              <AnimatePresence>
                {recentFiles.map((file) => (
                  <motion.div 
                    key={file.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="group p-3 hover:bg-[#121622] rounded-xl border border-transparent hover:border-slate-800 transition-colors cursor-pointer flex items-center gap-3"
                    onClick={() => setSelectedFile(file)}
                  >
                    <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-slate-400 group-hover:text-indigo-400 group-hover:bg-indigo-500/10 transition-colors shrink-0">
                      <File className="w-4 h-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="text-sm font-medium text-slate-200 truncate group-hover:text-white transition-colors">{file.name}</div>
                      <div className="text-[10px] text-slate-500 mt-0.5">{file.date} • {file.size}</div>
                    </div>
                    <button 
                      onClick={(e) => handleDeleteRecentFile(file.id, e)}
                      className="opacity-0 group-hover:opacity-100 p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-all"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </motion.div>
                ))}
                {recentFiles.length === 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                    className="text-center py-8 text-slate-500 text-sm"
                  >
                    No recent files found.
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

      </div>

      {/* Document Preview Modal */}
      <AnimatePresence>
        {selectedFile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-[#0A0A0B]/80 backdrop-blur-md"
            onClick={() => setSelectedFile(null)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden"
            >
              <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-800 bg-slate-900/50">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{selectedFile.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-slate-800 text-slate-300 uppercase">
                        {selectedFile.type}
                      </span>
                      <span className="text-xs text-slate-500">{selectedFile.date} • {selectedFile.size}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button className="flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition-colors">
                    <Download className="w-4 h-4" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  <div className="w-px h-6 bg-slate-800 mx-2 hidden sm:block"></div>
                  <button 
                    onClick={() => setSelectedFile(null)}
                    className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>
              
              <div className="flex-1 bg-[#0A0A0B] p-6 sm:p-10 overflow-y-auto flex flex-col items-center justify-center min-h-[400px] sm:min-h-[600px] relative">
                {/* Decorative Elements */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                <div className="text-center max-w-lg relative z-10">
                  <motion.div 
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="w-28 h-28 bg-slate-800/80 backdrop-blur-sm border border-slate-700 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-xl"
                  >
                    <Eye className="w-12 h-12 text-slate-400" />
                  </motion.div>
                  
                  <motion.div
                    initial={{ y: 10, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <h4 className="text-2xl font-bold text-white mb-3">Document Preview Mode</h4>
                    <p className="text-slate-400 text-sm leading-relaxed mb-8">
                      You are viewing a secure preview of <strong className="text-slate-200 font-medium">{selectedFile.name}</strong>. 
                      In a fully integrated production environment, this area renders the actual document content (PDF, image, etc.) directly in the browser.
                    </p>
                    
                    <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
                        <div className="text-xs text-slate-500 mb-1">Status</div>
                        <div className="text-sm text-emerald-400 font-medium flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4" /> Verified
                        </div>
                      </div>
                      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-left">
                        <div className="text-xs text-slate-500 mb-1">Security</div>
                        <div className="text-sm text-white font-medium">End-to-End Encrypted</div>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
