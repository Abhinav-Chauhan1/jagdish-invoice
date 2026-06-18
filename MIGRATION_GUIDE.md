# Migration Guide: Add Company Name Field

This guide will help you add the optional `company_name` field to your invoices table.

## Option 1: Using Supabase Dashboard (Recommended - Easiest)

1. Go to your Supabase project dashboard: https://supabase.com/dashboard
2. Navigate to your project
3. Click on **SQL Editor** in the left sidebar
4. Click **New Query**
5. Copy and paste the contents of `supabase/migration_add_company_name.sql`
6. Click **Run** to execute the migration

## Option 2: Using Supabase CLI (For automated deployments)

If you have Supabase CLI installed:

```bash
# Install Supabase CLI if not already installed
npm install -g supabase

# Link your project (one-time setup)
supabase link --project-ref YOUR_PROJECT_REF

# Run the migration
supabase db push
```

## Option 3: Manual SQL Execution

If you prefer, you can run this SQL directly in any PostgreSQL client:

```sql
-- Add the company_name column (nullable, optional field)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;

-- Optional: Add a comment to document the field
COMMENT ON COLUMN invoices.company_name IS 'Optional company name for business customers';
```

## Verification

After running the migration, verify it worked by:

1. Going to **Table Editor** in Supabase Dashboard
2. Select the `invoices` table
3. You should see a new `company_name` column

## What Changed

The following files have been updated to support the optional company name field:

- ✅ Database schema (`supabase/schema.sql`)
- ✅ TypeScript types (`types/invoice.ts`)
- ✅ Customer form (`components/invoice-form/StepCustomer.tsx`)
- ✅ Review step (`components/invoice-form/StepReview.tsx`)
- ✅ Invoice preview (`components/InvoicePreview.tsx`)
- ✅ Invoice list page (`app/invoices/page.tsx`)
- ✅ New invoice page (`app/invoices/new/page.tsx`)

## Testing

After running the migration:

1. Start the dev server: `npm run dev`
2. Create a new invoice at http://localhost:3000/invoices/new
3. You should see the "Company Name" field above "Customer Name"
4. Fill it in (optional) and complete the invoice
5. The company name will appear on the invoice and in the list view

## Rollback (if needed)

If you need to remove the company_name field:

```sql
ALTER TABLE invoices DROP COLUMN IF EXISTS company_name;
```
