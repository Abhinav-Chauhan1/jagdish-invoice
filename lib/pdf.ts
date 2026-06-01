'use client';

async function buildPDFBlob(invoiceNumber: number, customerName: string): Promise<{ blob: Blob; fileName: string }> {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const element = document.getElementById('invoice-print-area');
  if (!element) throw new Error('Invoice print area not found');

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const canvas = await html2canvas(element, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
    backgroundColor: '#ffffff',
    logging: false,
    // Tell html2canvas the exact element size so mobile viewport/DPR doesn't confuse it
    width: element.offsetWidth,
    height: element.offsetHeight,
    windowWidth: element.offsetWidth,
    windowHeight: element.offsetHeight,
    scrollX: 0,
    scrollY: 0,
  } as any);

  const imgData = canvas.toDataURL('image/png');
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth  = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();
  pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

  const safeName = customerName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
  const fileName = `Invoice-${invoiceNumber}-${safeName}.pdf`;
  const blob = pdf.output('blob');
  return { blob, fileName };
}

export async function downloadInvoicePDF(_invoiceId: string, invoiceNumber: number, customerName: string) {
  const { blob, fileName } = await buildPDFBlob(invoiceNumber, customerName);
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = fileName;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export async function shareInvoicePDF(invoiceNumber: number, customerName: string): Promise<void> {
  const { blob, fileName } = await buildPDFBlob(invoiceNumber, customerName);
  const file = new File([blob], fileName, { type: 'application/pdf' });

  if (navigator.canShare && navigator.canShare({ files: [file] })) {
    await navigator.share({
      files: [file],
      title: `Invoice #${invoiceNumber} — Jagdish Sharan & Sons`,
      text: `Invoice #${invoiceNumber} for ${customerName}`,
    });
  } else {
    // Fallback: download the PDF (user can manually send via WhatsApp)
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = fileName;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('PDF downloaded. Please share it manually via WhatsApp.');
  }
}
