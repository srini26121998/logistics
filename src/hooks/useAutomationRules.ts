// Automation Rules Hook (Section 6)
// Simulates system-wide automation triggers for the logistics platform

import { toast } from "sonner";

type AutomationEvent = 
  | 'AWB_EXECUTED'
  | 'DELIVERY_COMPLETED_POD'
  | 'SALES_INVOICE_GENERATED'
  | 'PURCHASE_INVOICE_APPROVED'
  | 'ROAD_BOOKING_CREATED'
  | 'DOCKET_ENTERED'
  | 'TRACK_SHIPMENT_CLICKED'
  | 'EXCEL_UPLOADED'
  | 'DUPLICATE_INVOICE';

export function triggerAutomation(event: AutomationEvent, context?: Record<string, string>) {
  switch (event) {
    case 'AWB_EXECUTED':
      toast.success("⚡ Automation: Signed AWB PDF emailed to customer", { duration: 4000 });
      setTimeout(() => {
        toast.info("⚡ Automation: Sales & Purchase Invoices auto-updated with AWB data", { duration: 4000 });
      }, 1500);
      break;

    case 'DELIVERY_COMPLETED_POD':
      toast.success("⚡ Automation: POD email sent to customer", { duration: 4000 });
      setTimeout(() => {
        toast.info("⚡ Automation: LR status closed automatically", { duration: 4000 });
      }, 1500);
      break;

    case 'SALES_INVOICE_GENERATED':
      toast.info("⚡ Automation: Customer balance/ledger updated", { duration: 4000 });
      break;

    case 'PURCHASE_INVOICE_APPROVED':
      toast.info("⚡ Automation: Vendor ledger updated", { duration: 4000 });
      setTimeout(() => {
        toast.success("⚡ Automation: Payment queue notified", { duration: 4000 });
      }, 1500);
      break;

    case 'ROAD_BOOKING_CREATED':
      toast.success(`⚡ Automation: GPS tracking session initiated for vehicle ${context?.vehicleNo || ''}`, { duration: 4000 });
      break;

    case 'DOCKET_ENTERED':
      // This is handled by the GlobalSmartSearch component directly
      break;

    case 'TRACK_SHIPMENT_CLICKED':
      toast.info(`⚡ Automation: Identified airline from AWB prefix → opening official tracking`, { duration: 4000 });
      break;

    case 'EXCEL_UPLOADED':
      toast.info("⚡ Automation: Validating all rows... showing pass/fail preview", { duration: 4000 });
      break;

    case 'DUPLICATE_INVOICE':
      toast.warning("⚡ Automation: Duplicate invoice detected! Prompting to skip or overwrite.", { duration: 5000 });
      break;
  }
}
