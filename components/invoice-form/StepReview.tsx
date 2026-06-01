'use client';

import { InvoiceFormData } from '@/types/invoice';
import { ChevronLeft, Edit2 } from 'lucide-react';
import { calculateTotals, formatDate, formatCurrency } from '@/lib/invoice-helpers';

interface StepReviewProps {
  data: InvoiceFormData;
  onBack: () => void;
  onGoToStep: (step: number) => void;
  onSave: () => void;
  saving: boolean;
}

export function StepReview({ data, onBack, onGoToStep, onSave, saving }: StepReviewProps) {
  const { grossTotal, netTotal } = calculateTotals(data.items, data.discount);

  return (
    <div className="flex flex-col gap-4 pb-28">
      <h2 className="text-lg font-bold text-gray-900">Review Invoice</h2>

      {/* Customer Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Customer</span>
          <button onClick={() => onGoToStep(0)} className="flex items-center gap-1 text-[#C0392B] text-xs font-semibold h-8 px-2">
            <Edit2 size={13} /> Edit
          </button>
        </div>
        <div className="p-4 flex flex-col gap-1">
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Name</span>
            <span className="text-sm font-semibold">{data.customer_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Mobile</span>
            <span className="text-sm font-semibold">{data.customer_mobile}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Invoice #</span>
            <span className="text-sm font-semibold">#{data.invoice_number}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Invoice Date</span>
            <span className="text-sm font-semibold">{formatDate(data.invoice_date)}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-sm text-gray-500">Order Date</span>
            <span className="text-sm font-semibold">{formatDate(data.order_date)}</span>
          </div>
          {data.delivery_date && (
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Delivery Date</span>
              <span className="text-sm font-semibold">{formatDate(data.delivery_date)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Items Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Products</span>
          <button onClick={() => onGoToStep(1)} className="flex items-center gap-1 text-[#C0392B] text-xs font-semibold h-8 px-2">
            <Edit2 size={13} /> Edit
          </button>
        </div>
        <div className="p-4 flex flex-col gap-3">
          {data.items.map(item => (
            <div key={item.id} className="flex justify-between items-start gap-3">
              <div className="flex-1 text-sm text-gray-800 whitespace-pre-line leading-snug">{item.product_details}</div>
              <div className="shrink-0 text-sm font-bold text-gray-900">
                Rs {parseFloat(item.price || '0').toFixed(2)}
              </div>
            </div>
          ))}

          <div className="pt-3 border-t border-gray-200 flex flex-col gap-1.5">
            <div className="flex justify-between">
              <span className="text-sm text-gray-500">Gross Total</span>
              <span className="text-sm font-semibold">{formatCurrency(grossTotal)}</span>
            </div>
            {data.discount > 0 && (
              <div className="flex justify-between">
                <span className="text-sm text-gray-500">Discount</span>
                <span className="text-sm font-semibold text-green-600">- {formatCurrency(data.discount)}</span>
              </div>
            )}
            <div className="flex justify-between pt-1">
              <span className="text-base font-bold">Net Total</span>
              <span className="text-base font-bold text-[#C0392B]">{formatCurrency(netTotal)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Prescription Section */}
      <div className="bg-gray-50 rounded-2xl border border-gray-100 overflow-hidden">
        <div className="flex items-center justify-between px-4 py-3 bg-gray-100">
          <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">Prescription</span>
          <button onClick={() => onGoToStep(2)} className="flex items-center gap-1 text-[#C0392B] text-xs font-semibold h-8 px-2">
            <Edit2 size={13} /> Edit
          </button>
        </div>
        <div className="p-4">
          {data.has_prescription ? (
            <div className="text-sm text-gray-700">
              <span className="inline-flex items-center gap-1.5 bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                ✓ Prescription included
              </span>
              {data.prescription.constant_use && (
                <span className="ml-2 inline-flex items-center gap-1.5 bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                  Constant Use
                </span>
              )}
            </div>
          ) : (
            <span className="text-sm text-gray-400">No prescription</span>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={onBack}
          className="h-14 px-5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-1"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          onClick={onSave}
          disabled={saving}
          className="flex-1 h-14 rounded-xl bg-green-600 text-white text-base font-bold flex items-center justify-center gap-2 disabled:opacity-60 active:bg-green-700 transition-colors"
        >
          {saving ? (
            <span className="flex items-center gap-2">
              <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            '✓ Save Invoice'
          )}
        </button>
      </div>
    </div>
  );
}
