-- Migration: Add company_name column to invoices table
-- Run this on your Supabase database to add the optional company_name field

-- Add the company_name column (nullable, optional field)
ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;

-- Optional: Add a comment to document the field
COMMENT ON COLUMN invoices.company_name IS 'Optional company name for business customers';
