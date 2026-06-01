import { supabaseServer as supabase } from '@/lib/supabase-server';
import { InvoicePreview } from '@/components/InvoicePreview';
import type { InvoiceWithItems } from '@/types/invoice';

export const dynamic = 'force-dynamic';

export default async function PrintPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const { data, error } = await supabase
    .from('invoices')
    .select(`
      *,
      invoice_items (*),
      prescriptions (*)
    `)
    .eq('id', id)
    .single();

  if (error || !data) {
    return (
      <div style={{ padding: '20px', fontFamily: 'Arial' }}>
        <p>Invoice not found.</p>
      </div>
    );
  }

  const rx = data.prescriptions;
  const invoice: InvoiceWithItems = {
    ...data,
    prescriptions: Array.isArray(rx) ? (rx[0] ?? null) : (rx ?? null),
  };

  return (
    <div style={{ margin: 0, padding: 0, background: 'white' }}>
      <link
        href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;700;900&display=swap"
        rel="stylesheet"
      />
      <InvoicePreview invoice={invoice} />
    </div>
  );
}
