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

export type ShipmentStatus = 'Booked' | 'Picked Up' | 'Warehouse' | 'Manifested' | 'Departed Origin' | 'In Transit' | 'Customs Hold' | 'Out for Delivery' | 'Delivered' | 'Exception' | string;
export type InvoiceStatus = 'Draft' | 'Sent' | 'Paid' | 'Overdue' | 'Cancelled';
export type UserRole = 'Admin' | 'Operations' | 'Finance' | 'Client';

export interface ScanEvent {
  id: string | number;
  timestamp: string;
  location: string;
  status: string;
  staff: string;
}

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
  events?: ScanEvent[];
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

export interface ULD {
  id: string;
  type: string;
  no: string;
  carrier: string;
  pcs: number;
  wt: number;
  awbs: string[]; // List of AWB numbers
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
  ulds?: ULD[];
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
  { id: 'm1', flightNo: '6E-1234', carrier: 'IndiGo', origin: 'DEL', destination: 'BOM', date: '2026-06-05', departure: '18:00', awbCount: 0, totalPieces: 0, totalWeight: '0 kg', status: 'Open', ulds: [] },
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
    'Delivered': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'In Transit': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Customs Hold': 'bg-rose-500/10 text-rose-600 border-rose-500/20',
    'Booked': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Picked Up': 'bg-blue-500/10 text-blue-400 border-blue-500/20',
    'Warehouse': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    'Manifested': 'bg-indigo-500/10 text-indigo-600 border-indigo-500/20',
    'Departed Origin': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Out for Delivery': 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20',
    'Exception': 'bg-red-500/10 text-red-600 border-red-500/20',
    'Active': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Inactive': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    'Suspended': 'bg-red-500/10 text-red-600 border-red-500/20',
    'Paid': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
    'Sent': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Draft': 'bg-slate-500/10 text-slate-500 border-slate-500/20',
    'Overdue': 'bg-red-500/10 text-red-600 border-red-500/20',
    'Cancelled': 'bg-slate-600/10 text-slate-500 border-slate-400/20',
    'Open': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
    'Closed': 'bg-amber-500/10 text-amber-600 border-amber-500/20',
    'Departed': 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20',
  };
  return colors[status] || 'bg-slate-500/10 text-slate-500 border-slate-500/20';
};

export const formatINR = (amount: number) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);

// ─── LR (LORRY RECEIPT) ───
export interface LorryReceipt {
  id: string;
  lrNumber: string;
  date: string;
  consignor: string;
  consignorAddress: string;
  consignorPhone: string;
  consignorEmail: string;
  consignee: string;
  consigneeAddress: string;
  consigneePhone: string;
  consigneeEmail: string;
  origin: string;
  destination: string;
  weight: number;
  dimensions: string;
  declaredValue: number;
  commodity: string;
  pieces: number;
  status: 'Pending' | 'Ready';
  bookingId?: string;
  createdAt: string;
  updatedAt: string;
}

export const LORRY_RECEIPTS: LorryReceipt[] = [
  { id: 'lr1', lrNumber: 'LR-20260601-0001', date: '2026-06-01', consignor: 'TechCorp India', consignorAddress: '12 Tech Park, Gurgaon', consignorPhone: '+91 98765 43210', consignorEmail: 'shipping@techcorp.in', consignee: 'OXEN Logistics', consigneeAddress: '45 Anna Salai, Chennai', consigneePhone: '+91 91234 56780', consigneeEmail: 'ops@oxenlogistics.com', origin: 'DEL', destination: 'MAA', weight: 1250, dimensions: '120x80x60 cm', declaredValue: 500000, commodity: 'Electronics', pieces: 45, status: 'Ready', bookingId: 'bk1', createdAt: '2026-06-01T08:00:00', updatedAt: '2026-06-01T10:30:00' },
  { id: 'lr2', lrNumber: 'LR-20260602-0001', date: '2026-06-02', consignor: 'PharmaCare Labs', consignorAddress: '89 Biotech Zone, Bengaluru', consignorPhone: '+91 87654 32100', consignorEmail: 'dispatch@pharmacare.com', consignee: 'Gulf Medics', consigneeAddress: 'Business Bay, Dubai', consigneePhone: '+971 50 123 4567', consigneeEmail: 'import@gulfmedics.ae', origin: 'BLR', destination: 'DXB', weight: 320, dimensions: '80x60x40 cm', declaredValue: 750000, commodity: 'Pharmaceuticals', pieces: 12, status: 'Ready', createdAt: '2026-06-02T09:00:00', updatedAt: '2026-06-02T11:00:00' },
  { id: 'lr3', lrNumber: 'LR-20260603-0001', date: '2026-06-03', consignor: 'Acme Corp', consignorAddress: '56 MIDC, Pune', consignorPhone: '+91 76543 21098', consignorEmail: 'logistics@acmecorp.in', consignee: 'SouthTech', consigneeAddress: '23 Tidel Park, Chennai', consigneePhone: '+91 65432 10987', consigneeEmail: 'ops@southtech.in', origin: 'PNQ', destination: 'MAA', weight: 450, dimensions: '100x70x50 cm', declaredValue: 320000, commodity: 'Machinery Parts', pieces: 8, status: 'Ready', createdAt: '2026-06-03T07:30:00', updatedAt: '2026-06-03T09:00:00' },
  { id: 'lr4', lrNumber: 'LR-20260604-0001', date: '2026-06-04', consignor: 'Global Exports', consignorAddress: '78 Jubilee Hills, Hyderabad', consignorPhone: '+91 54321 09876', consignorEmail: 'freight@globalexports.in', consignee: 'Eastern Trading', consigneeAddress: '12 Salt Lake, Kolkata', consigneePhone: '+91 43210 98765', consigneeEmail: 'import@easterntrading.in', origin: 'HYD', destination: 'CCU', weight: 680, dimensions: '90x60x50 cm', declaredValue: 200000, commodity: 'General Cargo', pieces: 22, status: 'Pending', createdAt: '2026-06-04T10:00:00', updatedAt: '2026-06-04T10:00:00' },
  { id: 'lr5', lrNumber: 'LR-20260605-0001', date: '2026-06-05', consignor: 'FabIndia', consignorAddress: '34 Nungambakkam, Chennai', consignorPhone: '+91 32109 87654', consignorEmail: 'dispatch@fabindia.in', consignee: 'NorthWear', consigneeAddress: '90 Karol Bagh, Delhi', consigneePhone: '+91 21098 76543', consigneeEmail: 'buy@northwear.in', origin: 'MAA', destination: 'DEL', weight: 920, dimensions: '150x100x80 cm', declaredValue: 600000, commodity: 'Textiles', pieces: 30, status: 'Ready', createdAt: '2026-06-05T06:00:00', updatedAt: '2026-06-05T08:30:00' },
  { id: 'lr6', lrNumber: 'LR-20260605-0002', date: '2026-06-05', consignor: 'FreshCo', consignorAddress: '67 Wakad, Pune', consignorPhone: '+91 54321 09876', consignorEmail: 'cold@freshco.in', consignee: 'GreenMart', consigneeAddress: '11 HSR Layout, Bengaluru', consigneePhone: '+91 98712 34560', consigneeEmail: 'ops@greenmart.in', origin: 'BOM', destination: 'BLR', weight: 150, dimensions: '60x40x30 cm', declaredValue: 45000, commodity: 'Perishables', pieces: 5, status: 'Pending', createdAt: '2026-06-05T11:00:00', updatedAt: '2026-06-05T11:00:00' },
];

// ─── PICKUP ───
export interface Pickup {
  id: string;
  pickupNo: string;
  lrIds: string[];
  consignorName: string;
  pickupAgent: string;
  driverName: string;
  driverPhone: string;
  scheduledDate: string;
  timeSlot: string;
  pickupAddress: string;
  status: 'Scheduled' | 'In Transit' | 'Picked Up' | 'Delivered to Hub';
  notes: string;
  createdAt: string;
}

export const PICKUPS: Pickup[] = [
  { id: 'pu1', pickupNo: 'PU-20260601-0001', lrIds: ['lr1'], consignorName: 'TechCorp India', pickupAgent: 'Ramesh Kumar', driverName: 'Arjun Singh', driverPhone: '+91 99887 76655', scheduledDate: '2026-06-01', timeSlot: '10:00 AM - 12:00 PM', pickupAddress: '12 Tech Park, Gurgaon, Delhi NCR', status: 'Delivered to Hub', notes: 'Handled with care - electronics', createdAt: '2026-06-01T07:00:00' },
  { id: 'pu2', pickupNo: 'PU-20260602-0001', lrIds: ['lr2'], consignorName: 'PharmaCare Labs', pickupAgent: 'Suresh M', driverName: 'Karthik R', driverPhone: '+91 88776 65544', scheduledDate: '2026-06-02', timeSlot: '02:00 PM - 04:00 PM', pickupAddress: '89 Biotech Zone, Bengaluru', status: 'Delivered to Hub', notes: 'Temperature-sensitive cargo', createdAt: '2026-06-02T08:00:00' },
  { id: 'pu3', pickupNo: 'PU-20260604-0001', lrIds: ['lr4'], consignorName: 'Global Exports', pickupAgent: 'Vijay Reddy', driverName: 'Manoj P', driverPhone: '+91 77665 54433', scheduledDate: '2026-06-06', timeSlot: '09:00 AM - 11:00 AM', pickupAddress: '78 Jubilee Hills, Hyderabad', status: 'Scheduled', notes: '', createdAt: '2026-06-04T10:30:00' },
  { id: 'pu4', pickupNo: 'PU-20260605-0001', lrIds: ['lr5', 'lr6'], consignorName: 'FabIndia / FreshCo', pickupAgent: 'Anil Kumar', driverName: 'Ravi D', driverPhone: '+91 66554 43322', scheduledDate: '2026-06-05', timeSlot: '04:00 PM - 06:00 PM', pickupAddress: 'Multiple Pickups - Chennai/Pune', status: 'Picked Up', notes: 'Bulk pickup - 2 consignors', createdAt: '2026-06-05T05:00:00' },
];

// ─── BOOKING ───
export interface Booking {
  id: string;
  bookingRef: string;
  lrIds: string[];
  mode: 'Air' | 'Road' | 'Train';
  status: 'Draft' | 'Confirmed' | 'In Transit' | 'Completed';
  origin: string;
  destination: string;
  departureDate: string;
  estimatedDelivery: string;
  vendorId?: string;
  flightNo?: string;
  airline?: string;
  awbNumber?: string;
  originAirport?: string;
  destinationAirport?: string;
  vehicleNo?: string;
  driverName?: string;
  gpsDeviceId?: string;
  originHub?: string;
  destinationHub?: string;
  trainNo?: string;
  pnrRrNo?: string;
  loadingStation?: string;
  unloadingStation?: string;
  totalPieces: number;
  totalWeight: number;
  createdAt: string;
}

export const BOOKINGS: Booking[] = [
  { id: 'bk1', bookingRef: 'BK-20260601-0001', lrIds: ['lr1'], mode: 'Air', status: 'In Transit', origin: 'DEL', destination: 'MAA', departureDate: '2026-06-01', estimatedDelivery: '2026-06-02', vendorId: 'v1', flightNo: '6E-1234', airline: 'IndiGo Cargo', awbNumber: '312-66761752', originAirport: 'IGI Delhi', destinationAirport: 'Chennai Intl', totalPieces: 45, totalWeight: 1250, createdAt: '2026-06-01T09:00:00' },
  { id: 'bk2', bookingRef: 'BK-20260602-0001', lrIds: ['lr2'], mode: 'Air', status: 'Confirmed', origin: 'BLR', destination: 'DXB', departureDate: '2026-06-02', estimatedDelivery: '2026-06-04', vendorId: 'v5', flightNo: 'EK-505', airline: 'Emirates', awbNumber: '312-66761753', originAirport: 'Kempegowda Intl', destinationAirport: 'Dubai Intl', totalPieces: 12, totalWeight: 320, createdAt: '2026-06-02T10:00:00' },
  { id: 'bk3', bookingRef: 'BK-20260603-0001', lrIds: ['lr3'], mode: 'Road', status: 'Completed', origin: 'PNQ', destination: 'MAA', departureDate: '2026-05-28', estimatedDelivery: '2026-06-01', vendorId: 'v3', vehicleNo: 'MH-12-AB-3456', driverName: 'Sanjay Patil', gpsDeviceId: 'GPS-003', originHub: 'Pune Hub', destinationHub: 'Chennai Hub', totalPieces: 8, totalWeight: 450, createdAt: '2026-05-28T06:00:00' },
  { id: 'bk4', bookingRef: 'BK-20260604-0001', lrIds: ['lr4'], mode: 'Train', status: 'Draft', origin: 'HYD', destination: 'CCU', departureDate: '2026-06-08', estimatedDelivery: '2026-06-11', trainNo: '12604', pnrRrNo: 'PNR-8876543', loadingStation: 'Secunderabad Jn', unloadingStation: 'Howrah Jn', totalPieces: 22, totalWeight: 680, createdAt: '2026-06-04T10:30:00' },
  { id: 'bk5', bookingRef: 'BK-20260605-0001', lrIds: ['lr5'], mode: 'Air', status: 'In Transit', origin: 'MAA', destination: 'DEL', departureDate: '2026-06-05', estimatedDelivery: '2026-06-06', vendorId: 'v2', flightNo: 'QP-1100', airline: 'Akasa Air', awbNumber: '312-66761756', originAirport: 'Chennai Intl', destinationAirport: 'IGI Delhi', totalPieces: 30, totalWeight: 920, createdAt: '2026-06-05T07:00:00' },
  { id: 'bk6', bookingRef: 'BK-20260605-0002', lrIds: ['lr6'], mode: 'Road', status: 'In Transit', origin: 'BOM', destination: 'BLR', departureDate: '2026-06-05', estimatedDelivery: '2026-06-07', vendorId: 'v3', vehicleNo: 'KA-01-CD-7890', driverName: 'Prakash M', gpsDeviceId: 'GPS-001', originHub: 'Mumbai Hub', destinationHub: 'Bengaluru Hub', totalPieces: 5, totalWeight: 150, createdAt: '2026-06-05T12:00:00' },
];

// ─── DELIVERY / POD ───
export interface Delivery {
  id: string;
  deliveryNo: string;
  lrId: string;
  bookingId: string;
  awbNumber?: string;
  consigneeName: string;
  deliveryAddress: string;
  deliveryAgent: string;
  deliveryAgentPhone: string;
  status: 'Out for Delivery' | 'Delivered' | 'Attempted' | 'Failed' | 'RTO';
  scheduledDate: string;
  deliveredDate?: string;
  podSignature?: string;
  podPhoto?: string;
  podTimestamp?: string;
  podGeoLat?: number;
  podGeoLng?: number;
  podReceiverName?: string;
  failureReason?: string;
  rtoReason?: string;
  notes: string;
}

export const DELIVERIES: Delivery[] = [
  { id: 'del1', deliveryNo: 'DEL-20260603-0001', lrId: 'lr3', bookingId: 'bk3', consigneeName: 'SouthTech', deliveryAddress: '23 Tidel Park, Chennai', deliveryAgent: 'Muthu K', deliveryAgentPhone: '+91 99001 22334', status: 'Delivered', scheduledDate: '2026-06-01', deliveredDate: '2026-06-01', podTimestamp: '2026-06-01T14:30:00', podGeoLat: 12.9910, podGeoLng: 80.2425, podReceiverName: 'Kiran S', notes: 'Delivered at reception' },
  { id: 'del2', deliveryNo: 'DEL-20260606-0001', lrId: 'lr6', bookingId: 'bk6', awbNumber: '312-66761757', consigneeName: 'GreenMart', deliveryAddress: '11 HSR Layout, Bengaluru', deliveryAgent: 'Raju P', deliveryAgentPhone: '+91 88990 11223', status: 'Out for Delivery', scheduledDate: '2026-06-07', notes: 'Handle with care - perishables' },
  { id: 'del3', deliveryNo: 'DEL-20260606-0002', lrId: 'lr1', bookingId: 'bk1', awbNumber: '312-66761752', consigneeName: 'OXEN Logistics', deliveryAddress: '45 Anna Salai, Chennai', deliveryAgent: 'Suresh M', deliveryAgentPhone: '+91 77880 99001', status: 'Attempted', scheduledDate: '2026-06-06', failureReason: 'Consignee not available', notes: 'Will retry tomorrow' },
];

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

export const VENDORS: Vendor[] = [
  { id: 'v1', name: 'IndiGo Cargo Services', type: 'Airline', contactPerson: 'Rohit Menon', email: 'cargo@goindigo.in', phone: '+91 1800 180 3838', address: 'Terminal 1D, IGI Airport, New Delhi', gstin: '07AABCI1234F1Z5', panNo: 'AABCI1234F', bankName: 'HDFC Bank', bankAccount: '50100098765432', ifscCode: 'HDFC0001234', kycVerified: true, contractStart: '2025-01-01', contractEnd: '2027-12-31', status: 'Active', rating: 4.5, totalTransactions: 1245 },
  { id: 'v2', name: 'Akasa Air Cargo', type: 'Airline', contactPerson: 'Priya Das', email: 'cargo@akasaair.com', phone: '+91 1800 200 9090', address: 'BKC, Mumbai', gstin: '27AADCA9988H1Z3', panNo: 'AADCA9988H', bankName: 'ICICI Bank', bankAccount: '123409876543', ifscCode: 'ICIC0004567', kycVerified: true, contractStart: '2025-06-01', contractEnd: '2027-05-31', status: 'Active', rating: 4.2, totalTransactions: 567 },
  { id: 'v3', name: 'VRL Logistics Ltd', type: 'Trucking', contactPerson: 'Sunil Garg', email: 'ops@vrllogistics.in', phone: '+91 9880 123456', address: 'Whitefield, Bengaluru', gstin: '29AABCV5566D1Z8', panNo: 'AABCV5566D', bankName: 'SBI', bankAccount: '39876543210', ifscCode: 'SBIN0007890', kycVerified: true, contractStart: '2024-04-01', contractEnd: '2026-03-31', status: 'Active', rating: 4.0, totalTransactions: 892 },
  { id: 'v4', name: 'SafeExpress Pvt Ltd', type: 'Courier', contactPerson: 'Anita Sharma', email: 'bookings@safexpress.com', phone: '+91 1800 113 113', address: 'Okhla, New Delhi', gstin: '07AADCS3344B1Z1', panNo: 'AADCS3344B', bankName: 'Axis Bank', bankAccount: '920010012345678', ifscCode: 'UTIB0001111', kycVerified: true, contractStart: '2025-01-01', contractEnd: '2026-12-31', status: 'Active', rating: 4.7, totalTransactions: 2100 },
  { id: 'v5', name: 'Emirates SkyCargo', type: 'Airline', contactPerson: 'Ahmed Al-Rashid', email: 'cargo@emirates.com', phone: '+971 4 708 1111', address: 'Dubai Airport Free Zone', gstin: 'N/A', panNo: 'N/A', bankName: 'Emirates NBD', bankAccount: 'AE070331234567890123', ifscCode: 'N/A', kycVerified: true, contractStart: '2025-03-01', contractEnd: '2027-02-28', status: 'Active', rating: 4.8, totalTransactions: 340 },
  { id: 'v6', name: 'Indian Railways Cargo', type: 'Railways', contactPerson: 'Rajesh Verma', email: 'parcel@irctc.co.in', phone: '+91 139', address: 'Rail Bhavan, New Delhi', gstin: '07AABCI9900G1Z2', panNo: 'AABCI9900G', bankName: 'PNB', bankAccount: '0987654321012', ifscCode: 'PUNB0012300', kycVerified: true, contractStart: '2025-04-01', contractEnd: '2027-03-31', status: 'Active', rating: 3.5, totalTransactions: 156 },
];

// ─── PURCHASE INVOICE ───
export interface PurchaseLineItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface PurchaseInvoice {
  id: string;
  invoiceNo: string;
  vendorId: string;
  vendorName: string;
  date: string;
  dueDate: string;
  serviceType?: string;
  awbDocketNo?: string;
  origin?: string;
  destination?: string;
  weight?: number;
  currency?: string;
  paymentTerms?: string;
  remarks?: string;
  items: PurchaseLineItem[];
  subtotal: number;
  gstPercent?: number;
  gst: number;
  total: number;
  status: 'Pending' | 'Approved' | 'Paid' | 'Rejected' | 'Received' | 'Under Review';
  importSource: 'Manual' | 'Excel';
}

export const PURCHASE_INVOICES: PurchaseInvoice[] = [
  { id: 'pi1', invoiceNo: 'VI/6E/001/26', vendorId: 'v1', vendorName: 'IndiGo Cargo Services', date: '2026-05-15', dueDate: '2026-06-15', items: [{ description: 'Freight Charges - DEL to MAA', quantity: 1, rate: 45000, amount: 45000 }, { description: 'Fuel Surcharge', quantity: 1, rate: 5400, amount: 5400 }], subtotal: 50400, gst: 9072, total: 59472, status: 'Paid', importSource: 'Manual' },
  { id: 'pi2', invoiceNo: 'VI/VRL/002/26', vendorId: 'v3', vendorName: 'VRL Logistics Ltd', date: '2026-05-20', dueDate: '2026-06-20', items: [{ description: 'Surface Transport - PNQ to MAA', quantity: 1, rate: 18000, amount: 18000 }, { description: 'Loading/Unloading', quantity: 2, rate: 1500, amount: 3000 }], subtotal: 21000, gst: 3780, total: 24780, status: 'Approved', importSource: 'Manual' },
  { id: 'pi3', invoiceNo: 'VI/EK/003/26', vendorId: 'v5', vendorName: 'Emirates SkyCargo', date: '2026-06-01', dueDate: '2026-07-01', items: [{ description: 'International Air Freight - BLR to DXB', quantity: 1, rate: 125000, amount: 125000 }, { description: 'Security Screening', quantity: 1, rate: 3200, amount: 3200 }, { description: 'Documentation Fee', quantity: 1, rate: 2000, amount: 2000 }], subtotal: 130200, gst: 0, total: 130200, status: 'Pending', importSource: 'Excel' },
];

// ─── GPS DEVICE ───
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
  route?: { lat: number; lng: number }[];
}

export const GPS_DEVICES: GPSDevice[] = [
  { id: 'gps1', deviceId: 'GPS-001', vehicleNo: 'KA-01-CD-7890', bookingId: 'bk6', lat: 15.3173, lng: 75.7139, speed: 65, heading: 180, lastPing: '2026-06-06T14:30:00', status: 'Online', route: [{ lat: 19.0760, lng: 72.8777 }, { lat: 17.3850, lng: 78.4867 }, { lat: 15.3173, lng: 75.7139 }, { lat: 12.9716, lng: 77.5946 }] },
  { id: 'gps2', deviceId: 'GPS-002', vehicleNo: 'TN-09-EF-1234', lat: 12.9716, lng: 77.5946, speed: 0, heading: 0, lastPing: '2026-06-06T12:00:00', status: 'Idle' },
  { id: 'gps3', deviceId: 'GPS-003', vehicleNo: 'MH-12-AB-3456', bookingId: 'bk3', lat: 12.9910, lng: 80.2425, speed: 0, heading: 0, lastPing: '2026-06-01T16:00:00', status: 'Offline' },
];

// ─── AIRLINE PREFIX MAP ───
export const AIRLINE_AWB_PREFIXES: Record<string, { airline: string; trackingUrl: string; logo: string }> = {
  '312': { airline: 'IndiGo Cargo (6E)', trackingUrl: 'https://www.interlinklogistics.in', logo: '6E' },
  '098': { airline: 'Air India (AI)', trackingUrl: 'https://aircargoindia.in', logo: 'AI' },
  '176': { airline: 'Emirates (EK)', trackingUrl: 'https://eskycargo.emirates.com', logo: 'EK' },
  '218': { airline: 'SpiceJet (SG)', trackingUrl: 'https://corporate.spicejet.com/spicexpress', logo: 'SG' },
  '607': { airline: 'Akasa Air (QP)', trackingUrl: 'https://www.akasaair.com/cargo', logo: 'QP' },
  '125': { airline: 'British Airways (BA)', trackingUrl: 'https://www.iagcargo.com', logo: 'BA' },
  '057': { airline: 'Air France (AF)', trackingUrl: 'https://www.afklcargo.com', logo: 'AF' },
  '020': { airline: 'Lufthansa (LH)', trackingUrl: 'https://www.lufthansa-cargo.com', logo: 'LH' },
};

// ─── AIRLINE TRACKING CONFIG (Section 5.5.2) ───
// Config with {AWB} placeholder that gets injected with the actual AWB number
export interface AirlineTrackingConfig {
  airline: string;
  awbPrefix: string;
  trackingUrlPattern: string;
  description: string;
}

export const AIRLINE_TRACKING_CONFIG: AirlineTrackingConfig[] = [
  { airline: 'IndiGo (6E)', awbPrefix: '6E-', trackingUrlPattern: 'https://www.goindigo.in/cargo/track-shipment.html?awb={AWB}', description: 'Opens IndiGo Cargo tracking page with AWB pre-filled' },
  { airline: 'Air India (AI)', awbPrefix: 'AI-', trackingUrlPattern: 'https://www.airindia.in/cargo/track-shipment?awb={AWB}', description: 'Opens Air India Cargo tracking with AWB prefilled' },
  { airline: 'SpiceJet (SG)', awbPrefix: 'SG-', trackingUrlPattern: 'https://www.spicejet.com/spicemax-cargo/track?awb={AWB}', description: 'Opens SpiceJet Cargo tracking with AWB prefilled' },
  { airline: 'Vistara (UK)', awbPrefix: 'UK-', trackingUrlPattern: 'https://airasiacargotracking.com/vistara?awb={AWB}', description: 'Opens Vistara Cargo tracking with AWB pre-filled' },
  { airline: 'Air India Express (IX)', awbPrefix: 'IX-', trackingUrlPattern: 'https://www.airindiaexpress.in/cargo?awb={AWB}', description: 'Opens AIX Cargo with AWB pre-filled' },
  { airline: 'Emirates (EK)', awbPrefix: 'EK-', trackingUrlPattern: 'https://eskycargo.emirates.com/shipments/track?awb={AWB}', description: 'Opens Emirates SkyCargo tracking with AWB pre-filled' },
  { airline: 'Akasa Air (QP)', awbPrefix: 'QP-', trackingUrlPattern: 'https://www.akasaair.com/cargo/track?awb={AWB}', description: 'Opens Akasa Air Cargo tracking with AWB pre-filled' },
];

// ─── GPS MILESTONES & ALERTS (Section 5.4) ───
export type MilestoneType = 'Pickup Confirmed' | 'In Transit' | 'Near Destination' | 'Delivered' | 'Delay Alert' | 'Route Deviation';

export interface GPSMilestone {
  id: string;
  bookingId: string;
  vehicleNo: string;
  milestone: MilestoneType;
  trigger: string;
  timestamp: string;
  notifiedTo: string[];
  lat?: number;
  lng?: number;
  details?: string;
}

export const GPS_MILESTONES: GPSMilestone[] = [
  { id: 'ms1', bookingId: 'bk3', vehicleNo: 'MH-12-AB-3456', milestone: 'Pickup Confirmed', trigger: 'Vehicle departs origin hub', timestamp: '2026-05-28T06:30:00', notifiedTo: ['Consignor', 'Ops'], lat: 18.5204, lng: 73.8567, details: 'Departed Pune Hub with 8 pieces' },
  { id: 'ms2', bookingId: 'bk3', vehicleNo: 'MH-12-AB-3456', milestone: 'In Transit', trigger: 'Vehicle moving on route', timestamp: '2026-05-28T10:00:00', notifiedTo: ['Ops Dashboard'], lat: 17.3850, lng: 78.4867, details: 'Passed Hyderabad checkpoint, speed: 72 km/h' },
  { id: 'ms3', bookingId: 'bk3', vehicleNo: 'MH-12-AB-3456', milestone: 'Near Destination', trigger: 'Within 50km radius of delivery', timestamp: '2026-05-31T22:00:00', notifiedTo: ['Consignee', 'Ops'], lat: 13.0827, lng: 80.2707, details: 'Approaching Chennai, ETA: 1.5 hours' },
  { id: 'ms4', bookingId: 'bk3', vehicleNo: 'MH-12-AB-3456', milestone: 'Delivered', trigger: 'GPS confirms arrival + POD captured', timestamp: '2026-06-01T14:30:00', notifiedTo: ['Consignor', 'Consignee', 'Ops'], lat: 12.9910, lng: 80.2425, details: 'Delivered at 23 Tidel Park, Chennai. Receiver: Kiran S' },
  { id: 'ms5', bookingId: 'bk6', vehicleNo: 'KA-01-CD-7890', milestone: 'Pickup Confirmed', trigger: 'Vehicle departs origin hub', timestamp: '2026-06-05T12:30:00', notifiedTo: ['Consignor', 'Ops'], lat: 19.0760, lng: 72.8777, details: 'Departed Mumbai Hub with 5 pieces' },
  { id: 'ms6', bookingId: 'bk6', vehicleNo: 'KA-01-CD-7890', milestone: 'In Transit', trigger: 'Vehicle moving on route', timestamp: '2026-06-06T08:00:00', notifiedTo: ['Ops Dashboard'], lat: 15.3173, lng: 75.7139, details: 'En route, current speed: 65 km/h' },
  { id: 'ms7', bookingId: 'bk6', vehicleNo: 'KA-01-CD-7890', milestone: 'Delay Alert', trigger: 'ETA exceeded by 2 hours', timestamp: '2026-06-06T16:00:00', notifiedTo: ['Ops', 'Manager'], lat: 14.6819, lng: 75.0124, details: 'Traffic delay on NH-48 near Davangere. Original ETA: 14:00, Revised: 18:30' },
];

// ─── GPS ALERTS ───
export interface GPSAlert {
  id: string;
  deviceId: string;
  vehicleNo: string;
  type: 'Speed' | 'Idle' | 'Geo-Fence' | 'Route Deviation';
  message: string;
  timestamp: string;
  severity: 'Low' | 'Medium' | 'High';
  lat: number;
  lng: number;
}

export const GPS_ALERTS: GPSAlert[] = [
  { id: 'ga1', deviceId: 'GPS-001', vehicleNo: 'KA-01-CD-7890', type: 'Speed', message: 'Speed exceeded 90 km/h on NH-48', timestamp: '2026-06-06T09:45:00', severity: 'Medium', lat: 15.8281, lng: 75.4023 },
  { id: 'ga2', deviceId: 'GPS-001', vehicleNo: 'KA-01-CD-7890', type: 'Idle', message: 'Vehicle idle for 45 minutes near Davangere', timestamp: '2026-06-06T13:30:00', severity: 'Low', lat: 14.4474, lng: 75.9218 },
  { id: 'ga3', deviceId: 'GPS-001', vehicleNo: 'KA-01-CD-7890', type: 'Geo-Fence', message: 'Vehicle entered Bengaluru urban zone', timestamp: '2026-06-06T17:00:00', severity: 'Low', lat: 12.9716, lng: 77.5946 },
  { id: 'ga4', deviceId: 'GPS-003', vehicleNo: 'MH-12-AB-3456', type: 'Route Deviation', message: 'Vehicle deviated 12km from planned route near Solapur', timestamp: '2026-05-29T14:00:00', severity: 'High', lat: 17.6599, lng: 75.9064 },
];

// ─── LINKED DOCUMENT INDEX (Section 5.5.1 Smart Search) ───
// This index enables the Smart Search to find all related documents for any AWB/Docket
export interface LinkedDocumentResult {
  type: 'AWB' | 'LR' | 'Booking' | 'Manifest' | 'Sales Invoice' | 'Purchase Invoice';
  refNumber: string;
  summary: string;
  link: string;
  awbNumber?: string;
  // additional searchable fields
  origin?: string;
  destination?: string;
  date?: string;
  status?: string;
  customer?: string;
  vendor?: string;
  amount?: number;
}

export function buildLinkedDocumentIndex(): LinkedDocumentResult[] {
  const results: LinkedDocumentResult[] = [];

  // AWB records from shipments
  SHIPMENTS.forEach(s => {
    results.push({
      type: 'AWB',
      refNumber: s.awb,
      summary: `${s.origin}→${s.destination} | ${s.carrier} | ${s.status}`,
      link: `/track/${s.awb}`,
      awbNumber: s.awb,
      origin: s.origin,
      destination: s.destination,
      date: s.bookedDate,
      status: s.status,
      customer: s.consignee,
    });
  });

  // LR records
  LORRY_RECEIPTS.forEach(lr => {
    const linkedBooking = BOOKINGS.find(b => b.lrIds.includes(lr.id));
    results.push({
      type: 'LR',
      refNumber: lr.lrNumber,
      summary: `${lr.consignor}→${lr.consignee} | ${lr.weight}kg | ${lr.pieces} pcs`,
      link: `/ops/lr`,
      awbNumber: linkedBooking?.awbNumber,
      origin: lr.origin,
      destination: lr.destination,
      date: lr.date,
      status: lr.status,
    });
  });

  // Booking records
  BOOKINGS.forEach(bk => {
    results.push({
      type: 'Booking',
      refNumber: bk.bookingRef,
      summary: `${bk.mode} | ${bk.origin}→${bk.destination} | ${bk.status}`,
      link: `/ops/bookings`,
      awbNumber: bk.awbNumber,
      origin: bk.origin,
      destination: bk.destination,
      date: bk.departureDate,
      status: bk.status,
    });
  });

  // Manifest records
  MANIFESTS.forEach(m => {
    results.push({
      type: 'Manifest',
      refNumber: m.flightNo,
      summary: `${m.carrier} | ${m.origin}→${m.destination} | ${m.date}`,
      link: `/ops/manifests`,
      origin: m.origin,
      destination: m.destination,
      date: m.date,
      status: m.status,
    });
  });

  // Sales Invoices
  INVOICES.forEach(inv => {
    results.push({
      type: 'Sales Invoice',
      refNumber: inv.invoiceNo,
      summary: `${inv.clientName} | ₹${inv.total.toLocaleString()} | ${inv.status}`,
      link: `/ops/invoices`,
      date: inv.date,
      status: inv.status,
      customer: inv.clientName,
      amount: inv.total,
    });
  });

  // Purchase Invoices
  PURCHASE_INVOICES.forEach(pi => {
    results.push({
      type: 'Purchase Invoice',
      refNumber: pi.invoiceNo,
      summary: `${pi.vendorName} | ₹${pi.total.toLocaleString()} | ${pi.status}`,
      link: `/ops/purchase-invoices`,
      awbNumber: pi.awbDocketNo,
      date: pi.date,
      status: pi.status,
      vendor: pi.vendorName,
      amount: pi.total,
    });
  });

  return results;
}

// ─── AUTOMATION RULES (Section 6) ───
export interface AutomationRule {
  id: string;
  triggerEvent: string;
  action: string;
  isActive: boolean;
}

export const AUTOMATION_RULES: AutomationRule[] = [
  { id: 'ar1', triggerEvent: 'AWB Executed', action: 'A signed AWB PDF emailed to customer automatically', isActive: true },
  { id: 'ar2', triggerEvent: 'AWB Executed', action: 'Sales Invoice and Purchase Invoice auto-updated with AWB data', isActive: true },
  { id: 'ar3', triggerEvent: 'Delivery Completed + POD Captured', action: 'POD email sent to customer; LR status closed', isActive: true },
  { id: 'ar4', triggerEvent: 'Sales Invoice Generated', action: 'Customer balance/ledger updated', isActive: true },
  { id: 'ar5', triggerEvent: 'Purchase Invoice Approved', action: 'Vendor ledger updated; payment queue notified', isActive: true },
  { id: 'ar6', triggerEvent: 'Road Booking Created', action: 'GPS tracking session initiated for assigned vehicle', isActive: true },
  { id: 'ar7', triggerEvent: 'Docket No. Entered (Air)', action: 'Typeahead suggests linked AWB, LR, Booking, Invoice records instantly', isActive: true },
  { id: 'ar8', triggerEvent: "'Track Shipment' Clicked", action: 'System identifies airline from AWB prefix and opens official tracking site', isActive: true },
  { id: 'ar9', triggerEvent: 'Excel Invoice File Uploaded', action: 'System validates all rows and shows pass/fail preview before committing', isActive: true },
  { id: 'ar10', triggerEvent: 'Duplicate Invoice Detected on Import', action: 'System raises a warning and prompts user to skip or overwrite', isActive: true },
];
