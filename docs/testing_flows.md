Here are the comprehensive testing flows for the new modules:

### ✅ Positive Testing Flow (Happy Path)

1. **Vendor Master Registration**:
   - Navigate to `/ops/vendors` and click "New Vendor".
   - Fill in valid details (Name, GST, Category, Bank Details).
   - Save and verify the vendor appears in the Active Vendor list.
2. **Purchase Invoice - Manual Entry**:
   - Navigate to `/ops/purchase-invoices` and click "New Invoice".
   - Select the newly created vendor from the dropdown/input.
   - Enter Base Amount (e.g., 1000) and GST % (e.g., 18).
   - **Verification**: Ensure GST Amount auto-calculates to 180 and Total Amount to 1180.
   - Save and verify it appears in the dashboard with "Received" status.
3. **Purchase Invoice - Bulk Excel Import**:
   - Click "Import from Excel" and "Download Template".
   - Populate the template with 3 valid rows (including correct Date formats and valid Vendor names).
   - Upload the file.
   - **Verification**: The preview table should show 3 rows with a "Valid" status.
   - Click "Confirm Import" and verify all 3 appear in the dashboard.
4. **Connecting Flow - Approval to Ledger**:
   - Select an invoice in the dashboard and progress its status from "Received" -> "Approved" -> "Paid".
   - Navigate to the Vendor's Profile/Ledger and verify the paid invoice is recorded in their transaction history.

### ❌ Negative Testing Flow (Error Handling)

1. **Vendor Validation**:
   - Attempt to save a Vendor without mandatory fields (Name, GST).
   - **Verification**: System should block submission and highlight missing fields in red.
2. **Purchase Invoice Validation**:
   - In manual entry, attempt to use a Vendor Name that does not exist in the Vendor Master.
   - **Verification**: Form should show an error: "Unrecognized Vendor".
   - Enter alphabetical characters in numeric fields (Base Amount). 
   - **Verification**: Form should reject input or show a validation error.
3. **Bulk Import Error Handling**:
   - Upload an Excel file missing a required column (e.g., Origin) and containing an invalid date format (e.g., 2026-06-05 instead of DD/MM/YYYY).
   - **Verification**: The preview table must flag specific cells/rows with errors and disable the "Confirm Import" button for those rows.
4. **Duplicate Import Prevention**:
   - Re-upload the exact same Excel file from the positive test.
   - **Verification**: System must identify the duplicate `Invoice Number` + `Vendor Name` combination and trigger a warning modal asking to "Skip" or "Overwrite".

I will now begin developing **Phase 1: Vendor Management** and **Phase 2: Purchase Invoices** based on this plan.
