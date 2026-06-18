export interface Invoice {
  id: string;
  invoice_number: number;
  company_name?: string;
  customer_name: string;
  customer_mobile: string;
  invoice_date: string;
  order_date: string;
  delivery_date: string | null;
  discount: number;
  gross_total: number;
  net_total: number;
  has_prescription: boolean;
  created_at: string;
}

export interface InvoiceItem {
  id: string;
  invoice_id: string;
  sl_no: number;
  product_details: string;
  price: number;
}

export interface Prescription {
  id: string;
  invoice_id: string;
  // Right Eye (OD)
  od_dv_sph: string | null;
  od_dv_cyl: string | null;
  od_dv_axis: string | null;
  od_dv_pd: string | null;
  od_dv_va: string | null;
  od_nv_sph: string | null;
  od_nv_cyl: string | null;
  od_nv_axis: string | null;
  od_nv_pd: string | null;
  od_nv_va: string | null;
  od_aod: string | null;
  od_iod: string | null;
  // Left Eye (OS)
  os_dv_sph: string | null;
  os_dv_cyl: string | null;
  os_dv_axis: string | null;
  os_dv_pd: string | null;
  os_dv_va: string | null;
  os_nv_sph: string | null;
  os_nv_cyl: string | null;
  os_nv_axis: string | null;
  os_nv_pd: string | null;
  os_nv_va: string | null;
  os_aod: string | null;
  os_iod: string | null;
  constant_use: boolean;
}

export interface InvoiceWithItems extends Invoice {
  invoice_items: InvoiceItem[];
  prescriptions: Prescription | null;
}

export interface InvoiceFormData {
  company_name: string;
  customer_name: string;
  customer_mobile: string;
  invoice_date: string;
  order_date: string;
  delivery_date: string;
  invoice_number: number;
  items: InvoiceItemFormData[];
  discount: number;
  has_prescription: boolean;
  prescription: PrescriptionFormData;
}

export interface InvoiceItemFormData {
  id: string;
  sl_no: number;
  product_details: string;
  price: string;
}

export interface PrescriptionFormData {
  od_dv_sph: string;
  od_dv_cyl: string;
  od_dv_axis: string;
  od_dv_pd: string;
  od_dv_va: string;
  od_nv_sph: string;
  od_nv_cyl: string;
  od_nv_axis: string;
  od_nv_pd: string;
  od_nv_va: string;
  od_aod: string;
  od_iod: string;
  os_dv_sph: string;
  os_dv_cyl: string;
  os_dv_axis: string;
  os_dv_pd: string;
  os_dv_va: string;
  os_nv_sph: string;
  os_nv_cyl: string;
  os_nv_axis: string;
  os_nv_pd: string;
  os_nv_va: string;
  os_aod: string;
  os_iod: string;
  constant_use: boolean;
}
