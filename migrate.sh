#!/bin/bash

# Migration Script: Add company_name column to invoices table
# This script provides easy ways to run the migration

echo "🚀 Migration Script: Add company_name column"
echo ""

# Extract project ID from Supabase URL
SUPABASE_URL=$(grep NEXT_PUBLIC_SUPABASE_URL .env.local | cut -d'=' -f2)
PROJECT_ID=$(echo $SUPABASE_URL | sed 's/https:\/\/\(.*\)\.supabase\.co/\1/')

echo "📍 Project: $PROJECT_ID"
echo ""

# Check if service role key exists
if grep -q "SUPABASE_SERVICE_ROLE_KEY" .env.local; then
    echo "✅ Service role key found in .env.local"
    echo ""
    echo "Running migration via Node.js script..."
    node run-migration.js
else
    echo "⚠️  Service role key not found in .env.local"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "Option 1: Add service role key (Recommended for automation)"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "1. Get your service role key:"
    echo "   https://supabase.com/dashboard/project/$PROJECT_ID/settings/api"
    echo ""
    echo "2. Add to .env.local:"
    echo "   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here"
    echo ""
    echo "3. Run this script again: ./migrate.sh"
    echo ""
    echo "═══════════════════════════════════════════════════════════"
    echo "Option 2: Use Supabase SQL Editor (Easiest - 30 seconds)"
    echo "═══════════════════════════════════════════════════════════"
    echo ""
    echo "1. Open: https://supabase.com/dashboard/project/$PROJECT_ID/editor"
    echo "2. Click 'SQL Editor' → 'New Query'"
    echo "3. Copy and paste:"
    echo ""
    cat supabase/migration_add_company_name.sql
    echo ""
    echo "4. Click 'Run' ▶️"
    echo ""
fi
