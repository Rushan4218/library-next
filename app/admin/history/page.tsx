'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BorrowRecord } from '@/lib/types';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  History,
  CheckCircle2,
  RotateCcw,
  Filter,
  Loader2,
  Ticket,
  User,
  MapPin,
  Mail,
  Phone
} from 'lucide-react';

const BORROW_STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Borrow Statuses' },
  { value: 'PENDING_PICKUP', label: 'Pending Pickup' },
  { value: 'FULFILLED', label: 'Fulfilled (Issued)' },
  { value: 'RETURNED', label: 'Returned' },
  { value: 'CANCELLED', label: 'Cancelled' }
];

export default function AdminHistoryPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [records, setRecords] = useState<BorrowRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tokenSearch, setTokenSearch] = useState('');
  const [emailSearch, setEmailSearch] = useState('');

  const [actionLoading, setActionLoading] = useState<number | null>(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const data = await api.getBorrowingHistory({
        status: statusFilter !== 'ALL' ? statusFilter : undefined,
        token: tokenSearch || undefined,
        user_email: emailSearch || undefined
      }, token || undefined);
      setRecords(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/admin/login');
      return;
    }
    if (isAuthenticated) {
      loadHistory();
    }
  }, [isAuthenticated, authLoading, statusFilter, tokenSearch, emailSearch]);

  const handleFulfill = async (recordId: number) => {
    setActionLoading(recordId);
    try {
      await api.fulfillBorrow(recordId, token || undefined);
      toast('Physical book pickup marked as fulfilled!', 'success', 'Pickup Issued');
      await loadHistory();
    } catch (err: any) {
      toast(err.message || 'Failed to mark as fulfilled', 'error', 'Action Failed');
    } finally {
      setActionLoading(null);
    }
  };

  const handleReturn = async (recordId: number) => {
    setActionLoading(recordId);
    try {
      await api.returnBorrow(recordId, token || undefined);
      toast('Book return processed. Book is now AVAILABLE.', 'success', 'Return Completed');
      await loadHistory();
    } catch (err: any) {
      toast(err.message || 'Failed to process return', 'error', 'Action Failed');
    } finally {
      setActionLoading(null);
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-gray-950">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <History className="w-8 h-8 text-indigo-600" />
              Borrowing Audit History
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Verify physical pickups, fulfill orders, and process book returns
            </p>
          </div>
        </div>

        {/* Filter bar */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs mb-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Token Search */}
          <Input
            type="text"
            placeholder="Filter by token (e.g. LIB-9X82)..."
            value={tokenSearch}
            onChange={e => setTokenSearch(e.target.value)}
            icon={<Ticket className="w-4 h-4" />}
            className="font-mono uppercase"
          />

          {/* Email Search */}
          <Input
            type="text"
            placeholder="Filter by borrower email..."
            value={emailSearch}
            onChange={e => setEmailSearch(e.target.value)}
            icon={<Mail className="w-4 h-4" />}
          />

          {/* Status filter */}
          <Select
            value={statusFilter}
            onChange={v => setStatusFilter(v)}
            options={BORROW_STATUS_OPTIONS}
            icon={<Filter className="w-4 h-4" />}
          />
        </div>

        {/* Audit Table */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading borrowing records...</p>
          </div>
        ) : records.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <History className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No borrowing records found</h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase font-semibold border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">Token & Status</th>
                    <th className="py-3.5 px-4">Book Info</th>
                    <th className="py-3.5 px-4">Borrower Info</th>
                    <th className="py-3.5 px-4">Timestamps</th>
                    <th className="py-3.5 px-4 text-right">Fulfillment Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {records.map(r => (
                    <tr key={r.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      {/* Token & Status */}
                      <td className="py-4 px-4 space-y-1">
                        <div className="font-mono font-black text-sm text-indigo-600 dark:text-indigo-400">
                          {r.token}
                        </div>
                        <StatusBadge status={r.status} type="borrow" size="sm" />
                      </td>

                      {/* Book info */}
                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 dark:text-white max-w-xs line-clamp-1">
                          {r.book_title || r.book?.title || `Book #${r.book_id}`}
                        </div>
                        <div className="text-gray-400 text-[11px] font-mono">
                          ID: #{r.book_id}
                        </div>
                      </td>

                      {/* Borrower Details */}
                      <td className="py-4 px-4 space-y-0.5">
                        <div className="font-semibold text-gray-800 dark:text-gray-200 flex items-center gap-1">
                          <User className="w-3 h-3 text-gray-400" /> {r.user_name}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1 font-mono text-[11px]">
                          <Mail className="w-3 h-3 text-gray-400" /> {r.user_email}
                        </div>
                        <div className="text-gray-500 flex items-center gap-1 text-[11px]">
                          <Phone className="w-3 h-3 text-gray-400" /> {r.user_phone}
                        </div>
                        <div className="text-gray-400 text-[10px] line-clamp-1 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-gray-400" /> {r.user_address}
                        </div>
                      </td>

                      {/* Timestamps */}
                      <td className="py-4 px-4 space-y-1 font-mono text-[11px]">
                        <div>
                          <span className="text-gray-400">Req: </span>
                          <span className="text-gray-700 dark:text-gray-300">
                            {new Date(r.borrowed_at).toLocaleString()}
                          </span>
                        </div>
                        {r.fulfilled_at && (
                          <div>
                            <span className="text-sky-500 font-semibold">Picked: </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {new Date(r.fulfilled_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                        {r.returned_at && (
                          <div>
                            <span className="text-emerald-500 font-semibold">Ret: </span>
                            <span className="text-gray-700 dark:text-gray-300">
                              {new Date(r.returned_at).toLocaleString()}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          {r.status === 'PENDING_PICKUP' && (
                            <Button
                              onClick={() => handleFulfill(r.id)}
                              isLoading={actionLoading === r.id}
                              variant="default"
                              size="sm"
                              className="bg-sky-600 hover:bg-sky-500"
                            >
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Fulfill Pickup
                            </Button>
                          )}

                          {r.status === 'FULFILLED' && (
                            <Button
                              onClick={() => handleReturn(r.id)}
                              isLoading={actionLoading === r.id}
                              variant="default"
                              size="sm"
                              className="bg-emerald-600 hover:bg-emerald-500"
                            >
                              <RotateCcw className="w-3.5 h-3.5 mr-1" /> Process Return
                            </Button>
                          )}

                          {r.status === 'RETURNED' && (
                            <span className="text-emerald-600 dark:text-emerald-400 font-bold text-[11px] flex items-center gap-1 justify-end">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Complete
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
