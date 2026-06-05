import { LayoutDashboard, Package, FileText, Settings, Users, DollarSign, Calendar, ChevronDown, Bell, Search, Plane, Box, FileOutput } from "lucide-react";

export const OPS_SIDEBAR_NAV = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/ops", icon: LayoutDashboard },
      { label: "Analytics", href: "/ops/analytics", icon: DollarSign },
    ]
  },
  {
    title: "Shipments",
    items: [
      { label: "All Shipments", href: "/ops/shipments", icon: Package },
      { label: "Create Booking", href: "/quote", icon: Box },
      { label: "Inbound Cargo", href: "/ops/inbound", icon: Plane },
      { label: "Outbound Buildup", href: "/ops/outbound", icon: Plane },
      { label: "Flight Manifests", href: "/ops/manifests", icon: FileOutput },
    ]
  },
  {
    title: "Documentation",
    items: [
      { label: "Document Center", href: "/ops/documents", icon: FileText },
      { label: "Generate AWB", href: "/ops/awb/new", icon: FileText },
      { label: "Invoices", href: "/ops/invoices", icon: DollarSign },
      { label: "Generate Invoice", href: "/ops/invoices/generate", icon: FileText },
    ]
  },
  {
    title: "Administration",
    items: [
      { label: "Client Directory", href: "/ops/clients", icon: Users },
      { label: "Pricing / Tariffs", href: "/ops/pricing", icon: DollarSign },
      { label: "Settings", href: "/ops/settings", icon: Settings },
    ]
  }
];
