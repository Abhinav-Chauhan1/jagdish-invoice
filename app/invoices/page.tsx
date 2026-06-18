'use client';

import { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import { Plus, Search, ChevronRight, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { formatCurrency, formatDate } from '@/lib/invoice-helpers';
import type { Invoice } from '@/types/invoice';

type Filter = 'all' | 'week' | 'month';

export default function InvoiceListPage() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<Filter>('all');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const PAGE_SIZE = 20;

  const loadInvoices = useCallback(async (searchTerm: string, filterVal: Filter, pageNum: number) => {
    setLoading(true);
    try {
      let query = supabase
        .from('invoices')
        .select('*')
        .order('created_at', { ascending: false })
        .range(pageNum * PAGE_SIZE, pageNum * PAGE_SIZE + PAGE_SIZE - 1);

      // Filter by date range
      const now = new Date();
      if (filterVal === 'week') {
        const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString();
        query = query.gte('created_at', weekAgo);
      } else if (filterVal === 'month') {
        const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString();
        query = query.gte('created_at', monthStart);
      }

      // Search by company name, customer name, mobile, or invoice number
      if (searchTerm.trim()) {
        const num = parseInt(searchTerm, 10);
        if (!isNaN(num)) {
          query = query.or(
            `company_name.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_mobile.ilike.%${searchTerm}%,invoice_number.eq.${num}`
          );
        } else {
          query = query.or(
            `company_name.ilike.%${searchTerm}%,customer_name.ilike.%${searchTerm}%,customer_mobile.ilike.%${searchTerm}%`
          );
        }
      }

      const { data, error } = await query;
      if (error) throw error;

      setInvoices(pageNum === 0 ? (data || []) : prev => [...prev, ...(data || [])]);
      setHasMore((data?.length || 0) === PAGE_SIZE);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(0);
      loadInvoices(search, filter, 0);
    }, 300);
    return () => clearTimeout(timer);
  }, [search, filter, loadInvoices]);

  function handleFilterChange(f: Filter) {
    setFilter(f);
    setPage(0);
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 px-4 pt-12 pb-4 sticky top-0 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/" className="h-10 w-10 flex items-center justify-center rounded-xl bg-gray-100 active:bg-gray-200">
            <ArrowLeft size={20} />
          </Link>
          <h1 className="text-lg font-black text-gray-900">All Invoices</h1>
        </div>

        {/* Search */}
        <div className="relative mb-3">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="search"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by company, name or mobile..."
            className="w-full h-11 pl-11 pr-4 rounded-xl border-2 border-gray-200 text-sm font-medium focus:border-[#C0392B] focus:outline-none bg-gray-50"
          />
        </div>

        {/* Filter chips */}
        <div className="flex gap-2">
          {(['all', 'week', 'month'] as Filter[]).map(f => (
            <button
              key={f}
              onClick={() => handleFilterChange(f)}
              className={`h-8 px-4 rounded-full text-xs font-bold border-2 transition-colors ${
                filter === f
                  ? 'bg-[#C0392B] text-white border-[#C0392B]'
                  : 'bg-white text-gray-600 border-gray-200'
              }`}
            >
              {f === 'all' ? 'All' : f === 'week' ? 'This Week' : 'This Month'}
            </button>
          ))}
        </div>
      </div>

      <div className="px-4 py-4 max-w-lg mx-auto pb-24">
        {loading && invoices.length === 0 ? (
          <div className="flex flex-col gap-2">
            {[1, 2, 3, 4, 5].map(i => (
              <div key={i} className="skeleton h-20 w-full rounded-2xl" />
            ))}
          </div>
        ) : invoices.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center mt-4">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-sm font-medium text-gray-500">No invoices found</p>
            {search && <p className="text-xs text-gray-400 mt-1">Try a different search term</p>}
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {invoices.map(inv => (
              <Link
                key={inv.id}
                href={`/invoices/${inv.id}`}
                className="flex items-center gap-4 bg-white rounded-2xl border border-gray-100 p-4 active:bg-gray-50 transition-colors"
              >
                <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                  <span className="text-xs font-black text-[#C0392B] text-center">#{inv.invoice_number}</span>
                </div>
                <div className="flex-1 min-w-0">
                  {inv.company_name && (
                    <div className="text-xs font-semibold text-blue-600 truncate">{inv.company_name}</div>
                  )}
                  <div className="text-sm font-bold text-gray-900 truncate">{inv.customer_name}</div>
                  <div className="text-xs text-gray-500">{inv.customer_mobile}</div>
                  <div className="text-xs text-gray-400 mt-0.5">{formatDate(inv.invoice_date)}</div>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-sm font-bold text-gray-900">{formatCurrency(inv.net_total)}</div>
                  <ChevronRight size={16} className="text-gray-400 ml-auto mt-1" />
                </div>
              </Link>
            ))}

            {hasMore && (
              <button
                onClick={() => {
                  const next = page + 1;
                  setPage(next);
                  loadInvoices(search, filter, next);
                }}
                className="h-12 rounded-xl border-2 border-gray-200 text-gray-600 text-sm font-semibold mt-2"
              >
                {loading ? 'Loading...' : 'Load More'}
              </button>
            )}
          </div>
        )}
      </div>

      {/* FAB */}
      <Link
        href="/invoices/new"
        className="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-[#C0392B] text-white shadow-xl flex items-center justify-center active:bg-[#a93226] transition-colors"
      >
        <Plus size={24} strokeWidth={3} />
      </Link>
    </div>
  );
}
