'use client';

import React, { useState } from 'react';
import { Book, BorrowResponse } from '@/lib/types';
import { useBooks, useDynamicCategories } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { BorrowModal } from '@/components/BorrowModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BookOpen, Search, Loader2, ChevronLeft, ChevronRight, Filter, Tags } from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'AVAILABLE', label: 'AVAILABLE' },
  { value: 'BORROWED', label: 'BORROWED' },
  { value: 'MAINTENANCE', label: 'MAINTENANCE' },
  { value: 'RESERVED', label: 'RESERVED' }
];

export default function BooksPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [status, setStatus] = useState('ALL');
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 12;

  // React Query hook for dynamic category options
  const dynamicCategories = useDynamicCategories();
  const categorySelectOptions = [
    { value: 'ALL', label: 'All Categories' },
    ...dynamicCategories.map(c => ({ value: c, label: c }))
  ];

  // React Query hook for books catalog
  const { data: books = [], isLoading: loading, refetch } = useBooks({
    search: searchQuery || undefined,
    category: category !== 'ALL' ? category : undefined,
    status: status !== 'ALL' ? status : undefined,
    skip: page * PAGE_SIZE,
    limit: PAGE_SIZE
  });

  // Modals
  const [borrowTarget, setBorrowTarget] = useState<Book | null>(null);
  const [receiptData, setReceiptData] = useState<BorrowResponse | null>(null);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
            <BookOpen className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
            Book Catalog
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Browse our complete physical and digital library collection
          </p>
        </div>

        {/* Filter Toolbar */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search Input */}
            <Input
              type="text"
              placeholder="Search title, author, ISBN..."
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setPage(0);
              }}
              icon={<Search className="w-4 h-4" />}
            />

            {/* Custom Dynamic Category Select */}
            <Select
              value={category}
              onChange={v => {
                setCategory(v);
                setPage(0);
              }}
              options={categorySelectOptions}
              icon={<Tags className="w-4 h-4" />}
            />

            {/* Custom Status Select */}
            <Select
              value={status}
              onChange={v => {
                setStatus(v);
                setPage(0);
              }}
              options={STATUS_OPTIONS}
              icon={<Filter className="w-4 h-4" />}
            />
          </div>
        </div>

        {/* Grid Content */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading books...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No books found matching criteria</h3>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              Try adjusting your search query or filters.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
              {books.map(b => (
                <BookCard
                  key={b.id}
                  book={b}
                  onBorrow={book => setBorrowTarget(book)}
                />
              ))}
            </div>

            {/* Pagination Controls */}
            <div className="flex items-center justify-between bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 text-xs">
              <span className="text-gray-500">
                Page {page + 1}
              </span>

              <div className="flex items-center gap-2">
                <Button
                  disabled={page === 0}
                  onClick={() => setPage(p => Math.max(0, p - 1))}
                  variant="outline"
                  size="sm"
                >
                  <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                </Button>
                <Button
                  disabled={books.length < PAGE_SIZE}
                  onClick={() => setPage(p => p + 1)}
                  variant="outline"
                  size="sm"
                >
                  Next <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Modals */}
      {borrowTarget && (
        <BorrowModal
          book={borrowTarget}
          onClose={() => setBorrowTarget(null)}
          onSuccess={res => {
            setBorrowTarget(null);
            setReceiptData(res);
            refetch();
          }}
        />
      )}

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
