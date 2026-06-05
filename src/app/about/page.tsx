import React from "react";
import { Box, Globe, ShieldCheck, Zap, Users, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutPage() {
  return (
    <div className="bg-white min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden bg-slate-900 text-white">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/90 to-slate-900/90 mix-blend-multiply" />
          <img 
            src="https://images.unsplash.com/photo-1586528116311-ad8ed7c83a7f?q=80&w=2070&auto=format&fit=crop" 
            alt="Logistics Warehouse" 
            className="w-full h-full object-cover opacity-40"
          />
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
            Redefining Global <span className="text-indigo-400">Logistics</span>
          </h1>
          <p className="text-xl text-slate-300 max-w-3xl mx-auto mb-10 leading-relaxed">
            SVL Logistics is on a mission to bring transparency, speed, and reliability to the world's supply chains through cutting-edge technology and unparalleled service.
          </p>
        </div>
      </section>

      {/* Stats */}
      <section className="py-12 bg-indigo-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center text-white divide-x divide-indigo-500/50">
            <div>
              <div className="text-4xl font-bold mb-2">15+</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Years Experience</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">120</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Countries Served</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">2M+</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">Shipments Delivered</div>
            </div>
            <div>
              <div className="text-4xl font-bold mb-2">99.8%</div>
              <div className="text-indigo-200 text-sm font-medium uppercase tracking-wider">On-Time Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Our Core Values</h2>
            <p className="text-slate-600 max-w-2xl mx-auto">We are driven by a commitment to excellence, innovation, and our customers' success.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="w-16 h-16 bg-indigo-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-indigo-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Global Reach, Local Touch</h3>
              <p className="text-slate-600">Our extensive network spans the globe, but our dedicated teams provide personalized support to navigate local complexities.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-emerald-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <ShieldCheck className="w-8 h-8 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Uncompromising Reliability</h3>
              <p className="text-slate-600">We treat every shipment as critical. Our robust infrastructure and rigorous protocols ensure your cargo is secure and on time.</p>
            </div>
            <div className="text-center">
              <div className="w-16 h-16 bg-rose-50 rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Zap className="w-8 h-8 text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Tech-Driven Innovation</h3>
              <p className="text-slate-600">From predictive analytics to real-time tracking, we leverage modern technology to optimize routes and provide total transparency.</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-slate-50 border-t border-slate-200 py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-slate-900 mb-6">Ready to upgrade your logistics?</h2>
          <p className="text-lg text-slate-600 mb-8">Join thousands of companies who trust SVL Logistics to power their global supply chains.</p>
          <div className="flex justify-center gap-4">
            <Link href="/register" className="px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-lg transition-colors shadow-lg shadow-indigo-200 flex items-center">
              Open an Account <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
            <Link href="/contact" className="px-8 py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-lg transition-colors">
              Contact Sales
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
