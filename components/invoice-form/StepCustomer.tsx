'use client';

import { InvoiceFormData } from '@/types/invoice';
import { ChevronRight } from 'lucide-react';

interface StepCustomerProps {
  data: InvoiceFormData;
  onChange: (updates: Partial<InvoiceFormData>) => void;
  onNext: () => void;
}

export function StepCustomer({ data, onChange, onNext }: StepCustomerProps) {
  const isValid = data.customer_name.trim() && data.customer_mobile.trim();

  return (
    <div className="flex flex-col gap-5 pb-24">
      {/* Invoice number badge */}
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Customer Details</h2>
        <span className="inline-flex items-center gap-1 bg-red-50 border border-red-200 text-[#C0392B] text-sm font-bold px-3 py-1 rounded-full">
          Invoice #{data.invoice_number}
        </span>
      </div>

      <div className="flex flex-col gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Company Name</span>
          <input
            type="text"
            value={data.company_name}
            onChange={e => onChange({ company_name: e.target.value })}
            placeholder="Enter company name (optional)"
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Customer Name *</span>
          <input
            type="text"
            autoFocus
            value={data.customer_name}
            onChange={e => onChange({ customer_name: e.target.value })}
            placeholder="Enter customer name"
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Mobile Number *</span>
          <input
            type="tel"
            inputMode="numeric"
            value={data.customer_mobile}
            onChange={e => onChange({ customer_mobile: e.target.value })}
            placeholder="e.g. 9876543210"
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Invoice Date</span>
          <input
            type="date"
            value={data.invoice_date}
            onChange={e => onChange({ invoice_date: e.target.value })}
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Date of Order</span>
          <input
            type="date"
            value={data.order_date}
            onChange={e => onChange({ order_date: e.target.value })}
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>

        <label className="flex flex-col gap-1.5">
          <span className="text-base font-semibold text-gray-800">Date of Delivery</span>
          <input
            type="date"
            value={data.delivery_date}
            onChange={e => onChange({ delivery_date: e.target.value })}
            className="h-12 px-4 rounded-xl border-2 border-gray-200 text-base font-medium focus:border-[#C0392B] focus:outline-none transition-colors"
          />
        </label>
      </div>

      <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={onNext}
          disabled={!isValid}
          className="w-full h-14 rounded-xl bg-[#C0392B] text-white text-base font-bold flex items-center justify-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed active:bg-[#a93226] transition-colors"
        >
          Next — Add Products
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
}
