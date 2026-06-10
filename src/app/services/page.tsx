import React from "react";
import { Plane, Ship, Truck, Box, ShieldCheck, Clock, MapPin, Phone, Mail, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ServicesPage() {
  const services = [
    {
      icon: <Plane className="w-8 h-8 text-indigo-500" />,
      title: "Air Freight",
      desc: "Express and consolidated air freight services globally. Ideal for high-value and time-critical shipments.",
      features: ["Next Flight Out (NFO)", "Door-to-Door", "Charter Services"]
    },
    {
      icon: <Ship className="w-8 h-8 text-blue-500" />,
      title: "Ocean Freight",
      desc: "Cost-effective FCL and LCL ocean shipping. Perfect for large volumes and heavy machinery.",
      features: ["Full Container Load", "Less than Container", "RoRo Services"]
    },
    {
      icon: <Truck className="w-8 h-8 text-emerald-500" />,
      title: "Surface Transport",
      desc: "Extensive domestic and cross-border road networks ensuring your cargo reaches every corner.",
      features: ["FTL & LTL", "Express Cargo", "Last Mile Delivery"]
    },
    {
      icon: <Box className="w-8 h-8 text-amber-500" />,
      title: "Warehousing",
      desc: "State-of-the-art secure storage facilities with inventory management and fulfillment services.",
      features: ["Bonded Warehouses", "Cold Chain Storage", "Pick & Pack"]
    },
    {
      icon: <ShieldCheck className="w-8 h-8 text-rose-500" />,
      title: "Customs Brokerage",
      desc: "Expert navigation of complex customs regulations to ensure smooth clearance of your goods.",
      features: ["Duty Calculation", "Documentation Prep", "Compliance Consulting"]
    },
    {
      icon: <Clock className="w-8 h-8 text-fuchsia-500" />,
      title: "Time-Critical",
      desc: "When every second counts. Specialized logistics for AOG, medical emergencies, and urgent parts.",
      features: ["Hand Carry / OBC", "24/7 Monitoring", "Priority Routing"]
    }
  ];

  return (
    <div className="bg-slate-50 min-h-screen">
      <div className="bg-indigo-600 text-white pt-24 pb-32 px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-6">Our Services</h1>
        <p className="text-lg text-indigo-100 max-w-2xl mx-auto">
          Comprehensive supply chain solutions tailored to your industry. We handle the complexity so you can focus on your business.
        </p>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, idx) => (
            <div key={idx} className="bg-white rounded-2xl shadow-sm border border-blue-200 p-8 hover:shadow-lg transition-shadow group">
              <div className="w-16 h-16 bg-slate-50 rounded-2xl flex items-center justify-center mb-6 border border-blue-100 group-hover:bg-white transition-colors">
                {service.icon}
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-3">{service.title}</h3>
              <p className="text-slate-600 mb-6">{service.desc}</p>
              <ul className="space-y-2 mb-8">
                {service.features.map((feat, i) => (
                  <li key={i} className="flex items-center text-sm text-slate-700 font-medium">
                    <div className="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2"></div>
                    {feat}
                  </li>
                ))}
              </ul>
              <Link href="/quote" className="text-indigo-600 font-bold flex items-center group-hover:text-indigo-700">
                Get a Quote <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-24 text-center">
        <h2 className="text-3xl font-bold text-slate-900 mb-6">Need a Custom Solution?</h2>
        <p className="text-lg text-slate-600 mb-8">
          Our logistics engineers can design a bespoke supply chain strategy specifically for your unique requirements.
        </p>
        <Link href="/contact" className="inline-block px-8 py-3 bg-white hover:bg-slate-100 text-slate-900 font-bold rounded-lg transition-colors">
          Contact Our Experts
        </Link>
      </div>
    </div>
  );
}
