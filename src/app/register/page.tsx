"use client";

import React, { useState } from "react";
import AuthLayout from "@/components/auth/AuthLayout";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Loader2, User, Building, Phone, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleNext = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(2);
  };

  const handleBack = (e: React.MouseEvent) => {
    e.preventDefault();
    setStep(1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
    setIsSuccess(true);
    
    // Redirect after success
    setTimeout(() => {
      router.push("/ops");
    }, 1500);
  };

  if (isSuccess) {
    return (
      <AuthLayout
        title="Registration Complete"
        subtitle="Your account has been successfully created."
      >
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center justify-center py-12 text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 20, delay: 0.2 }}
          >
            <CheckCircle2 className="w-24 h-24 text-green-500 mb-6" />
          </motion.div>
          <h3 className="text-2xl font-bold text-slate-900 mb-2">Welcome aboard!</h3>
          <p className="text-slate-600 mb-8">Redirecting you to the dashboard...</p>
          <Loader2 className="w-6 h-6 text-blue-500 animate-spin" />
        </motion.div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Create account"
      subtitle="Join NexusLogistics and transform your supply chain."
    >
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-2">
          <div className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= 1 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
          <div className={`h-2 flex-1 rounded-full transition-colors duration-500 ${step >= 2 ? 'bg-blue-600' : 'bg-slate-100'}`}></div>
        </div>
        <p className="text-xs text-slate-500 text-right">Step {step} of 2</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="grid grid-cols-2 gap-4">
                <div className="relative group">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                  </div>
                  <input
                    type="text"
                    required
                    className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                    placeholder="First name"
                  />
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    className="block w-full px-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                    placeholder="Last name"
                  />
                </div>
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Building className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="Company name"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="email"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="Work email"
                />
              </div>

              <motion.button
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.99 }}
                type="button"
                onClick={handleNext}
                className="w-full mt-4 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all"
              >
                Continue
                <ChevronRight className="w-5 h-5" />
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="space-y-4"
            >
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Phone className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="tel"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="Phone number"
                />
              </div>

              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="Password"
                />
              </div>
              
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="password"
                  required
                  className="block w-full pl-11 pr-4 py-3 bg-white/80 border border-blue-200 rounded-xl text-slate-900 placeholder-slate-500 focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all outline-none"
                  placeholder="Confirm password"
                />
              </div>

              <div className="flex items-start gap-3 text-sm mt-4">
                <div className="relative flex items-center justify-center w-5 h-5 mt-0.5">
                  <input
                    type="checkbox"
                    required
                    className="peer appearance-none w-5 h-5 border border-blue-200 rounded bg-white/80 checked:bg-blue-600 checked:border-blue-600 transition-colors cursor-pointer"
                  />
                  <svg className="absolute w-3 h-3 text-slate-900 opacity-0 peer-checked:opacity-100 pointer-events-none transition-opacity" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 5L4.5 8.5L13 1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <p className="text-slate-600">
                  I agree to the{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Terms of Service</a>{" "}
                  and{" "}
                  <a href="#" className="text-blue-400 hover:text-blue-300">Privacy Policy</a>
                </p>
              </div>

              <div className="flex gap-3 mt-6">
                <button
                  type="button"
                  onClick={handleBack}
                  className="p-3 bg-slate-100 hover:bg-slate-700 text-slate-700 rounded-xl transition-colors border border-blue-200"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <motion.button
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-slate-900 rounded-xl font-medium shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all disabled:opacity-70 disabled:cursor-not-allowed group relative overflow-hidden"
                >
                  <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
                  {isLoading ? (
                    <Loader2 className="w-5 h-5 animate-spin" />
                  ) : (
                    <>
                      Create account
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </motion.button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-slate-600 text-sm mt-8">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-400 hover:text-blue-300 font-medium transition-colors">
            Sign in
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
}
