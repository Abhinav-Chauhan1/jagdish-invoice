'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, MessageCircle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import {
  getNextInvoiceNumber,
  calculateTotals,
  getTodayString,
  getDefaultDeliveryDate,
  saveDraft,
  loadDraft,
  clearDraft,
} from '@/lib/invoice-helpers';
import { downloadInvoicePDF, shareInvoicePDF } from '@/lib/pdf';
import { useToast } from '@/components/ui/Toast';
import { StepCustomer } from '@/components/invoice-form/StepCustomer';
import { StepItems } from '@/components/invoice-form/StepItems';
import { StepPrescription } from '@/components/invoice-form/StepPrescription';
import { StepReview } from '@/components/invoice-form/StepReview';
import { HiddenPDFPreview } from '@/components/HiddenPDFPreview';
import type { InvoiceFormData, InvoiceWithItems } from '@/types/invoice';

const STEP_LABELS = ['Customer', 'Products', 'Prescription', 'Review'];

function emptyPrescription() {
  return {
    od_dv_sph: '', od_dv_cyl: '', od_dv_axis: '', od_dv_pd: '', od_dv_va: '',
    od_nv_sph: '', od_nv_cyl: '', od_nv_axis: '', od_nv_pd: '', od_nv_va: '',
    od_aod: '', od_iod: '',
    os_dv_sph: '', os_dv_cyl: '', os_dv_axis: '', os_dv_pd: '', os_dv_va: '',
    os_nv_sph: '', os_nv_cyl: '', os_nv_axis: '', os_nv_pd: '', os_nv_va: '',
    os_aod: '', os_iod: '',
    constant_use: false,
  };
}

function defaultFormData(): InvoiceFormData {
  return {
    company_name: '',
    customer_name: '',
    customer_mobile: '',
    invoice_date: getTodayString(),
    order_date: getTodayString(),
    delivery_date: getDefaultDeliveryDate(),
    invoice_number: 1,
    items: [{ id: Math.random().toString(36).slice(2), sl_no: 1, product_details: '', price: '' }],
    discount: 0,
    has_prescription: false,
    prescription: emptyPrescription(),
  };
}

export default function NewInvoicePage() {
  const { showToast } = useToast();
  const [step, setStep] = useState(0);
  const [form, setForm] = useState<InvoiceFormData>(defaultFormData);
  const [saving, setSaving] = useState(false);
  const [savedInvoice, setSavedInvoice] = useState<InvoiceWithItems | null>(null);
  const [pdfLoading, setPdfLoading] = useState(false);
  const [sharing, setSharing] = useState(false);

  useEffect(() => {
    async function init() {
      const nextNum = await getNextInvoiceNumber();
      const draft = loadDraft<InvoiceFormData>();
      if (draft) {
        setForm({ ...draft, invoice_number: nextNum });
      } else {
        setForm(prev => ({ ...prev, invoice_number: nextNum }));
      }
    }
    init();
  }, []);

  useEffect(() => { saveDraft(form); }, [form]);

  function updateForm(updates: Partial<InvoiceFormData>) {
    setForm(prev => ({ ...prev, ...updates }));
  }

  async function handleSave() {
    setSaving(true);
    try {
      const { grossTotal, netTotal } = calculateTotals(form.items, form.discount);

      const { data: invoice, error: invError } = await supabase
        .from('invoices')
        .insert({
          invoice_number: form.invoice_number,
          company_name: form.company_name.trim() || null,
          customer_name: form.customer_name.trim(),
          customer_mobile: form.customer_mobile.trim(),
          invoice_date: form.invoice_date,
          order_date: form.order_date,
          delivery_date: form.delivery_date || null,
          discount: form.discount,
          gross_total: grossTotal,
          net_total: netTotal,
          has_prescription: form.has_prescription,
        })
        .select()
        .single();

      if (invError) throw invError;

      const itemsToInsert = form.items
        .filter(item => item.product_details.trim())
        .map((item, idx) => ({
          invoice_id: invoice.id,
          sl_no: idx + 1,
          product_details: item.product_details.trim(),
          price: parseFloat(item.price) || 0,
        }));

      if (itemsToInsert.length > 0) {
        const { error: itemsError } = await supabase.from('invoice_items').insert(itemsToInsert);
        if (itemsError) throw itemsError;
      }

      let rxRecord = null;
      if (form.has_prescription) {
        const rxPayload = {
          invoice_id: invoice.id,
          ...Object.fromEntries(
            Object.entries(form.prescription).map(([k, v]) => [k, v === '' ? null : v])
          ),
        };
        const { data: rxData, error: rxError } = await supabase
          .from('prescriptions')
          .insert(rxPayload)
          .select()
          .single();
        if (rxError) throw rxError;
        rxRecord = rxData;
      }

      clearDraft();

      // Build full InvoiceWithItems so InvoicePreview can render for PDF
      const full: InvoiceWithItems = {
        ...invoice,
        invoice_items: itemsToInsert.map((it, i) => ({
          id: `local-${i}`,
          invoice_id: invoice.id,
          sl_no: it.sl_no,
          product_details: it.product_details,
          price: it.price,
        })),
        prescriptions: rxRecord,
      };

      setSavedInvoice(full);
      showToast('Invoice saved successfully!', 'success');
    } catch (e) {
      console.error(e);
      showToast('Kuch galat hua, dobara try karein', 'error');
    } finally {
      setSaving(false);
    }
  }

  async function handleDownloadPDF() {
    if (!savedInvoice) return;
    setPdfLoading(true);
    try {
      await downloadInvoicePDF(savedInvoice.id, savedInvoice.invoice_number, savedInvoice.customer_name);
    } catch {
      showToast('PDF generation failed. Please try again.', 'error');
    } finally {
      setPdfLoading(false);
    }
  }

  // ── Success screen ──────────────────────────────────────────────────────────
  if (savedInvoice) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-6 gap-6">
        {/* Clean hidden preview for PDF capture — no transforms, no off-screen issues */}
        <HiddenPDFPreview invoice={savedInvoice} />

        <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center">
          <span className="text-4xl">✅</span>
        </div>
        <div className="text-center">
          <h1 className="text-2xl font-black text-gray-900">Invoice Saved!</h1>
          <p className="text-gray-500 mt-1 text-sm">
            Invoice #{savedInvoice.invoice_number} for {savedInvoice.customer_name}
          </p>
          <p className="text-[#C0392B] font-bold text-lg mt-1">
            Rs {Number(savedInvoice.net_total).toFixed(2)}
          </p>
        </div>

        <div className="w-full max-w-sm flex flex-col gap-3">
          <button
            onClick={handleDownloadPDF}
            disabled={pdfLoading}
            className="h-14 rounded-2xl bg-[#C0392B] text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
          >
            {pdfLoading ? 'Generating PDF...' : '⬇ Download PDF'}
          </button>

          <button
            onClick={async () => {
              setSharing(true);
              try {
                await shareInvoicePDF(savedInvoice.invoice_number, savedInvoice.customer_name);
              } catch {
                showToast('Could not share. Try downloading instead.', 'error');
              } finally {
                setSharing(false);
              }
            }}
            disabled={sharing}
            className="h-14 rounded-2xl bg-green-500 text-white font-bold text-base flex items-center justify-center gap-2 disabled:opacity-60"
          >
            <MessageCircle size={20} />
            {sharing ? 'Preparing PDF...' : 'Share via WhatsApp'}
          </button>

          <Link
            href={`/invoices/${savedInvoice.id}`}
            className="h-12 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center"
          >
            View Invoice
          </Link>

          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => { setSavedInvoice(null); setForm(defaultFormData()); setStep(0); }}
              className="h-12 rounded-2xl bg-gray-900 text-white font-semibold text-sm"
            >
              New Invoice
            </button>
            <Link
              href="/"
              className="h-12 rounded-2xl border-2 border-gray-200 text-gray-700 font-semibold text-sm flex items-center justify-center"
            >
              Dashboard
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // ── Wizard ──────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-white">
      <div className="bg-white border-b border-gray-100 px-4 pt-10 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-base font-black text-gray-900 flex-1">New Invoice</h1>
          <span className="text-xs text-gray-400 font-medium">Step {step + 1} of {STEP_LABELS.length}</span>
        </div>
        <div className="flex gap-1.5">
          {STEP_LABELS.map((label, i) => (
            <div key={i} className="flex-1 flex flex-col gap-1">
              <div className={`h-1.5 rounded-full transition-colors ${i <= step ? 'bg-[#C0392B]' : 'bg-gray-200'}`} />
              <span className={`text-xs text-center font-medium ${i === step ? 'text-[#C0392B]' : 'text-gray-400'}`}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="px-4 py-5 max-w-lg mx-auto">
        {step === 0 && <StepCustomer data={form} onChange={updateForm} onNext={() => setStep(1)} />}
        {step === 1 && <StepItems data={form} onChange={updateForm} onNext={() => setStep(2)} onBack={() => setStep(0)} />}
        {step === 2 && <StepPrescription data={form} onChange={updateForm} onNext={() => setStep(3)} onBack={() => setStep(1)} />}
        {step === 3 && <StepReview data={form} onBack={() => setStep(2)} onGoToStep={setStep} onSave={handleSave} saving={saving} />}
      </div>
    </div>
  );
}
