'use client';

import { InvoicePreview } from './InvoicePreview';
import type { InvoiceWithItems } from '@/types/invoice';

interface Props {
  invoice: InvoiceWithItems;
}

// Renders InvoicePreview hidden but fully in-flow so html2canvas captures it
// cleanly — no CSS transforms, no off-screen positioning that breaks mobile.
export function HiddenPDFPreview({ invoice }: Props) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        width: 0,
        height: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: -1,
      }}
    >
      {/* Full-size, untransformed A4 invoice — the only element with id=invoice-print-area */}
      <InvoicePreview invoice={invoice} id="invoice-print-area" />
    </div>
  );
}
