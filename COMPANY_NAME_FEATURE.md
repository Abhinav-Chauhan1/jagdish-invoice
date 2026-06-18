# Company Name Feature

## Overview
Added an optional "Company Name" field above the Customer Name throughout the invoice application.

## Changes Made

### 1. Database Schema (`supabase/schema.sql`)
- Added `company_name text` column to the `invoices` table (nullable/optional)

### 2. TypeScript Types (`types/invoice.ts`)
- Added `company_name?: string` to the `Invoice` interface
- Added `company_name: string` to the `InvoiceFormData` interface

### 3. Customer Form (`components/invoice-form/StepCustomer.tsx`)
- Added "Company Name" input field at the top (before Customer Name)
- Field is optional with placeholder text "Enter company name (optional)"

### 4. Invoice Preview (`components/InvoicePreview.tsx`)
- Added company name display in the Customer Details section
- Shows above customer name in blue color (#1a56c4) when present
- Only displays if company_name is provided

### 5. Review Step (`components/invoice-form/StepReview.tsx`)
- Added company name display in the customer details review section
- Shows conditionally when company_name is filled

### 6. New Invoice Page (`app/invoices/new/page.tsx`)
- Added `company_name: ''` to the default form data
- Updated the save handler to include company_name in the database insert

### 7. Invoice List Page (`app/invoices/page.tsx`)
- Added company name display in the invoice list cards (shown in blue above customer name)
- Updated search functionality to include company_name in search queries
- Updated placeholder text to "Search by company, name or mobile..."

### 8. Database Migration (`supabase/migration_add_company_name.sql`)
- Created migration script to add the company_name column to existing databases

## Database Migration

To apply this change to your Supabase database, run the following SQL:

```sql
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;
COMMENT ON COLUMN invoices.company_name IS 'Optional company name for business customers';
```

Or use the provided migration file: `supabase/migration_add_company_name.sql`

## UI Behavior

- **Form Entry**: Company name field appears first in the customer details step, but is optional
- **Validation**: Company name is NOT required - only customer name and mobile are mandatory
- **Display**: When company name is provided:
  - Shows in blue color above customer name in the printed invoice
  - Shows in the review step
  - Shows in the invoice list
  - Shows in the invoice detail page
- **Search**: Can search for invoices by company name in the invoice list

## Testing Checklist

- [ ] Create new invoice with company name
- [ ] Create new invoice without company name
- [ ] View invoice with company name in list
- [ ] View invoice without company name in list
- [ ] Search by company name
- [ ] Preview invoice with company name
- [ ] Generate PDF with company name
- [ ] Share via WhatsApp with company name
