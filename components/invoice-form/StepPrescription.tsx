'use client';

import { InvoiceFormData, PrescriptionFormData } from '@/types/invoice';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface StepPrescriptionProps {
  data: InvoiceFormData;
  onChange: (updates: Partial<InvoiceFormData>) => void;
  onNext: () => void;
  onBack: () => void;
}

type PrescriptionField = keyof PrescriptionFormData;

const EYE_ROWS = [
  { label: 'DV', prefix: 'dv' },
  { label: 'NV', prefix: 'nv' },
] as const;

const COLUMNS = ['sph', 'cyl', 'axis', 'pd', 'va'] as const;

export function StepPrescription({ data, onChange, onBack, onNext }: StepPrescriptionProps) {
  const { has_prescription, prescription } = data;

  function updatePrescription(field: PrescriptionField, value: string | boolean) {
    onChange({ prescription: { ...prescription, [field]: value } });
  }

  function renderEyeCard(eye: 'od' | 'os', label: string) {
    return (
      <div className="bg-gray-50 rounded-2xl p-4 border border-gray-100 mb-4">
        <h3 className="text-sm font-bold text-gray-800 mb-3 uppercase tracking-wide">
          {label}
        </h3>

        {/* DV / NV rows */}
        {EYE_ROWS.map(row => (
          <div key={row.prefix} className="mb-3">
            <div className="text-xs font-bold text-gray-500 uppercase mb-1.5">{row.label}</div>
            <div className="grid grid-cols-5 gap-1.5">
              {COLUMNS.map(col => {
                const field = `${eye}_${row.prefix}_${col}` as PrescriptionField;
                return (
                  <label key={col} className="flex flex-col gap-1">
                    <span className="text-xs font-semibold text-gray-500 text-center uppercase">{col}</span>
                    <input
                      type="text"
                      inputMode="decimal"
                      value={prescription[field] as string || ''}
                      onChange={e => updatePrescription(field, e.target.value)}
                      placeholder="—"
                      className="h-10 rounded-lg border-2 border-gray-200 text-xs font-medium text-center focus:border-[#C0392B] focus:outline-none"
                    />
                  </label>
                );
              })}
            </div>
          </div>
        ))}

        {/* AOD / IOD */}
        <div className="grid grid-cols-2 gap-3 mt-2">
          {(['aod', 'iod'] as const).map(field => {
            const key = `${eye}_${field}` as PrescriptionField;
            return (
              <label key={field} className="flex flex-col gap-1">
                <span className="text-xs font-bold text-gray-500 uppercase">{field}</span>
                <input
                  type="text"
                  inputMode="decimal"
                  value={prescription[key] as string || ''}
                  onChange={e => updatePrescription(key, e.target.value)}
                  placeholder="—"
                  className="h-10 px-3 rounded-lg border-2 border-gray-200 text-sm font-medium focus:border-[#C0392B] focus:outline-none"
                />
              </label>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col pb-28">
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-bold text-gray-900">Prescription</h2>
        {/* Toggle */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => onChange({ has_prescription: false })}
            className={`h-9 px-4 rounded-lg text-sm font-semibold border-2 transition-colors ${
              !has_prescription
                ? 'bg-gray-900 text-white border-gray-900'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            No
          </button>
          <button
            onClick={() => onChange({ has_prescription: true })}
            className={`h-9 px-4 rounded-lg text-sm font-semibold border-2 transition-colors ${
              has_prescription
                ? 'bg-[#C0392B] text-white border-[#C0392B]'
                : 'bg-white text-gray-500 border-gray-200'
            }`}
          >
            Yes
          </button>
        </div>
      </div>

      {!has_prescription && (
        <div className="flex-1 flex flex-col items-center justify-center py-16 gap-3 text-gray-400">
          <div className="text-5xl">👓</div>
          <p className="text-base font-medium">No prescription needed</p>
          <p className="text-sm text-gray-400">Toggle &quot;Yes&quot; above to add prescription details</p>
        </div>
      )}

      {has_prescription && (
        <div>
          {renderEyeCard('od', 'Right Eye (OD)')}
          {renderEyeCard('os', 'Left Eye (OS)')}

          {/* Constant Use checkbox */}
          <label className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
            <input
              type="checkbox"
              checked={prescription.constant_use}
              onChange={e => updatePrescription('constant_use', e.target.checked)}
              className="w-5 h-5 rounded accent-[#C0392B]"
            />
            <span className="text-sm font-semibold text-gray-800">Constant Use</span>
          </label>
        </div>
      )}

      {/* Navigation */}
      <div className="fixed bottom-0 left-0 right-0 flex gap-3 p-4 bg-white border-t border-gray-100 shadow-lg">
        <button
          onClick={onBack}
          className="h-12 px-5 rounded-xl border-2 border-gray-200 text-gray-700 font-semibold text-sm flex items-center gap-1"
        >
          <ChevronLeft size={18} /> Back
        </button>
        <button
          onClick={onNext}
          className="flex-1 h-12 rounded-xl bg-[#C0392B] text-white text-sm font-bold flex items-center justify-center gap-2 active:bg-[#a93226] transition-colors"
        >
          Next — Review
          <ChevronRight size={18} />
        </button>
      </div>
    </div>
  );
}
