'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Plus, FileText, ChevronRight, IndianRupee } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/invoice-helpers';
import type { Invoice } from '@/types/invoice';

export default function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [totalInvoices, setTotalInvoices] = useState(0);
  const [monthRevenue, setMonthRevenue] = useState(0);
  const [recentInvoices, setRecentInvoices] = useState<Invoice[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDashboard() {
      try {
        const { data: invoices, error: err1 } = await supabase
          .from('invoices')
          .select('*')
          .order('created_at', { ascending: false })
          .limit(5);

        if (err1) throw err1;

        const { count } = await supabase
          .from('invoices')
          .select('*', { count: 'exact', head: true });

        const now = new Date();
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        const { data: monthData } = await supabase
          .from('invoices')
          .select('net_total')
          .gte('created_at', monthStart);

        const revenue = (monthData || []).reduce((sum, inv) => sum + Number(inv.net_total), 0);

        setTotalInvoices(count || 0);
        setMonthRevenue(revenue);
        setRecentInvoices(invoices || []);
      } catch (e) {
        console.error(e);
        setError('Could not load dashboard. Please check your internet connection.');
      } finally {
        setLoading(false);
      }
    }

    loadDashboard();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-5 shadow-sm">
        <div className="text-2xl font-black text-[#C0392B] tracking-tight">Jagdish Sharan & Sons</div>
        <div className="text-sm text-gray-500 mt-0.5 font-medium">Invoice Manager</div>
      </div>

      <div className="px-4 py-5 flex flex-col gap-4 max-w-lg mx-auto">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* Stats Row */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <FileText size={16} className="text-[#C0392B]" />
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">Total Invoices</span>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-16 mt-1" />
            ) : (
              <div className="text-3xl font-black text-gray-900 mt-1">{totalInvoices}</div>
            )}
          </div>

          <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-1">
              <IndianRupee size={16} className="text-[#C0392B]" />
              <span className="text-xs text-gray-500 font-semibold uppercase tracking-wide">This Month</span>
            </div>
            {loading ? (
              <div className="skeleton h-8 w-24 mt-1" />
            ) : (
              <div className="text-xl font-black text-gray-900 mt-1">{formatCurrency(monthRevenue)}</div>
            )}
          </div>
        </div>

        {/* New Invoice CTA */}
        <Link
          href="/invoices/new"
          className="flex items-center justify-center gap-3 h-14 rounded-2xl bg-[#C0392B] text-white text-base font-bold shadow-lg active:bg-[#a93226] transition-colors"
        >
          <Plus size={22} strokeWidth={3} />
          New Invoice
        </Link>

        {/* Recent Invoices */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold text-gray-900">Recent Invoices</h2>
            <Link href="/invoices" className="text-sm text-[#C0392B] font-semibold">
              View All
            </Link>
          </div>

          {loading ? (
            <div className="flex flex-col gap-2">
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton h-20 w-full rounded-2xl" />
              ))}
            </div>
          ) : recentInvoices.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-8 text-center">
              <div className="text-4xl mb-3">🧾</div>
              <p className="text-sm font-medium text-gray-500">No invoices yet</p>
              <p className="text-xs text-gray-400 mt-1">Create your first invoice above</p>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              {recentInvoices.map(inv => (
                <Link
                  key={inv.id}
                  href={`/invoices/${inv.id}`}
                  className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 active:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                    <span className="text-xs font-black text-[#C0392B]">#{inv.invoice_number}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-bold text-gray-900 truncate">{inv.customer_name}</div>
                    <div className="text-xs text-gray-500 mt-0.5">{formatDate(inv.invoice_date)}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-sm font-bold text-gray-900">{formatCurrency(inv.net_total)}</div>
                    <ChevronRight size={16} className="text-gray-400 ml-auto mt-0.5" />
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
