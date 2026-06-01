-- Jagdish Sharan & Sons — Invoice Database Schema

-- Auto invoice number sequence
create sequence if not exists invoice_number_seq start 1;

-- Invoices table
create table if not exists invoices (
  id uuid default gen_random_uuid() primary key,
  invoice_number integer not null unique,
  customer_name text not null,
  customer_mobile text not null,
  invoice_date date not null default current_date,
  order_date date not null default current_date,
  delivery_date date,
  discount numeric(10,2) default 0,
  gross_total numeric(10,2) not null default 0,
  net_total numeric(10,2) not null default 0,
  has_prescription boolean default false,
  created_at timestamptz default now()
);

-- Invoice items table
create table if not exists invoice_items (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade,
  sl_no integer not null,
  product_details text not null,
  price numeric(10,2) not null
);

-- Prescriptions table
create table if not exists prescriptions (
  id uuid default gen_random_uuid() primary key,
  invoice_id uuid references invoices(id) on delete cascade unique,
  -- Right Eye (OD)
  od_dv_sph text, od_dv_cyl text, od_dv_axis text, od_dv_pd text, od_dv_va text,
  od_nv_sph text, od_nv_cyl text, od_nv_axis text, od_nv_pd text, od_nv_va text,
  od_aod text,
  od_iod text,
  -- Left Eye (OS)
  os_dv_sph text, os_dv_cyl text, os_dv_axis text, os_dv_pd text, os_dv_va text,
  os_nv_sph text, os_nv_cyl text, os_nv_axis text, os_nv_pd text, os_nv_va text,
  os_aod text,
  os_iod text,
  constant_use boolean default false
);

-- Disable RLS for now (enable when auth is added)
alter table invoices disable row level security;
alter table invoice_items disable row level security;
alter table prescriptions disable row level security;
