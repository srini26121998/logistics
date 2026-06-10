# Implementation Plan: Logistics Tracking, Smart-Search, and Automation

Based on the detailed requirements provided in the specifications, here is the structured plan to implement the GPS tracking, Airline Smart Search, and Automation workflows.

## Phase 1: Core Data & Configuration Modeling
**Objective:** Extend the current mock system to support tracking, airline mappings, and connected document relationships.
- **Airline Tracking Settings:** Create a configurable mock settings table for Supported Airlines (IndiGo `6E-`, Air India `AI-`, SpiceJet `SG-`, Vistara `UK-`, Air India Express `IX-`) and their URL patterns.
- **Relational Data Mapping:** Update `mockData.ts` to ensure AWB records, LRs, Bookings, Sales Invoices, and Purchase Invoices are relationally linked so that a single AWB/Docket search can fetch all related documents.
- **GPS & Milestone Mock Data:** Add mock coordinates, planned vs. actual route points, and milestone logs (Pickup Confirmed, In Transit, Near Destination, Delivered, Delay, Route Deviation).

## Phase 2: Global Smart-Search (Docket to Document Suggestions)
**Objective:** Implement the real-time typeahead search (Section 5.5.1).
- **Component:** `src/components/GlobalSmartSearch.tsx` (to be placed in the top navigation bar).
- **Functionality:** 
  - Activate typeahead after a minimum of 3 characters.
  - Query linked documents (AWB, LR, Booking, Manifest, Sales/Purchase Invoices) dynamically.
  - Display dropdown results with document type tags/badges, reference numbers, and a one-line summary.
  - Implement direct navigation (onClick) to the specific record detail page without losing current state.

## Phase 3: Airline-Specific Tracking & Redirect Flow
**Objective:** Implement the AWB tracking redirect logic (Sections 5.5.2 & 5.5.3).
- **Utility Logic:** `src/utils/airlineTracker.ts` to extract the AWB prefix (e.g., `6E-`), match it against the config, and inject the actual AWB number into the `{AWB}` placeholder.
- **UI Integration:** Add a "Track Shipment" button on AWB detail panels and tracking pages.
- **Action:** Open the official cargo tracking page in a new tab automatically.
- **Fallback:** If the airline is unrecognized (N/A), display a warning modal ("Airline not configured. Please contact Admin") and provide a manual entry option.

## Phase 4: Road Shipment GPS Tracking & Map Visuals
**Objective:** Implement live tracking features for Road freight (Sections 5.1, 5.2 & 5.3).
- **Internal Ops Dashboard (`/ops/tracking`):** Create an interactive map showing real-time locations of active road shipments, route paths (planned vs actual), ETA, and alerts (geo-fence, speed, idle).
- **Customer Tracking Portal (`/track/[awb]`):** Enhance the existing customer page to display the live map, location history log (playback mode), and milestone timelines using LR/Docket numbers.
- **Milestone Engine:** Build UI components to reflect the triggers outlined in Section 5.4 (e.g., "Near Destination" triggering when within a defined radius).

## Phase 5: Automation & Integration Rules Engine
**Objective:** Implement system-wide automatic triggers to reduce manual effort (Section 6).
- **Automation Service:** Implement a frontend state/toast simulation engine (`src/hooks/useAutomationRules.ts`) that listens to key user actions:
  - *AWB Executed:* Simulate sending signed PDF via email and auto-update related Invoices.
  - *Delivery Completed + POD:* Simulate sending POD email and auto-close the LR status.
  - *Invoice Events:* Simulate vendor/customer ledger updates upon generation/approval.
  - *Bulk Uploads:* Simulate Excel invoice validation (pass/fail preview) and duplicate warnings (skip/overwrite prompts).

## Execution Strategy
To ensure a fully connected dynamic flow:
1. We will start with **Phase 1 & 2** (Data + Smart Search) as it establishes the core navigation backbone.
2. Next, **Phase 3** (Airline Redirect) which is isolated but critical for air freight.
3. Then, **Phase 4** (Road GPS) requiring map component simulations.
4. Finally, **Phase 5** (Automation) binding the entire workflow together with simulated side-effects.

Please confirm if this plan accurately captures your requirements from the images, and if we should begin developing Phase 1 and 2!
