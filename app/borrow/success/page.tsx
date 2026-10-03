'use client';

import React, { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { TokenVerification } from '@/lib/types';
import { api } from '@/lib/api';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { CheckCircle2, QrCode, Ticket, Printer, BookOpen, User, Mail, Calendar, ArrowLeft, Loader2 } from 'lucide-react';

function ReceiptContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  const [data, setData] = useState<TokenVerification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (token) {
      api.verifyToken(token).then(res => {
        setData(res);
        setLoading(false);
      });
    } else {
      setLoading(false);
    }
  }, [token]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="py-24 flex flex-col items-center justify-center text-gray-400">
        <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
        <p className="text-xs">Loading receipt details...</p>
      </div>
    );
  }

  if (!token || !data || !data.valid) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
          <Ticket className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invalid or Missing Token</h2>
        <p className="text-xs text-gray-500">
          No valid pick-up token record was found for this link.
        </p>
        <Link
          href="/books"
          className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
        >
          Browse Catalog
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <Link
        href="/books"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 print:hidden"
      >
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </Link>

      <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-xl overflow-hidden print:shadow-none print:border-none">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white text-center">
          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h1 className="text-2xl font-extrabold">Borrow Request Receipt</h1>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Physical Library Pick-up Token
          </p>
        </div>

        {/* Receipt Body */}
        <div className="p-6 space-y-6">
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-dashed border-emerald-300 dark:border-emerald-700 rounded-2xl p-5 text-center">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">
              Token ID
            </span>
            <div className="text-3xl font-mono font-black text-emerald-900 dark:text-emerald-100 tracking-widest my-2">
              {data.token}
            </div>

            <div className="mt-4 flex items-center justify-center gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-emerald-200 flex items-center justify-center text-slate-800">
                <QrCode className="w-14 h-14" />
              </div>
              <div className="text-left text-xs space-y-1 text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" /> Present at Front Desk
                </p>
                <p className="text-[11px] opacity-80 max-w-[200px]">
                  Show this token to physical library staff to pick up your book.
                </p>
              </div>
            </div>
          </div>

          <div className="p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-2 text-xs">
            <div className="flex justify-between text-gray-500">
              <span>Book Title:</span>
              <span className="font-semibold text-gray-900 dark:text-white">{data.book.title}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Author:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{data.book.author}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Borrower:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{data.borrower_name}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Email:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">{data.borrower_email}</span>
            </div>
            <div className="flex justify-between text-gray-500">
              <span>Request Date:</span>
              <span className="font-mono text-gray-800 dark:text-gray-200">{new Date(data.borrowed_at).toLocaleString()}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Token
            </button>

            <Link
              href="/books"
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 text-white hover:bg-indigo-500"
            >
              Back to Catalog
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BorrowSuccessPage() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Suspense fallback={
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading receipt...</p>
          </div>
        }>
          <ReceiptContent />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}
