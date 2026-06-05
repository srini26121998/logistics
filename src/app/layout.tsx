import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Link from "next/link";
import { Box } from "lucide-react";
import { Toaster } from "sonner";
import "./globals.css";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import BackButton from "@/components/ui/BackButton";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SVL Logistics | Move Cargo. Track Instantly.",
  description: "The modern logistics platform built for speed and transparency.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} ${inter.variable} font-sans antialiased flex flex-col min-h-screen bg-[#0A0A0B] text-slate-200`}>
        <Navbar />
        <main className="flex-grow flex flex-col">
          {children}
        </main>
        <Toaster position="top-center" theme="dark" richColors />
        <BackButton />
        <Footer />
      </body>
    </html>
  );
}
