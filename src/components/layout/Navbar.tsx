"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Box, Menu, X, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  // Don't show public navbar on ops pages (they have their own layout)
  if (pathname.startsWith("/ops")) return null;

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Services", href: "/services" },
    { name: "Quote Calculator", href: "/quote" },
    { name: "Track Cargo", href: "/track" },
    { name: "About Us", href: "/about" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header className="bg-white border-b border-blue-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="flex items-center text-indigo-600 font-extrabold text-2xl tracking-tighter hover:opacity-80 transition-opacity">
            <Box className="w-8 h-8 mr-2" />
            SVL
          </Link>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center space-x-8 font-semibold text-sm">
            {navLinks.map(link => (
              <Link 
                key={link.name} 
                href={link.href} 
                className={`transition-colors ${pathname === link.href ? "text-indigo-600" : "text-slate-600 hover:text-indigo-600"}`}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4">
            <Link href="/login" className="text-sm font-semibold text-slate-600 hover:text-indigo-600 transition-colors flex items-center gap-2">
              <User className="w-4 h-4" /> Client Portal
            </Link>
            <Link href="/quote" className="bg-indigo-600 text-white font-bold px-5 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-md shadow-indigo-200">
              New Booking
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden p-2 text-slate-600 hover:text-indigo-600 transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden bg-white border-b border-blue-100 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-4 flex flex-col">
              {navLinks.map(link => (
                <Link 
                  key={link.name} 
                  href={link.href} 
                  onClick={() => setIsOpen(false)}
                  className={`block text-base font-semibold ${pathname === link.href ? "text-indigo-600" : "text-slate-600"}`}
                >
                  {link.name}
                </Link>
              ))}
              <div className="pt-4 border-t border-blue-100 flex flex-col gap-3">
                <Link 
                  href="/login" 
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full py-2 border border-blue-200 rounded-lg text-slate-700 font-semibold"
                >
                  <User className="w-4 h-4" /> Client Portal
                </Link>
                <Link 
                  href="/quote" 
                  onClick={() => setIsOpen(false)}
                  className="w-full bg-indigo-600 text-white font-bold py-2 rounded-lg text-center shadow-md shadow-indigo-200"
                >
                  New Booking
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
