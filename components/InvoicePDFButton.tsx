'use client';

import { useState } from 'react';
import { Download } from 'lucide-react';
import { downloadInvoicePDF } from '@/lib/pdf';

interface InvoicePDFButtonProps {
  invoiceId: string;
  invoiceNumber: number;
  customerName: string;
  className?: string;
}

export function InvoicePDFButton({ invoiceId, invoiceNumber, customerName, className }: InvoicePDFButtonProps) {
  const [loading, setLoading] = useState(false);

  const handleDownload = async () => {
    setLoading(true);
    try {
      await downloadInvoicePDF(invoiceId, invoiceNumber, customerName);
    } catch {
      alert('PDF generation failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleDownload}
      disabled={loading}
      className={className ?? 'flex items-center gap-2 h-12 px-5 rounded-xl bg-[#C0392B] text-white font-semibold text-sm disabled:opacity-60'}
    >
      <Download size={18} />
      {loading ? 'Generating...' : 'Download PDF'}
    </button>
  );
}
