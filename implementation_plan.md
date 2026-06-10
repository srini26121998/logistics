# 🚛 Freight & Logistics Management System — Implementation Plan

> **Project**: SVL Logistics Platform  
> **Date**: 2026-06-10  
> **Stack**: Next.js 16 + React 19 + TailwindCSS 4 + Framer Motion + Sonner + jsPDF

---

## 1. Current State Analysis

### ✅ What Already Exists

| Module | Status | Location |
|--------|--------|----------|
| Dashboard | ✅ Built | `/ops/page.tsx` |
| Shipments List | ✅ Built | `/ops/shipments/page.tsx` |
| Shipment Detail / Tracking | ✅ Built | `/track/[awb]/page.tsx` |
| AWB Creation (Air Waybill) | ✅ Built | `/ops/awb/new/page.tsx` |
| Flight Manifests (ULD-based) | ✅ Built | `/ops/manifests/page.tsx` |
| Invoice List + PDF Preview | ✅ Built | `/ops/invoices/page.tsx` |
| Invoice Generation | ✅ Built | `/ops/invoices/generate/page.tsx` |
| Client Directory | ✅ Built | `/ops/clients/page.tsx` |
| Inbound Cargo | ✅ Built | `/ops/inbound/page.tsx` |
| Outbound Buildup | ✅ Built | `/ops/outbound/page.tsx` |
| Pricing / Tariffs | ✅ Built | `/ops/pricing/page.tsx` |
| Analytics | ✅ Built | `/ops/analytics/page.tsx` |
| Document Center | ✅ Built | `/ops/documents/page.tsx` |
| Navigation Config | ✅ Built | `/config/navigation.ts` |
| Mock Data Store | ✅ Built | `/data/mockData.ts` |

### ❌ What's Missing (Per SRS Requirements)

| # | Required Module | Gap |
|---|----------------|-----|
| 1 | **LR (Lorry Receipt) Management** — Create, edit, delete, readiness check, auto-number | 🔴 Not built |
| 2 | **Pickup Management** — Pickup requests, agent assignment, scheduling, status flow | 🔴 Not built |
| 3 | **Booking Management (Road/Train modes)** — Only Air exists; Road & Train booking forms needed | 🟡 Partially built (Air only) |
| 4 | **Manifest enhancements** — Road/Train manifests, PDF export, digital sign-off | 🟡 Partial (Air manifests exist but no PDF/sign-off) |
| 5 | **AWB Execution enhancements** — Status flow (Draft→Executed→Sent), email dispatch, audit trail | 🟡 Partial (creation exists, no execution flow) |
| 6 | **Delivery Management with POD** — Delivery assignment, status flow, POD capture (signature, photo, geo) | 🔴 Not built |
| 7 | **Sales Invoice enhancements** — Rate card support, frequency config, email to customer | 🟡 Partial |
| 8 | **Purchase Invoice Management** — Vendor invoices, Bulk Excel Import | 🔴 Not built |
| 9 | **Vendor Management Module** — Full vendor CRUD, KYC, contract management | 🔴 Not built |
| 10 | **GPS Tracking for Road Shipments** — Real-time map, device linkage, ETA calculation | 🔴 Not built |
| 11 | **Airline Docket Smart Tracking** — Airline-specific redirect, docket number lookup | 🔴 Not built |

---

## 2. Implementation Phases

### Phase 1: Data Layer & LR Module (Core Foundation)

> **Files to create/modify**: `mockData.ts`, `navigation.ts`, new pages

#### 1A. Extend Data Models (`src/data/mockData.ts`)

Add the following new interfaces and mock data:

```typescript
// ─── LR (LORRY RECEIPT) ───
export interface LorryReceipt {
  id: string;
  lrNumber: string;          // Auto-generated: LR-YYYYMMDD-XXXX
  date: string;
  consignor: string;         // Sender name
  consignorAddress: string;
  consignorPhone: string;
  consignorEmail: string;
  consignee: string;         // Receiver name
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  origin: string;
  destination: string;
  weight: number;            // in kg
  dimensions: string;        // e.g. "60x40x30 cm"
  declaredValue: number;
  commodity: string;
  pieces: number;
  status: 'Pending' | 'Ready';
  bookingId?: string;        // linked booking ref
  createdAt: string;
  updatedAt: string;
}

// ─── PICKUP ───
export interface Pickup {
  id: string;
  pickupNo: string;          // Auto: PU-YYYYMMDD-XXXX
  lrIds: string[];           // Linked LR IDs
  consignorName: string;
  pickupAgent: string;
  driverName: string;
  driverPhone: string;
  scheduledDate: string;
  timeSlot: string;          // e.g. "10:00 AM - 12:00 PM"
  pickupAddress: string;
  status: 'Scheduled' | 'In Transit' | 'Picked Up' | 'Delivered to Hub';
  notes: string;
  createdAt: string;
}

// ─── BOOKING (Extended for Road/Train) ───
export interface Booking {
  id: string;
  bookingRef: string;        // Auto: BK-YYYYMMDD-XXXX
  lrIds: string[];
  mode: 'Air' | 'Road' | 'Train';
  status: 'Draft' | 'Confirmed' | 'In Transit' | 'Completed';
  
  // Common fields
  origin: string;
  destination: string;
  departureDate: string;
  estimatedDelivery: string;
  vendorId?: string;
  
  // Air-specific
  flightNo?: string;
  airline?: string;
  awbNumber?: string;
  originAirport?: string;
  destinationAirport?: string;
  
  // Road-specific
  vehicleNo?: string;
  driverName?: string;
  gpsDeviceId?: string;
  originHub?: string;
  destinationHub?: string;
  
  // Train-specific
  trainNo?: string;
  pnrRrNo?: string;
  loadingStation?: string;
  unloadingStation?: string;
  
  totalPieces: number;
  totalWeight: number;
  createdAt: string;
}

// ─── DELIVERY / POD ───
export interface Delivery {
  id: string;
  deliveryNo: string;
  lrId: string;
  bookingId: string;
  awbNumber?: string;
  consigneeName: string;
  deliveryAgent: string;
  deliveryAgentPhone: string;
  status: 'Out for Delivery' | 'Delivered' | 'Attempted' | 'Failed' | 'RTO';
  scheduledDate: string;
  deliveredDate?: string;
  
  // POD data
  podSignature?: string;      // base64 signature image
  podPhoto?: string;          // base64 photo
  podTimestamp?: string;
  podGeoLat?: number;
  podGeoLng?: number;
  podReceiverName?: string;
  
  failureReason?: string;
  rtoReason?: string;
  notes: string;
}

// ─── VENDOR ───
export interface Vendor {
  id: string;
  name: string;
  type: 'Airline' | 'Trucking' | 'Railways' | 'Courier' | 'Fleet';
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  gstin: string;
  panNo: string;
  bankName: string;
  bankAccount: string;
  ifscCode: string;
  kycVerified: boolean;
  contractStart: string;
  contractEnd: string;
  status: 'Active' | 'Inactive' | 'Blacklisted';
  rating: number;
  totalTransactions: number;
}

// ─── PURCHASE INVOICE ───
export interface PurchaseInvoice {
  id: string;
  invoiceNo: string;
  vendorId: string;
  vendorName: string;
  date: string;
  dueDate: string;
  items: PurchaseLineItem[];
  subtotal: number;
  gst: number;
  total: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected';
  importSource?: 'Manual' | 'Excel';
  attachmentUrl?: string;
}

export interface PurchaseLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

// ─── GPS TRACKING ───
export interface GPSDevice {
  id: string;
  deviceId: string;
  vehicleNo: string;
  bookingId?: string;
  lat: number;
  lng: number;
  speed: number;
  heading: number;
  lastPing: string;
  status: 'Online' | 'Offline' | 'Idle';
}
```

#### 1B. LR Management Module

**New pages:**
- `src/app/ops/lr/page.tsx` — LR List (CRUD table with search, filter, status badges)
- `src/app/ops/lr/new/page.tsx` — Create/Edit LR form
- `src/app/ops/lr/[id]/page.tsx` — LR detail view with readiness toggle

**Key Features:**
- ✅ Auto-generate LR number: `LR-YYYYMMDD-XXXX`
- ✅ Full CRUD (Create, View, Edit, Delete)
- ✅ Readiness status indicator (Ready / Pending) with toggle
- ✅ Validation checks before marking as 'Ready' (all required fields filled)
- ✅ Bidirectional navigation (Previous/Next LR buttons)
- ✅ Search & filter by date range, status, origin/destination
- ✅ Fields: Consignor, Consignee, Origin, Destination, Weight, Dimensions, Declared Value, Commodity

---

### Phase 2: Pickup & Booking Management

#### 2A. Pickup Management Module

**New pages:**
- `src/app/ops/pickups/page.tsx` — Pickup list & scheduling
- `src/app/ops/pickups/new/page.tsx` — Create pickup request form

**Key Features:**
- ✅ Create pickup requests linked to one or more LRs
- ✅ Assign pickup agent / driver
- ✅ Pickup scheduling with date and time slot picker
- ✅ Status tracking: Scheduled → In Transit → Picked Up → Delivered to Hub
- ✅ Toast notification on pickup confirmation

#### 2B. Booking Management (Multi-Mode)

**New/Modified pages:**
- `src/app/ops/bookings/page.tsx` — All bookings list (replaces current Create Booking link)
- `src/app/ops/bookings/new/page.tsx` — Multi-mode booking form with tabs (Air / Road / Train)

**Key Features:**
- ✅ Mode-specific form fields:
  - **Air**: Flight No., Airline, AWB No., Origin Airport, Destination Airport, Departure Date
  - **Road**: Vehicle No., Driver Name, GPS Device ID, Origin Hub, Destination Hub, Departure Date/Time
  - **Train**: Train No., PNR/RR No., Loading Station, Unloading Station, Departure Date
- ✅ Single LR or Bulk (multiple LRs) booking
- ✅ Auto-generated booking reference number
- ✅ Estimated delivery date calculation (mock)
- ✅ Vendor/carrier assignment from Vendor module

---

### Phase 3: Manifest, AWB & Delivery

#### 3A. Manifest Generation Enhancements

**Modify**: `src/app/ops/manifests/page.tsx`

**New Features:**
- ✅ Support Road and Train manifests (not just flights)
- ✅ Manifest fields: Manifest No., Date, Transport Mode, Carrier Details, List of LRs
- ✅ Print-ready and PDF export of the manifest (using jsPDF)
- ✅ Digital sign-off by dispatch supervisor (mock signature capture)
- ✅ Status flow: Draft → Dispatched → Closed

#### 3B. AWB Execution Enhancements

**Modify**: `src/app/ops/awb/new/page.tsx` + new `src/app/ops/awb/page.tsx`

**New Features:**
- ✅ AWB listing page (all AWBs with status)
- ✅ Execution status: Draft → Executed → Sent
- ✅ On execution: simulate email dispatch to customer
- ✅ Bi-directional editing before execution (lock after)
- ✅ Audit trail panel (log of all AWB changes with timestamp)

#### 3C. Delivery Management with POD Scan

**New pages:**
- `src/app/ops/deliveries/page.tsx` — Delivery list with status tracking
- `src/app/ops/deliveries/[id]/page.tsx` — Delivery detail with POD capture

**Key Features:**
- ✅ Delivery assignment to delivery agent
- ✅ Status flow: Out for Delivery → Delivered / Attempted / Failed
- ✅ POD capture via web portal:
  - Digital signature pad (Canvas-based)
  - Timestamp and geo-location of delivery (browser Geolocation API)
  - Photo upload of delivered package
- ✅ Signed copy stored and "emailed" to customer (simulated)
- ✅ Undelivered handling: Reschedule / Return to hub / RTO
- ✅ Real-time delivery status visible on tracking portal (`/track/[awb]`)

---

### Phase 4: Invoice & Vendor Management

#### 4A. Sales Invoice Enhancements

**Modify**: `src/app/ops/invoices/page.tsx` + `generate/page.tsx`

**New Features:**
- ✅ Invoice frequency config per customer (per shipment / every 15 days / monthly)
- ✅ Multiple rate cards per customer support
- ✅ Customer-wise invoice history and outstanding balance report
- ✅ Email invoice to customer (simulated with toast)
- ✅ Status: Draft → Sent → Paid → Overdue

#### 4B. Purchase Invoice Management

**New pages:**
- `src/app/ops/purchase-invoices/page.tsx` — Purchase invoice list
- `src/app/ops/purchase-invoices/new/page.tsx` — Create purchase invoice
- `src/app/ops/purchase-invoices/import/page.tsx` — Bulk Excel Import

**Key Features:**
- ✅ Full CRUD for purchase invoices from vendors
- ✅ Bulk Excel Import (CSV/Excel file upload with column mapping preview)
- ✅ Status flow: Pending → Approved → Paid / Rejected
- ✅ Link to vendor record

#### 4C. Vendor Management Module

**New pages:**
- `src/app/ops/vendors/page.tsx` — Vendor directory
- `src/app/ops/vendors/new/page.tsx` — Add/edit vendor form
- `src/app/ops/vendors/[id]/page.tsx` — Vendor detail

**Key Features:**
- ✅ Full CRUD with search & filter by type, status
- ✅ Vendor types: Airline, Trucking, Railways, Courier, Fleet
- ✅ KYC verification toggle
- ✅ Contract management (start/end date tracking)
- ✅ Bank details for payment processing
- ✅ Performance rating & transaction history

---

### Phase 5: GPS & Airline Tracking

#### 5A. GPS Tracking for Road Shipments

**New pages:**
- `src/app/ops/gps-tracking/page.tsx` — GPS dashboard with live map

**Key Features:**
- ✅ Simulated real-time map (CSS-based route visualization — no external map API needed)
- ✅ Vehicle/device listing with status (Online / Offline / Idle)
- ✅ Link GPS device to booking/vehicle
- ✅ Route progress visualization
- ✅ ETA calculation display
- ✅ Last known location with timestamp

#### 5B. Airline Docket Smart Tracking

**New pages:**
- `src/app/ops/airline-tracking/page.tsx` — Airline docket lookup

**Key Features:**
- ✅ AWB/Docket number input for lookup
- ✅ Airline auto-detection from AWB prefix
- ✅ Smart redirect buttons to airline-specific cargo tracking portals:
  - IndiGo Cargo → `https://www.interlinklogistics.in`
  - Air India → `https://aircargoindia.in`
  - SpiceJet → `https://corporate.spicejet.com/spicexpress`
  - Emirates → `https://eskycargo.emirates.com`
- ✅ Embedded tracking timeline from our system
- ✅ Known airline prefix mapping table

---

### Phase 6: Navigation & Integration

#### 6A. Update Sidebar Navigation (`src/config/navigation.ts`)

```typescript
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
      { label: "AWB Management", href: "/ops/awb", icon: FileText },
      { label: "Sales Invoices", href: "/ops/invoices", icon: DollarSign },
      { label: "Purchase Invoices", href: "/ops/purchase-invoices", icon: Receipt },
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
```

---

## 3. New Files Summary

| # | File Path | Description |
|---|-----------|-------------|
| 1 | `src/app/ops/lr/page.tsx` | LR list with CRUD |
| 2 | `src/app/ops/lr/new/page.tsx` | Create/Edit LR form |
| 3 | `src/app/ops/lr/[id]/page.tsx` | LR detail + readiness toggle |
| 4 | `src/app/ops/pickups/page.tsx` | Pickup management |
| 5 | `src/app/ops/pickups/new/page.tsx` | Create pickup request |
| 6 | `src/app/ops/bookings/page.tsx` | All bookings (Air/Road/Train) |
| 7 | `src/app/ops/bookings/new/page.tsx` | Multi-mode booking form |
| 8 | `src/app/ops/deliveries/page.tsx` | Delivery list + status |
| 9 | `src/app/ops/deliveries/[id]/page.tsx` | Delivery detail + POD capture |
| 10 | `src/app/ops/awb/page.tsx` | AWB listing (all AWBs) |
| 11 | `src/app/ops/purchase-invoices/page.tsx` | Purchase invoice list |
| 12 | `src/app/ops/purchase-invoices/new/page.tsx` | Create purchase invoice |
| 13 | `src/app/ops/purchase-invoices/import/page.tsx` | Bulk Excel import |
| 14 | `src/app/ops/vendors/page.tsx` | Vendor directory |
| 15 | `src/app/ops/vendors/new/page.tsx` | Add/edit vendor |
| 16 | `src/app/ops/vendors/[id]/page.tsx` | Vendor detail |
| 17 | `src/app/ops/gps-tracking/page.tsx` | GPS tracking dashboard |
| 18 | `src/app/ops/airline-tracking/page.tsx` | Airline docket tracker |

**Modified Files:**
- `src/data/mockData.ts` — Extended with all new interfaces + mock data
- `src/config/navigation.ts` — Updated sidebar structure
- `src/app/ops/manifests/page.tsx` — Multi-mode manifest support + PDF
- `src/app/ops/awb/new/page.tsx` — Execution flow + audit trail
- `src/app/ops/invoices/page.tsx` — Rate card + frequency config
- `src/app/ops/invoices/generate/page.tsx` — Enhanced generation
- `src/app/track/[awb]/page.tsx` — Show delivery/POD status

---

## 4. Sample Testing Flow

> **End-to-end scenario**: New shipment from LR creation to delivery with invoice

### Step 1: Create LR
1. Navigate to **Ops → LR Management**
2. Click **"+ New LR"**
3. Fill in: Consignor = "TechCorp India", Consignee = "OXEN Logistics"
4. Origin = DEL, Destination = BOM
5. Weight = 250kg, Pieces = 10, Commodity = "Electronics"
6. Save → LR auto-number: `LR-20260610-0001` created in **Pending** status
7. Fill all required fields → Click **"Mark as Ready"** → Status changes to **Ready** ✅

### Step 2: Schedule Pickup
1. Navigate to **Ops → Pickups → New Pickup**
2. Link to LR `LR-20260610-0001`
3. Assign Agent: "Ramesh Kumar", Schedule: Today 2:00 PM - 4:00 PM
4. Save → Pickup `PU-20260610-0001` created as **Scheduled**
5. Update status: **Scheduled → In Transit → Picked Up → Delivered to Hub** ✅

### Step 3: Create Booking (Air Mode)
1. Navigate to **Ops → Bookings → New Booking**
2. Select Mode = **Air**
3. Link LR: `LR-20260610-0001`
4. Airline = IndiGo, Flight = 6E-1234, AWB = 312-99887766
5. Origin Airport = DEL, Destination Airport = BOM
6. Save → Booking `BK-20260610-0001` created as **Confirmed** ✅

### Step 4: Generate Manifest
1. Navigate to **Ops → Manifests**
2. Create manifest for Flight 6E-1234
3. Add ULD → Load AWB 312-99887766
4. Close flight → **Dispatch** → Status = Departed ✅

### Step 5: AWB Execution
1. Navigate to **Ops → AWB Management**
2. Find AWB 312-99887766 → Status = **Draft**
3. Fill shipper/consignee details → Click **"Execute"**
4. Status changes to **Executed** → Email auto-dispatched
5. Status changes to **Sent** ✅

### Step 6: Delivery + POD
1. Navigate to **Ops → Deliveries**
2. Create delivery for AWB 312-99887766
3. Assign delivery agent: "Suresh M"
4. Status → **Out for Delivery**
5. Delivery agent opens delivery detail:
   - Captures **digital signature** on canvas
   - Captures **photo** of package
   - **Geo-location** auto-captured
6. Click **"Confirm Delivery"** → Status = **Delivered**
7. POD stored and "emailed" to consignee ✅

### Step 7: Generate Invoice
1. Navigate to **Ops → Sales Invoices → Generate Invoice**
2. Select Client = "TechCorp India"
3. System auto-pulls LR data and booking charges
4. Add GST, surcharges
5. Generate → Invoice `SVL/007/26-27` created as **Draft**
6. Send to client → Status = **Sent** ✅

### Step 8: Track Shipment
1. Navigate to **Track** page
2. Enter AWB 312-99887766
3. Full timeline visible: Booked → Picked Up → Manifested → Departed → Delivered (with POD) ✅

---

## 5. Design Principles

- **Consistent with existing UI** — White/light theme, indigo accent, card-3d effects, Framer Motion animations
- **Same component patterns** — StatusBadge, toast notifications, table structures
- **Responsive** — Mobile-first with `sm:`, `md:`, `lg:` breakpoints
- **No external APIs** — All data is mock, GPS is simulated, email is toast-notified
- **PDF generation** — Using existing `jsPDF` + `html-to-image` stack

---

## 6. Estimated File Count

| Category | Count |
|----------|-------|
| New pages | 18 |
| Modified files | 7 |
| New mock data additions | 1 (extended) |
| Navigation update | 1 |
| **Total changes** | **~27 files** |

---

> [!IMPORTANT]
> **Please review this plan and confirm.** Once approved, I will begin implementation phase by phase, starting with Phase 1 (Data Layer + LR Module).
