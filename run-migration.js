#!/usr/bin/env node

/**
 * Migration Script: Add company_name column to invoices table
 * 
 * This script will run the migration using your Supabase service role key.
 * 
 * Usage:
 *   node run-migration.js
 * 
 * The script will look for SUPABASE_SERVICE_ROLE_KEY in .env.local
 * If not found, it will provide instructions to run the migration manually.
 */

const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Load environment variables
const envPath = path.join(__dirname, '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');

// Parse env vars
const envVars = {};
envContent.split('\n').forEach(line => {
  const trimmed = line.trim();
  if (trimmed && !trimmed.startsWith('#')) {
    const [key, ...valueParts] = trimmed.split('=');
    if (key) {
      envVars[key.trim()] = valueParts.join('=').trim();
    }
  }
});

const supabaseUrl = envVars.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = envVars.SUPABASE_SERVICE_ROLE_KEY;

console.log('🚀 Migration Script: Add company_name column\n');
console.log(`📍 Supabase URL: ${supabaseUrl}\n`);

if (!supabaseUrl) {
  console.error('❌ Error: NEXT_PUBLIC_SUPABASE_URL not found in .env.local');
  process.exit(1);
}

if (!serviceRoleKey) {
  console.log('⚠️  SUPABASE_SERVICE_ROLE_KEY not found in .env.local\n');
  console.log('To run the migration automatically, add your service role key to .env.local:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/faxnznbpenymerytgdhv/settings/api');
  console.log('2. Copy the "service_role" key (not the anon/public key)');
  console.log('3. Add to .env.local:');
  console.log('   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here\n');
  console.log('4. Run this script again: node run-migration.js\n');
  console.log('═══════════════════════════════════════════════════════════\n');
  console.log('OR run the migration manually in Supabase SQL Editor:\n');
  console.log('1. Go to: https://supabase.com/dashboard/project/faxnznbpenymerytgdhv/editor');
  console.log('2. Click "SQL Editor" → "New Query"');
  console.log('3. Paste and run:\n');
  console.log('   ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;');
  console.log('   COMMENT ON COLUMN invoices.company_name IS \'Optional company name for business customers\';\n');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, serviceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function runMigration() {
  try {
    console.log('📝 Executing migration SQL...\n');

    // Run the ALTER TABLE command
    const { data, error } = await supabase.rpc('exec_sql', {
      query: 'ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;'
    });

    if (error) {
      // If RPC doesn't exist, we need to use REST API directly
      console.log('ℹ️  Direct RPC not available. Using REST API...\n');
      
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/query`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceRoleKey,
          'Authorization': `Bearer ${serviceRoleKey}`
        },
        body: JSON.stringify({
          query: `
            ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;
            COMMENT ON COLUMN invoices.company_name IS 'Optional company name for business customers';
          `
        })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
    }

    console.log('✅ Migration completed successfully!\n');
    console.log('The company_name column has been added to the invoices table.\n');
    console.log('You can now run: npm run dev');
    
  } catch (error) {
    console.error('❌ Migration failed:', error.message);
    console.log('\n💡 Please run the migration manually in Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/faxnznbpenymerytgdhv/editor\n');
    console.log('   Paste and run:');
    console.log('   ALTER TABLE invoices ADD COLUMN IF NOT EXISTS company_name text;\n');
    process.exit(1);
  }
}

runMigration();
