'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { TokenVerification } from '@/lib/types';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, ShieldCheck, Ticket, CheckCircle2, XCircle, Clock, BookOpen, User, Loader2 } from 'lucide-react';

function VerifyTool() {
  const searchParams = useSearchParams();
  const initialToken = searchParams.get('token') || '';

  const [tokenInput, setTokenInput] = useState(initialToken);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<TokenVerification | null>(null);

  const handleSearch = async (t: string) => {
    if (!t.trim()) return;
    setLoading(true);
    try {
      const data = await api.verifyToken(t.trim());
      setResult(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialToken) {
      handleSearch(initialToken);
    }
  }, [initialToken]);

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(tokenInput);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      {/* Search Header Card */}
      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-lg space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center mx-auto">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h1 className="text-2xl font-extrabold text-gray-900 dark:text-white">
            Pick-up Token Verification
          </h1>
          <p className="text-xs text-gray-500 max-w-md mx-auto">
            Enter the borrower&apos;s token (e.g., <code className="bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded font-mono text-indigo-600 dark:text-indigo-400">LIB-9X82-K4M1</code>) to verify authenticity and pickup status.
          </p>
        </div>

        <form onSubmit={onSubmit} className="flex gap-2 max-w-lg mx-auto">
          <Input
            type="text"
            required
            placeholder="e.g. LIB-9X82-K4M1"
            value={tokenInput}
            onChange={e => setTokenInput(e.target.value)}
            icon={<Ticket className="w-4 h-4" />}
            className="font-mono uppercase"
          />
          <Button
            type="submit"
            isLoading={loading}
            variant="default"
            size="default"
            className="shrink-0"
          >
            <Search className="w-4 h-4 mr-1" /> Verify Token
          </Button>
        </form>
      </div>

      {/* Verification Result Card */}
      {result && (
        <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-8 shadow-xl space-y-6 animate-in fade-in duration-300">
          {/* Status Banner */}
          <div className={`p-4 rounded-2xl flex items-center gap-3 border ${
            result.valid
              ? 'bg-emerald-50 text-emerald-900 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-200 dark:border-emerald-800'
              : 'bg-rose-50 text-rose-900 border-rose-200 dark:bg-rose-950/40 dark:text-rose-200 dark:border-rose-800'
          }`}>
            {result.valid ? (
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
            ) : (
              <XCircle className="w-6 h-6 text-rose-600 shrink-0" />
            )}

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="font-bold text-sm">
                  {result.valid ? 'Valid Pick-up Token Found' : 'Token Not Found or Invalid'}
                </h3>
                <p className="text-xs opacity-80 font-mono">
                  Token: {result.token}
                </p>
              </div>

              {result.valid && (
                <StatusBadge status={result.status} type="borrow" size="md" />
              )}
            </div>
          </div>

          {result.valid && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Borrower Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Borrower Details
                </h4>

                <div className="space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Name:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200">{result.borrower_name}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Email:</span>
                    <span className="font-mono text-gray-800 dark:text-gray-200">{result.borrower_email}</span>
                  </p>
                </div>
              </div>

              {/* Book Info */}
              <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-2xl space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Book Information
                </h4>

                <div className="space-y-1.5 text-xs">
                  <p className="flex justify-between">
                    <span className="text-gray-500">Title:</span>
                    <span className="font-bold text-gray-800 dark:text-gray-200 text-right line-clamp-1">{result.book.title}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Author:</span>
                    <span className="font-medium text-gray-800 dark:text-gray-200">{result.book.author}</span>
                  </p>
                  <p className="flex justify-between">
                    <span className="text-gray-500">Current Status:</span>
                    <StatusBadge status={result.book.status} type="book" size="sm" />
                  </p>
                </div>
              </div>

              {/* Lifecycle Audit Timeline */}
              <div className="md:col-span-2 p-4 bg-indigo-50/50 dark:bg-indigo-950/30 rounded-2xl border border-indigo-100 dark:border-indigo-900/50 space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-700 dark:text-indigo-300 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" /> Lifecycle Timeline
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                  <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">1. Reserved / Borrowed</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {result.borrowed_at ? new Date(result.borrowed_at).toLocaleString() : 'N/A'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">2. Pickup Fulfilled</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {result.fulfilled_at ? new Date(result.fulfilled_at).toLocaleString() : 'Pending Staff Verification'}
                    </span>
                  </div>

                  <div className="p-2.5 bg-white dark:bg-gray-900 rounded-xl space-y-1">
                    <span className="text-[10px] text-gray-400 block font-semibold uppercase">3. Book Returned</span>
                    <span className="font-mono text-gray-700 dark:text-gray-300">
                      {result.returned_at ? new Date(result.returned_at).toLocaleString() : 'Not Returned Yet'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading verification tool...</p>
          </div>
        }>
          <VerifyTool />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
