'use client';

import { InvoiceFormData, InvoiceItemFormData } from '@/types/invoice';
import { Trash2, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { calculateTotals } from '@/lib/invoice-helpers';

const QUICK_CHIPS = [
  { label: 'Frame', template: 'Spectacle Frame\nBrand: \nModel: \nColor: ' },
  { label: 'Lens', template: 'Lens (Pair)\nType: \nCoating: \nPower: ' },
  { label: 'Sunglasses', template: 'Sunglasses\nBrand: \nModel: \nColor: ' },
  { label: 'Contact Lens', template: 'Contact Lens (Pair)\nBrand: \nPower: \nType: Monthly/Daily' },
  { label: 'Solution', template: 'Contact Lens Solution\nBrand: \nQuantity: ' },
];

interface StepItemsProps {
  data: InvoiceFormData;
  onChange: (updates: Partial<InvoiceFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function StepItems({ data, onChange, onNext, onBack }: StepItemsProps) {
  const { grossTotal, netTotal } = calculateTotals(data.items, data.discount);

  function updateItem(id: string, field: keyof InvoiceItemFormData, value: string) {
    onChange({
      items: data.items.map(item =>
        item.id === id ? { ...item, [field]: value } : item
      ),
    });
  }

  function addItem() {
    const newItem: InvoiceItemFormData = {
      id: Math.random().toString(36).slice(2),
      sl_no: data.items.length + 1,
      product_details: '',
      price: '',
    };
    onChange({ items: [...data.items, newItem] });
  }

  function removeItem(id: string) {
    const filtered = data.items.filter(item => item.id !== id);
    onChange({ items: filtered.map((item, i) => ({ ...item, sl_no: i + 1 })) });
  }

  function applyChip(itemId: string, template: string) {
    const item = data.items.find(i => i.id === itemId);
    if (!item) return;
    updateItem(itemId, 'product_details', template);
  }

  const hasValidItems = data.items.length > 0 && data.items.some(i => i.product_details.trim() && i.price);

  return (
    <div className="flex flex-col gap-4 pb-44">
      <h2 className="text-lg font-bold text-gray-900">Products & Pricing</h2>

      {data.items.map((item, index) => (
        <div key={item.id} className="bg-gray-50 rounded-2xl p-4 border border-gray-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-bold text-gray-600">Item #{index + 1}</span>
            {data.items.length > 1 && (
              <button
                onClick={() => removeItem(item.id)}
                className="h-8 w-8 flex items-center justify-center rounded-lg text-red-500 active:bg-red-50"
              >
                <Trash2 size={16} />
              </button>
            )}
          </div>

          {/* Quick chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-3 no-scrollbar">
            {QUICK_CHIPS.map(chip => (
              <button
                key={chip.label}
                onClick={() => applyChip(item.id, chip.template)}
                className="shrink-0 h-8 px-3 rounded-full border-2 border-gray-200 text-xs font-semibold text-gray-600 bg-white active:bg-red-50 active:border-red-300 active:text-[#C0392B] transition-colors"
              >
                {chip.label}
              </button>
            ))}
          </div>

          <label className="flex flex-col gap-1.5 mb-3">
            <span className="text-sm font-semibold text-gray-700">Product Details</span>
            <textarea
              rows={3}
              value={item.product_details}
              onChange={e => updateItem(item.id, 'product_details', e.target.value)}
              placeholder="Enter product description..."
              className="px-4 py-3 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-[#C0392B] focus:outline-none transition-colors resize-none"
            />
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-semibold text-gray-700">Price (₹)</span>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-bold">₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={item.price}
                onChange={e => updateItem(item.id, 'price', e.target.value)}
                placeholder="0.00"
                className="h-12 pl-8 pr-4 w-full rounded-xl border-2 border-gray-200 text-base font-semibold focus:border-[#C0392B] focus:outline-none transition-colors"
              />
            </div>
          </label>
        </div>
      ))}

      <button
        onClick={addItem}
        className="h-12 rounded-xl border-2 border-dashed border-gray-300 text-gray-600 text-sm font-semibold flex items-center justify-center gap-2 active:bg-gray-50"
      >
        <Plus size={18} />
        Add Another Item
      </button>

      {/* Sticky summary + nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-100 shadow-lg">
        <div className="p-4 border-b border-gray-100">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">Subtotal</span>
            <span className="text-sm font-semibold">Rs {grossTotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm text-gray-600">Discount (₹)</span>
            <div className="relative w-28">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 text-sm">₹</span>
              <input
                type="number"
                inputMode="decimal"
                value={data.discount || ''}
                onChange={e => onChange({ discount: parseFloat(e.target.value) || 0 })}
                placeholder="0"
                className="h-9 pl-6 pr-3 w-full rounded-lg border-2 border-gray-200 text-sm font-semibold focus:border-[#C0392B] focus:outline-none text-right"
              />
            </div>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-base font-bold text-gray-900">Net Total</span>
            <span className="text-base font-bold text-[#C0392B]">Rs {netTotal.toFixed(2)}</span>
          </div>
        </div>

        <div className="flex gap-3 p-4">
          <button
            onClick={onBack}
            className="h-12 px-5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-1"
          >
            <ChevronLeft size={18} /> Back
          </button>
          <button
            onClick={onNext}
            disabled={!hasValidItems}
            className="flex-1 h-12 rounded-xl bg-[#C0392B] text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-40 active:bg-[#a93226] transition-colors"
          >
            Next — Prescription
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}
