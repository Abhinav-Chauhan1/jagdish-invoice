'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, MessageCircle, Trash2 } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { downloadInvoicePDF, shareInvoicePDF } from '@/lib/pdf';
import { InvoicePreview } from '@/components/InvoicePreview';
import { InvoiceScaleWrapper } from '@/components/InvoiceScaleWrapper';
import { InvoicePDFButton } from '@/components/InvoicePDFButton';
import { ConfirmDialog } from '@/components/ui/ConfirmDialog';
import { useToast } from '@/components/ui/Toast';
import type { InvoiceWithItems } from '@/types/invoice';

export default function InvoiceDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { showToast } = useToast();
  const [invoice, setInvoice] = useState<InvoiceWithItems | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    async function load() {
      try {
        const { data, error: err } = await supabase
          .from('invoices')
          .select(`
            *,
            invoice_items (*),
            prescriptions (*)
          `)
          .eq('id', id)
          .single();

        if (err) throw err;

        // Supabase returns prescriptions as a single object (unique FK) or array — handle both
        const rx = data.prescriptions;
        setInvoice({
          ...data,
          prescriptions: Array.isArray(rx) ? (rx[0] ?? null) : (rx ?? null),
        });
      } catch (e) {
        console.error(e);
        setError('Invoice not found or could not be loaded.');
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleDelete() {
    setDeleting(true);
    try {
      const { error: err } = await supabase.from('invoices').delete().eq('id', id);
      if (err) throw err;
      showToast('Invoice deleted', 'success');
      router.push('/invoices');
    } catch (e) {
      console.error(e);
      showToast('Could not delete invoice. Try again.', 'error');
      setDeleting(false);
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-4 border-[#C0392B] border-t-transparent rounded-full animate-spin" />
          <p className="text-sm text-gray-500">Loading invoice...</p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-4 px-6">
        <div className="text-5xl">😕</div>
        <p className="text-base font-bold text-gray-700">{error || 'Invoice not found'}</p>
        <Link href="/invoices" className="h-12 px-6 rounded-xl bg-[#C0392B] text-white font-bold text-sm flex items-center">
          Back to Invoices
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10 no-print">
        <div className="flex items-center gap-3">
          <Link href="/invoices" className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1">
            <h1 className="text-base font-black text-gray-900">Invoice #{invoice.invoice_number}</h1>
            <p className="text-xs text-gray-500">{invoice.customer_name}</p>
          </div>
          <button
            onClick={() => setDeleteOpen(true)}
            className="h-10 w-10 flex items-center justify-center rounded-xl text-red-500 bg-red-50"
          >
            <Trash2 size={18} />
          </button>
        </div>
      </div>

      {/* Invoice preview — scales to fit any screen width */}
      <div className="py-4 px-3">
        <InvoiceScaleWrapper>
          <InvoicePreview invoice={invoice} />
        </InvoiceScaleWrapper>
      </div>

      {/* Action bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-xl p-4 no-print">
        <div className="flex gap-3 max-w-lg mx-auto">
          <InvoicePDFButton
            invoiceId={invoice.id}
            invoiceNumber={invoice.invoice_number}
            customerName={invoice.customer_name}
            className="flex-1 h-12 rounded-xl bg-[#C0392B] text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          />
          <button
            onClick={async () => {
              setSharing(true);
              try {
                await shareInvoicePDF(invoice.invoice_number, invoice.customer_name);
              } catch {
                showToast('Could not share. Try downloading instead.', 'error');
              } finally {
                setSharing(false);
              }
            }}
            disabled={sharing}
            className="flex-1 h-12 rounded-xl bg-green-500 text-white font-bold text-sm flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle size={18} />
            {sharing ? 'Preparing...' : 'WhatsApp'}
          </button>
        </div>
      </div>

      {/* Bottom padding for action bar */}
      <div className="h-24" />

      <ConfirmDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        title="Delete Invoice?"
        description={`This will permanently delete Invoice #${invoice.invoice_number} for ${invoice.customer_name}. This action cannot be undone.`}
        confirmLabel={deleting ? 'Deleting...' : 'Delete'}
        cancelLabel="Cancel"
        onConfirm={handleDelete}
        destructive
      />
    </div>
  );
}
