'use client';

export async function downloadInvoicePDF(invoiceId: string, invoiceNumber: number, customerName: string) {
  const { default: html2canvas } = await import('html2canvas');
  const { jsPDF } = await import('jspdf');

  const element = document.getElementById('invoice-print-area');
  if (!element) {
    console.error('Invoice print area not found');
    return;
  }

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      logging: false,
    } as any);

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');

    // The HTML element is exactly 210×297mm so we fill the entire page 1:1
    const pageWidth = pdf.internal.pageSize.getWidth();   // 210
    const pageHeight = pdf.internal.pageSize.getHeight(); // 297

    pdf.addImage(imgData, 'PNG', 0, 0, pageWidth, pageHeight);

    const safeName = customerName.replace(/[^a-z0-9]/gi, '-').toLowerCase();
    pdf.save(`Invoice-${invoiceNumber}-${safeName}.pdf`);
  } catch (err) {
    console.error('PDF generation failed:', err);
    throw err;
  }
}
