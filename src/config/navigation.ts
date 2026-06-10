import { LayoutDashboard, Package, FileText, Settings, Users, DollarSign, Calendar, ChevronDown, Bell, Search, Plane, Box, FileOutput, Truck, CheckCircle, MapPin, Building, Receipt, Navigation } from "lucide-react";

export const OPS_SIDEBAR_NAV = [
  {
    title: "Overview",
    items: [
      { label: "Dashboard", href: "/ops", icon: LayoutDashboard },
      { label: "Analytics", href: "/ops/analytics", icon: DollarSign },
    ]
  },
  {
    title: "Operations",
    items: [
      { label: "LR Management", href: "/ops/lr", icon: FileText },
      { label: "Pickups", href: "/ops/pickups", icon: Truck },
      { label: "Bookings", href: "/ops/bookings", icon: Box },
      { label: "All Shipments", href: "/ops/shipments", icon: Package },
      { label: "Manifests", href: "/ops/manifests", icon: FileOutput },
      { label: "Deliveries", href: "/ops/deliveries", icon: CheckCircle },
    ]
  },
  {
    title: "Documentation",
    items: [
      { label: "AWB Management", href: "/ops/awb/new", icon: FileText },
      { label: "Sales Invoices", href: "/ops/invoices", icon: DollarSign },
      { label: "Purchase Invoices", href: "/ops/purchase-invoices", icon: Receipt },
      { label: "Generate Invoice", href: "/ops/invoices/generate", icon: FileText },
      { label: "Document Center", href: "/ops/documents", icon: FileText },
    ]
  },
  {
    title: "Tracking",
    items: [
      { label: "GPS Tracking", href: "/ops/gps-tracking", icon: MapPin },
      { label: "Airline Tracking", href: "/ops/airline-tracking", icon: Plane },
    ]
  },
  {
    title: "Administration",
    items: [
      { label: "Client Directory", href: "/ops/clients", icon: Users },
      { label: "Vendor Management", href: "/ops/vendors", icon: Building },
      { label: "Pricing / Tariffs", href: "/ops/pricing", icon: DollarSign },
      { label: "Settings", href: "/ops/settings", icon: Settings },
    ]
  }
];
