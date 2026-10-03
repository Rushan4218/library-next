'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Book, BorrowResponse } from '@/lib/types';
import { useBooks, useDynamicCategories } from '@/hooks/useBooks';
import { BookCard } from '@/components/BookCard';
import { BorrowModal } from '@/components/BorrowModal';
import { ReceiptModal } from '@/components/ReceiptModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import {
  Search,
  BookOpen,
  Sparkles,
  Ticket,
  ArrowRight,
  Filter,
  Loader2
} from 'lucide-react';

const STATUS_OPTIONS = [
  { value: 'ALL', label: 'All Statuses' },
  { value: 'AVAILABLE', label: 'Available Only' },
  { value: 'BORROWED', label: 'Borrowed' },
  { value: 'MAINTENANCE', label: 'Maintenance' },
  { value: 'RESERVED', label: 'Reserved' }
];

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedStatus, setSelectedStatus] = useState('ALL');

  // React Query hook for dynamic categories parsing (comma-separated splitting & deduplication)
  const dynamicCategories = useDynamicCategories();
  const categoriesList = ['ALL', ...dynamicCategories];

  // React Query hook for books catalog
  const { data: books = [], isLoading: loading, refetch } = useBooks({
    search: searchQuery || undefined,
    category: selectedCategory !== 'ALL' ? selectedCategory : undefined,
    status: selectedStatus !== 'ALL' ? selectedStatus : undefined
  });

  // Modal states
  const [borrowBookTarget, setBorrowBookTarget] = useState<Book | null>(null);
  const [receiptData, setReceiptData] = useState<BorrowResponse | null>(null);

  // Quick verify input
  const [quickToken, setQuickToken] = useState('');

  const handleBorrowSuccess = (response: BorrowResponse) => {
    setBorrowBookTarget(null);
    setReceiptData(response);
    refetch();
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100 font-sans">
      <Navbar />

      <main className="flex-1">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-indigo-900 via-slate-900 to-gray-950 text-white pt-16 pb-24 px-4 sm:px-6 lg:px-8">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#6366f1_1px,transparent_1px)] [background-size:16px_16px]" />

          <div className="relative max-w-5xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-300 text-xs font-semibold backdrop-blur-md">
              <Sparkles className="w-3.5 h-3.5 text-indigo-300" />
              Physical Pickup Token System Live
            </div>

            <h1 className="text-4xl sm:text-6xl font-black tracking-tight leading-tight">
              Borrow Books Online, <br className="hidden sm:inline" />
              Pick Up at <span className="bg-gradient-to-r from-cyan-400 via-sky-300 to-indigo-300 bg-clip-text text-transparent">Rulib Physical Library</span>
            </h1>

            <p className="max-w-2xl mx-auto text-sm sm:text-base text-gray-300 font-normal leading-relaxed">
              Explore thousands of books across fantasy, technology, romance, science, and fiction. Reserve online, instantly receive your unique <code className="bg-white/10 px-2 py-0.5 rounded font-mono text-cyan-300 text-xs">LIB-XXXX-XXXX</code> token, and collect your book at the front desk.
            </p>

            {/* Quick Search Bar */}
            <div className="max-w-2xl mx-auto pt-4">
              <div className="relative flex items-center bg-white/10 dark:bg-gray-900/80 backdrop-blur-md border border-white/20 dark:border-gray-800 rounded-2xl p-1.5 shadow-2xl focus-within:ring-2 focus-within:ring-cyan-400">
                <Search className="w-5 h-5 text-gray-400 ml-3 shrink-0" />
                <input
                  type="text"
                  placeholder="Search by title, author name, or ISBN..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent px-3 py-2 text-sm text-white placeholder-gray-400 focus:outline-hidden"
                />
                <Button
                  onClick={() => refetch()}
                  variant="gradient"
                  size="default"
                  className="shrink-0"
                >
                  Search
                </Button>
              </div>
            </div>

            {/* Quick Verify Bar */}
            <div className="pt-6 flex flex-wrap items-center justify-center gap-3 text-xs">
              <span className="text-gray-400 font-medium">Already have a token?</span>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/15 px-3 py-1.5 rounded-xl">
                <Ticket className="w-3.5 h-3.5 text-cyan-400" />
                <input
                  type="text"
                  placeholder="e.g. LIB-9X82-K4M1"
                  value={quickToken}
                  onChange={e => setQuickToken(e.target.value)}
                  className="bg-transparent text-white font-mono placeholder-gray-500 text-xs focus:outline-hidden w-36 uppercase"
                />
                {quickToken && (
                  <Link
                    href={`/verify?token=${encodeURIComponent(quickToken)}`}
                    className="px-2 py-0.5 rounded bg-cyan-500 text-gray-950 font-bold hover:bg-cyan-400 text-[11px]"
                  >
                    Verify
                  </Link>
                )}
              </div>
              <Link href="/verify" className="text-cyan-400 hover:underline flex items-center gap-1">
                Token Lookup <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        </section>

        {/* CATALOG SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Header & Status Selector */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="text-2xl font-black text-gray-900 dark:text-white tracking-tight flex items-center gap-2">
                <BookOpen className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                Library Catalog
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                Select a category or status filter to narrow down books
              </p>
            </div>

            {/* Custom Shadcn Select */}
            <div className="w-48">
              <Select
                value={selectedStatus}
                onChange={v => setSelectedStatus(v)}
                options={STATUS_OPTIONS}
                icon={<Filter className="w-4 h-4" />}
              />
            </div>
          </div>

          {/* Dynamic Categories Horizontal Scroll Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {categoriesList.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'bg-white dark:bg-gray-900 text-gray-600 dark:text-gray-300 border border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Book Cards Grid */}
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-gray-400 space-y-3">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
              <p className="text-xs font-medium">Fetching book catalog...</p>
            </div>
          ) : books.length === 0 ? (
            <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
              <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No books found</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 max-w-sm mx-auto">
                Try adjusting your search criteria or resetting filters.
              </p>
              <Button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                  setSelectedStatus('ALL');
                }}
                variant="secondary"
                size="sm"
                className="mt-4"
              >
                Reset Filters
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {books.map(book => (
                <BookCard
                  key={book.id}
                  book={book}
                  onBorrow={b => setBorrowBookTarget(b)}
                />
              ))}
            </div>
          )}
        </section>
      </main>

      {/* Modals */}
      {borrowBookTarget && (
        <BorrowModal
          book={borrowBookTarget}
          onClose={() => setBorrowBookTarget(null)}
          onSuccess={handleBorrowSuccess}
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
