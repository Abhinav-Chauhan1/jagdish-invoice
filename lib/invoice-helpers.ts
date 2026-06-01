import { supabase } from './supabase';
import type { InvoiceItemFormData } from '@/types/invoice';

export async function getNextInvoiceNumber(): Promise<number> {
  const { data, error } = await supabase
    .from('invoices')
    .select('invoice_number')
    .order('invoice_number', { ascending: false })
    .limit(1)
    .single();

  if (error || !data) return 1;
  return data.invoice_number + 1;
}

export function calculateTotals(items: InvoiceItemFormData[], discount: number) {
  const grossTotal = items.reduce((sum, item) => {
    const price = parseFloat(item.price) || 0;
    return sum + price;
  }, 0);
  const netTotal = Math.max(0, grossTotal - discount);
  return { grossTotal, netTotal };
}

export function formatCurrency(amount: number): string {
  return `Rs ${amount.toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

export function formatDate(dateStr: string): string {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
}

export function getDefaultDeliveryDate(): string {
  const date = new Date();
  date.setDate(date.getDate() + 3);
  return date.toISOString().split('T')[0];
}

export function getTodayString(): string {
  return new Date().toISOString().split('T')[0];
}

export function shareOnWhatsApp(invoiceNumber: number, customerName: string, netTotal: number, invoiceDate: string) {
  const message = `*Jagdish Sharan & Sons*\nInvoice #${invoiceNumber}\nCustomer: ${customerName}\nAmount: Rs ${netTotal.toFixed(2)}\nDate: ${formatDate(invoiceDate)}\n\nThank you for your purchase! 🙏`;
  const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
  window.open(url, '_blank');
}

const DRAFT_KEY = 'invoice_draft';

export function saveDraft(data: object) {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(data));
  } catch {}
}

export function loadDraft<T>(): T | null {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function clearDraft() {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {}
}
