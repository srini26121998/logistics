// Centralized Mock Data Store for SVL Logistics Platform

export const AIRPORTS = [
  { code: 'MAA', name: 'Chennai Intl', city: 'Chennai', state: 'Tamil Nadu' },
  { code: 'PNQ', name: 'Pune Airport', city: 'Pune', state: 'Maharashtra' },
  { code: 'BDQ', name: 'Vadodara Airport', city: 'Vadodara', state: 'Gujarat' },
  { code: 'HYD', name: 'Rajiv Gandhi Intl', city: 'Hyderabad', state: 'Telangana' },
  { code: 'BLR', name: 'Kempegowda Intl', city: 'Bengaluru', state: 'Karnataka' },
  { code: 'BOM', name: 'CSIA Mumbai', city: 'Mumbai', state: 'Maharashtra' },
  { code: 'DEL', name: 'IGI Delhi', city: 'New Delhi', state: 'Delhi' },
  { code: 'CCU', name: 'NSCBI Kolkata', city: 'Kolkata', state: 'West Bengal' },
  { code: 'DXB', name: 'Dubai Intl', city: 'Dubai', state: 'UAE' },
  { code: 'JFK', name: 'John F Kennedy', city: 'New York', state: 'USA' },
];

export type ShipmentStatus = 'Booked' | 'Picked Up' | 'In Transit' | 'Customs Hold' | 'Out for Delivery' | 'Delivered' | 'Exception';
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type UserRole = 'Admin' | 'Operations' | 'Finance' | 'Client';

export interface Shipment {
  id: string;
  awb: string;
  lrNumber: string;
  origin: string;
  destination: string;
  status: ShipmentStatus;
  carrier: string;
  mode: 'Air' | 'Surface';
  pieces: number;
  weight: string;
  commodity: string;
  shipper: string;
  consignee: string;
  bookedDate: string;
  eta: string;
  amount: number;
  flight?: string;
}

export interface Customer {
  id: string;
  name: string;
  gstin: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  stateCode: string;
  creditLimit: number;
  outstanding: number;
  totalShipments: number;
  status: 'Active' | 'Inactive' | 'Suspended';
  kycVerified: boolean;
  joinedDate: string;
  contactPerson: string;
}

export interface Invoice {
  id: string;
  invoiceNo: string;
  clientId: string;
  clientName: string;
  date: string;
  dueDate: string;
  awbCount: number;
  taxableAmount: number;
  gst: number;
  total: number;
  status: InvoiceStatus;
  paidAmount: number;
}

export interface AppUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: 'Active' | 'Inactive';
  lastLogin: string;
  avatar: string;
}

export interface Manifest {
  id: string;
  flightNo: string;
  carrier: string;
  origin: string;
  destination: string;
  date: string;
  departure: string;
  awbCount: number;
  totalPieces: number;
  totalWeight: string;
  status: 'Open' | 'Closed' | 'Departed';
}

// ─── MOCK SHIPMENTS ───
export const SHIPMENTS: Shipment[] = [
  { id: 's1', awb: '312-66761752', lrNumber: 'LR-892345', origin: 'DEL', destination: 'BOM', status: 'In Transit', carrier: 'IndiGo Cargo', mode: 'Air', pieces: 45, weight: '1250 kg', commodity: 'Electronics', shipper: 'TechCorp India', consignee: 'OXEN Logistics', bookedDate: '2026-06-01', eta: '2026-06-06', amount: 56250, flight: '6E-1234' },
  { id: 's2', awb: '312-66761753', lrNumber: 'LR-100293', origin: 'BLR', destination: 'DXB', status: 'Customs Hold', carrier: 'Emirates', mode: 'Air', pieces: 12, weight: '320 kg', commodity: 'Pharmaceuticals', shipper: 'PharmaCare Labs', consignee: 'Gulf Medics', bookedDate: '2026-06-02', eta: '2026-06-07', amount: 38400, flight: 'EK-505' },
  { id: 's3', awb: '312-66761754', lrNumber: 'LR-774821', origin: 'PNQ', destination: 'MAA', status: 'Delivered', carrier: 'VRL Logistics', mode: 'Surface', pieces: 8, weight: '450 kg', commodity: 'Machinery Parts', shipper: 'Acme Corp', consignee: 'SouthTech', bookedDate: '2026-05-28', eta: '2026-06-03', amount: 22500 },
  { id: 's4', awb: '312-66761755', lrNumber: 'LR-992104', origin: 'HYD', destination: 'CCU', status: 'Booked', carrier: 'Air India', mode: 'Air', pieces: 22, weight: '680 kg', commodity: 'General Cargo', shipper: 'Global Exports', consignee: 'Eastern Trading', bookedDate: '2026-06-04', eta: '2026-06-08', amount: 34000, flight: 'AI-882' },
  { id: 's5', awb: '312-66761756', lrNumber: 'LR-443920', origin: 'MAA', destination: 'DEL', status: 'In Transit', carrier: 'Akasa Air', mode: 'Air', pieces: 30, weight: '920 kg', commodity: 'Textiles', shipper: 'FabIndia', consignee: 'NorthWear', bookedDate: '2026-06-03', eta: '2026-06-06', amount: 46000, flight: 'QP-1100' },
  { id: 's6', awb: '312-66761757', lrNumber: 'LR-556012', origin: 'BOM', destination: 'BLR', status: 'Out for Delivery', carrier: 'IndiGo Cargo', mode: 'Air', pieces: 5, weight: '150 kg', commodity: 'Perishables', shipper: 'FreshCo', consignee: 'GreenMart', bookedDate: '2026-06-03', eta: '2026-06-05', amount: 12000, flight: '6E-8821' },
  { id: 's7', awb: '312-66761758', lrNumber: 'LR-667890', origin: 'DEL', destination: 'HYD', status: 'Picked Up', carrier: 'BlueDart', mode: 'Surface', pieces: 60, weight: '2100 kg', commodity: 'Auto Parts', shipper: 'AutoZone India', consignee: 'HydMotors', bookedDate: '2026-06-05', eta: '2026-06-09', amount: 88200 },
  { id: 's8', awb: '312-66761759', lrNumber: 'LR-778901', origin: 'CCU', destination: 'BOM', status: 'Exception', carrier: 'Air India', mode: 'Air', pieces: 3, weight: '85 kg', commodity: 'Dangerous Goods', shipper: 'ChemEx Labs', consignee: 'WestChem', bookedDate: '2026-06-01', eta: '2026-06-04', amount: 17000, flight: 'AI-101' },
  { id: 's9', awb: '312-66761760', lrNumber: 'LR-889012', origin: 'BLR', destination: 'MAA', status: 'Delivered', carrier: 'Safexpress', mode: 'Surface', pieces: 15, weight: '540 kg', commodity: 'Electronics', shipper: 'InfoSys Logistics', consignee: 'MAAWarehouse', bookedDate: '2026-05-25', eta: '2026-05-30', amount: 27000 },
  { id: 's10', awb: '312-66761761', lrNumber: 'LR-990123', origin: 'MAA', destination: 'BOM', status: 'In Transit', carrier: 'IndiGo Cargo', mode: 'Air', pieces: 18, weight: '670 kg', commodity: 'Pharmaceuticals', shipper: 'CureWell', consignee: 'MedSupply West', bookedDate: '2026-06-04', eta: '2026-06-07', amount: 53600, flight: '6E-4321' },
];

// ─── MOCK CUSTOMERS ───
export const CUSTOMERS: Customer[] = [
  { id: 'c1', name: 'OXEN Logistics Pvt Ltd', gstin: '33AABCO1234F1Z5', email: 'ops@oxenlogistics.com', phone: '+91 98765 43210', city: 'Chennai', state: 'Tamil Nadu', stateCode: '33', creditLimit: 500000, outstanding: 125000, totalShipments: 342, status: 'Active', kycVerified: true, joinedDate: '2024-01-15', contactPerson: 'Rajesh Kumar' },
  { id: 'c2', name: 'Acme Corp Logistics', gstin: '27AADCA1122Q1Z9', email: 'logistics@acmecorp.in', phone: '+91 91234 56780', city: 'Mumbai', state: 'Maharashtra', stateCode: '27', creditLimit: 750000, outstanding: 230000, totalShipments: 518, status: 'Active', kycVerified: true, joinedDate: '2023-06-20', contactPerson: 'Priya Sharma' },
  { id: 'c3', name: 'TechCorp India', gstin: '07BBTCI9988H1Z3', email: 'shipping@techcorp.in', phone: '+91 87654 32100', city: 'New Delhi', state: 'Delhi', stateCode: '07', creditLimit: 1000000, outstanding: 450000, totalShipments: 891, status: 'Active', kycVerified: true, joinedDate: '2022-11-01', contactPerson: 'Vikram Singh' },
  { id: 'c4', name: 'PharmaCare Labs', gstin: '29AAFPC7766D1Z8', email: 'dispatch@pharmacare.com', phone: '+91 76543 21098', city: 'Bengaluru', state: 'Karnataka', stateCode: '29', creditLimit: 300000, outstanding: 0, totalShipments: 156, status: 'Active', kycVerified: true, joinedDate: '2025-03-10', contactPerson: 'Dr. Anita Rao' },
  { id: 'c5', name: 'Global Exports Inc', gstin: '36AADGE5544B1Z1', email: 'freight@globalexports.in', phone: '+91 65432 10987', city: 'Hyderabad', state: 'Telangana', stateCode: '36', creditLimit: 200000, outstanding: 180000, totalShipments: 89, status: 'Suspended', kycVerified: false, joinedDate: '2025-08-22', contactPerson: 'Suresh Reddy' },
  { id: 'c6', name: 'FreshCo Foods', gstin: '27AADFF3322C1Z6', email: 'cold@freshco.in', phone: '+91 54321 09876', city: 'Pune', state: 'Maharashtra', stateCode: '27', creditLimit: 150000, outstanding: 42000, totalShipments: 67, status: 'Active', kycVerified: true, joinedDate: '2025-12-05', contactPerson: 'Amit Desai' },
];

// ─── MOCK INVOICES ───
export const INVOICES: Invoice[] = [
  { id: 'inv1', invoiceNo: 'SVL/001/26-27', clientId: 'c1', clientName: 'OXEN Logistics Pvt Ltd', date: '2026-05-01', dueDate: '2026-05-06', awbCount: 4, taxableAmount: 168950, gst: 30411, total: 199361, status: 'Paid', paidAmount: 199361 },
  { id: 'inv2', invoiceNo: 'SVL/002/26-27', clientId: 'c2', clientName: 'Acme Corp Logistics', date: '2026-05-10', dueDate: '2026-05-15', awbCount: 6, taxableAmount: 245000, gst: 44100, total: 289100, status: 'Overdue', paidAmount: 0 },
  { id: 'inv3', invoiceNo: 'SVL/003/26-27', clientId: 'c3', clientName: 'TechCorp India', date: '2026-05-20', dueDate: '2026-05-25', awbCount: 8, taxableAmount: 412500, gst: 74250, total: 486750, status: 'Paid', paidAmount: 486750 },
  { id: 'inv4', invoiceNo: 'SVL/004/26-27', clientId: 'c1', clientName: 'OXEN Logistics Pvt Ltd', date: '2026-06-01', dueDate: '2026-06-06', awbCount: 3, taxableAmount: 125000, gst: 22500, total: 147500, status: 'Sent', paidAmount: 0 },
  { id: 'inv5', invoiceNo: 'SVL/005/26-27', clientId: 'c4', clientName: 'PharmaCare Labs', date: '2026-06-03', dueDate: '2026-06-08', awbCount: 2, taxableAmount: 76800, gst: 13824, total: 90624, status: 'Draft', paidAmount: 0 },
  { id: 'inv6', invoiceNo: 'SVL/006/26-27', clientId: 'c5', clientName: 'Global Exports Inc', date: '2026-06-04', dueDate: '2026-06-09', awbCount: 5, taxableAmount: 189000, gst: 34020, total: 223020, status: 'Sent', paidAmount: 0 },
];

// ─── MOCK USERS ───
export const USERS: AppUser[] = [
  { id: 'u1', name: 'John Doe', email: 'john@svlcargo.com', role: 'Admin', status: 'Active', lastLogin: '2026-06-05T09:30:00', avatar: 'JD' },
  { id: 'u2', name: 'Priya Nair', email: 'priya@svlcargo.com', role: 'Operations', status: 'Active', lastLogin: '2026-06-05T08:15:00', avatar: 'PN' },
  { id: 'u3', name: 'Rahul Mehta', email: 'rahul@svlcargo.com', role: 'Finance', status: 'Active', lastLogin: '2026-06-04T17:45:00', avatar: 'RM' },
  { id: 'u4', name: 'Sarah Jenkins', email: 'sarah@techcorp.in', role: 'Client', status: 'Active', lastLogin: '2026-06-03T14:20:00', avatar: 'SJ' },
  { id: 'u5', name: 'Vijay Kumar', email: 'vijay@svlcargo.com', role: 'Operations', status: 'Inactive', lastLogin: '2026-05-20T10:00:00', avatar: 'VK' },
];

// ─── MOCK MANIFESTS ───
export const MANIFESTS: Manifest[] = [
  { id: 'm1', flightNo: '6E-1234', carrier: 'IndiGo', origin: 'DEL', destination: 'BOM', date: '2026-06-05', departure: '18:00', awbCount: 12, totalPieces: 145, totalWeight: '4200 kg', status: 'Open' },
  { id: 'm2', flightNo: 'AI-882', carrier: 'Air India', origin: 'HYD', destination: 'CCU', date: '2026-06-05', departure: '20:30', awbCount: 8, totalPieces: 67, totalWeight: '2100 kg', status: 'Open' },
  { id: 'm3', flightNo: 'QP-1100', carrier: 'Akasa Air', origin: 'MAA', destination: 'DEL', date: '2026-06-05', departure: '14:00', awbCount: 15, totalPieces: 210, totalWeight: '5800 kg', status: 'Closed' },
  { id: 'm4', flightNo: '6E-8821', carrier: 'IndiGo', origin: 'BOM', destination: 'BLR', date: '2026-06-04', departure: '09:30', awbCount: 6, totalPieces: 42, totalWeight: '1350 kg', status: 'Departed' },
];

// ─── ANALYTICS DATA ───
export const MONTHLY_REVENUE = [
  { month: 'Jan', revenue: 1850000, shipments: 312 },
  { month: 'Feb', revenue: 2100000, shipments: 345 },
  { month: 'Mar', revenue: 1950000, shipments: 328 },
  { month: 'Apr', revenue: 2400000, shipments: 402 },
  { month: 'May', revenue: 2750000, shipments: 458 },
  { month: 'Jun', revenue: 2450000, shipments: 410 },
];

export const ROUTE_PERFORMANCE = [
  { route: 'DEL → BOM', shipments: 245, revenue: 1200000, avgDelivery: '1.2 days', onTime: 96 },
  { route: 'MAA → DEL', shipments: 198, revenue: 980000, avgDelivery: '1.5 days', onTime: 94 },
  { route: 'BLR → DXB', shipments: 156, revenue: 1450000, avgDelivery: '2.1 days', onTime: 91 },
  { route: 'BOM → BLR', shipments: 134, revenue: 670000, avgDelivery: '1.0 days', onTime: 98 },
  { route: 'HYD → CCU', shipments: 89, revenue: 445000, avgDelivery: '1.8 days', onTime: 92 },
];

export const CARRIER_STATS = [
  { carrier: 'IndiGo Cargo', share: 38, onTime: 96, rating: 4.5 },
  { carrier: 'Air India', share: 22, onTime: 89, rating: 3.8 },
  { carrier: 'Akasa Air', share: 18, onTime: 94, rating: 4.2 },
  { carrier: 'BlueDart', share: 12, onTime: 97, rating: 4.7 },
  { carrier: 'Safexpress', share: 10, onTime: 93, rating: 4.0 },
];

// ─── HELPER FUNCTIONS ───
export const getStatusColor = (status: string) => {
  const colors: Record<string, string> = {
    'Delivered': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'In Transit': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Customs Hold': 'bg-rose-500/10 text-rose-400 border-rose-500/20',
    'Booked': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Picked Up': 'bg-purple-500/10 text-purple-400 border-purple-500/20',
    'Out for Delivery': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Exception': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Active': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Inactive': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Suspended': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Paid': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    'Sent': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Draft': 'bg-slate-500/10 text-slate-400 border-slate-500/20',
    'Overdue': 'bg-red-500/10 text-red-400 border-red-500/20',
    'Cancelled': 'bg-slate-600/10 text-slate-500 border-slate-600/20',
    'Open': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Closed': 'bg-amber-500/10 text-amber-400 border-amber-500/20',
    'Departed': 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  };
  return colors[status] || 'bg-slate-500/10 text-slate-400 border-slate-500/20';
};

export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
