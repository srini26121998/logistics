"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, MessageSquare, Briefcase, Globe, Camera, Mail, Phone, MapPin } from "lucide-react";

export default function Footer() {
  const pathname = usePathname();

  // Don't show public footer on ops or auth pages
  if (pathname.startsWith("/ops") || pathname.startsWith("/login") || pathname.startsWith("/register")) return null;

  return (
    <footer className="bg-slate-50 text-slate-600 py-16 border-t border-blue-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-12">
          
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center text-slate-900 font-extrabold text-2xl tracking-tighter mb-4">
              <Box className="w-8 h-8 mr-2 text-indigo-500" />
              SVL
            </Link>
            <p className="text-sm text-slate-600 max-w-sm mb-6">
              The modern logistics platform built for speed and transparency. We connect the world through intelligent cargo solutions.
            </p>
            <div className="flex gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                <MessageSquare className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                <Briefcase className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-indigo-600 hover:text-white transition-colors">
                <Camera className="w-4 h-4" />
              </a>
            </div>
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Solutions</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Air Freight</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Ocean Freight</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Road Transport</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Warehousing</Link></li>
              <li><Link href="/services" className="hover:text-indigo-400 transition-colors">Customs Clearance</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Company</h3>
            <ul className="space-y-3 text-sm">
              <li><Link href="/about" className="hover:text-indigo-400 transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Careers</Link></li>
              <li><Link href="#" className="hover:text-indigo-400 transition-colors">Newsroom</Link></li>
              <li><Link href="/api-docs" className="hover:text-indigo-400 transition-colors">Developer API</Link></li>
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Client Portal</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-slate-900 font-semibold mb-4">Contact</h3>
            <ul className="space-y-3 text-sm">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-slate-500 shrink-0" />
                <span>123 Logistics Park, NH-8, New Delhi, India 110037</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                <span>+91 11 2345 6789</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-slate-500 shrink-0" />
                <span>hello@svlcargo.com</span>
              </li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-blue-200 flex flex-col md:flex-row justify-between items-center gap-4 text-xs">
          <p>&copy; {new Date().getFullYear()} SVL Logistics. All rights reserved.</p>
          <div className="flex gap-6">
            <Link href="#" className="hover:text-slate-900 transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-slate-900 transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
