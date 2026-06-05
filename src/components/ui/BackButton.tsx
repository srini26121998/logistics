"use client";

import { useRouter, usePathname } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;
  
  // Don't show back button on the main landing page
  if (pathname === "/") return null;

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.8 }}
        onClick={() => router.back()}
        className="fixed bottom-6 right-6 md:bottom-8 md:right-8 z-[9999] bg-slate-900/90 backdrop-blur-md text-white p-3 md:p-4 rounded-full shadow-[0_4px_20px_rgba(0,0,0,0.4)] hover:bg-slate-800 hover:shadow-[0_4px_25px_rgba(0,0,0,0.6)] transition-all flex items-center justify-center group border border-slate-700/50 hover:border-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        title="Go Back"
        aria-label="Go Back"
      >
        <ArrowLeft className="w-5 h-5 md:w-6 md:h-6 group-hover:-translate-x-1 transition-transform text-slate-300 group-hover:text-white" />
      </motion.button>
    </AnimatePresence>
  );
}
