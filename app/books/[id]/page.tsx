'use client';

import React, { useEffect, useState, use } from 'react';
import Link from 'next/link';
import { Book, BorrowResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { BorrowModal } from '@/components/BorrowModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { BookOpen, User, Hash, ArrowLeft, BookmarkCheck, Calendar, Info, Loader2 } from 'lucide-react';

export default function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const bookId = parseInt(resolvedParams.id, 10);

  const [book, setBook] = useState<Book | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [receiptData, setReceiptData] = useState<BorrowResponse | null>(null);

  const loadBook = async () => {
    setLoading(true);
    try {
      const data = await api.getBook(bookId);
      setBook(data);
    } catch (err: any) {
      setError(err.message || 'Book not found');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBook();
  }, [bookId]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-4xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <Link
          href="/books"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-indigo-600 dark:hover:text-indigo-400 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Catalog
        </Link>

        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading book details...</p>
          </div>
        ) : error || !book ? (
          <div className="p-8 bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 text-center space-y-3">
            <Info className="w-10 h-10 text-rose-500 mx-auto" />
            <h2 className="text-lg font-bold">Book Not Found</h2>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">{error}</p>
            <Link
              href="/books"
              className="inline-block px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
            >
              Return to Catalog
            </Link>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 sm:p-10 shadow-lg space-y-8">
            {/* Header info */}
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 border-b border-gray-100 dark:border-gray-800 pb-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md">
                    {book.category || 'General'}
                  </span>
                  <StatusBadge status={book.status} type="book" size="md" />
                </div>

                <h1 className="text-2xl sm:text-3xl font-black text-gray-900 dark:text-white leading-tight">
                  {book.title}
                </h1>

                <p className="text-sm font-medium text-gray-600 dark:text-gray-300 flex items-center gap-1.5">
                  <User className="w-4 h-4 text-gray-400" /> By {book.author}
                </p>
              </div>

              {/* Borrow Trigger */}
              {book.status === 'AVAILABLE' ? (
                <button
                  onClick={() => setShowBorrowModal(true)}
                  className="px-6 py-3 rounded-2xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:from-indigo-500 hover:to-blue-500 text-white font-bold text-sm shadow-md shadow-indigo-600/20 active:scale-95 transition-all flex items-center justify-center gap-2 shrink-0"
                >
                  <BookmarkCheck className="w-4 h-4" />
                  Borrow Book Online
                </button>
              ) : (
                <div className="px-5 py-2.5 rounded-2xl bg-gray-100 dark:bg-gray-800 text-gray-400 text-xs font-semibold text-center shrink-0">
                  Currently {book.status.toLowerCase()}
                </div>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400">Synopsis & Details</h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                {book.description || 'No detailed description available for this book.'}
              </p>
            </div>

            {/* Technical Metadata */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-gray-100 dark:border-gray-800 text-xs">
              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
                <span className="text-gray-400 block font-medium flex items-center gap-1">
                  <Hash className="w-3.5 h-3.5" /> ISBN
                </span>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                  {book.isbn || 'N/A'}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
                <span className="text-gray-400 block font-medium flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5" /> Book ID
                </span>
                <span className="font-mono font-semibold text-gray-800 dark:text-gray-200">
                  #{book.id}
                </span>
              </div>

              <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1">
                <span className="text-gray-400 block font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Added to Catalog
                </span>
                <span className="font-mono text-gray-800 dark:text-gray-200">
                  {new Date(book.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* Borrow Modal */}
      {showBorrowModal && book && (
        <BorrowModal
          book={book}
          onClose={() => setShowBorrowModal(false)}
          onSuccess={res => {
            setShowBorrowModal(false);
            setReceiptData(res);
            loadBook();
          }}
        />
      )}

      {/* Receipt Modal */}
      {receiptData && (
        <ReceiptModal
          data={receiptData}
          onClose={() => setReceiptData(null)}
        />
      )}

      <Footer />
    </div>
  );
}
