'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Book, BookStatus, CreateBookInput } from '@/lib/types';
import { api } from '@/lib/api';
import { StatusBadge } from '@/components/StatusBadge';
import { AdminBookModal } from '@/components/AdminBookModal';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Select } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';
import {
  BookOpen,
  Plus,
  Edit2,
  Trash2,
  Search,
  Loader2,
  AlertTriangle,
  History
} from 'lucide-react';
import Link from 'next/link';

const STATUS_CHANGE_OPTIONS = [
  { value: 'AVAILABLE', label: 'AVAILABLE' },
  { value: 'BORROWED', label: 'BORROWED' },
  { value: 'MAINTENANCE', label: 'MAINTENANCE' },
  { value: 'RESERVED', label: 'RESERVED' }
];

export default function AdminBooksPage() {
  const router = useRouter();
  const { token, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();

  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Book | null>(null);
  const [deleting, setDeleting] = useState(false);

  const loadBooks = async () => {
    setLoading(true);
    try {
      const data = await api.getBooks({
        search: search || undefined
      });
      setBooks(data);
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
      loadBooks();
    }
  }, [isAuthenticated, authLoading, search]);

  const handleSaveBook = async (input: CreateBookInput) => {
    if (editingBook) {
      await api.updateBook(editingBook.id, input, token || undefined);
      toast(`Updated "${input.title}" successfully`, 'success', 'Book Saved');
    } else {
      await api.createBook(input, token || undefined);
      toast(`Created "${input.title}" in catalog`, 'success', 'Book Created');
    }
    await loadBooks();
  };

  const handleStatusChange = async (bookId: number, newStatus: BookStatus) => {
    try {
      await api.updateBookStatus(bookId, newStatus, token || undefined);
      setBooks(prev => prev.map(b => b.id === bookId ? { ...b, status: newStatus } : b));
      toast(`Status updated to ${newStatus}`, 'info', 'Status Overridden');
    } catch (err: any) {
      toast(err.message || 'Failed to update status', 'error', 'Update Failed');
    }
  };

  const handleDeleteBook = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await api.deleteBook(deleteTarget.id, token || undefined);
      toast(`Deleted "${deleteTarget.title}"`, 'success', 'Book Removed');
      setDeleteTarget(null);
      await loadBooks();
    } catch (err: any) {
      toast(err.message || 'Failed to delete book', 'error', 'Delete Failed');
    } finally {
      setDeleting(false);
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
        {/* Header toolbar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-gray-900 dark:text-white flex items-center gap-3">
              <BookOpen className="w-8 h-8 text-indigo-600" />
              Manage Book Catalog
            </h1>
            <p className="text-xs text-gray-500 mt-1">
              Admin CRUD management, status overrides, and catalog inventory
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link href="/admin/history">
              <Button variant="outline" size="default">
                <History className="w-4 h-4 text-indigo-500 mr-1.5" /> Borrowing History
              </Button>
            </Link>

            <Button
              onClick={() => {
                setEditingBook(null);
                setIsModalOpen(true);
              }}
              variant="default"
              size="default"
            >
              <Plus className="w-4 h-4 mr-1.5" /> Add New Book
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="bg-white dark:bg-gray-900 p-4 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-xs mb-6">
          <Input
            type="text"
            placeholder="Search title, author, ISBN..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            icon={<Search className="w-4 h-4" />}
          />
        </div>

        {/* Table / List */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center text-gray-400">
            <Loader2 className="w-8 h-8 animate-spin text-indigo-600 mb-2" />
            <p className="text-xs">Loading admin catalog...</p>
          </div>
        ) : books.length === 0 ? (
          <div className="py-16 text-center bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-8">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <h3 className="text-base font-bold text-gray-800 dark:text-gray-200">No books found</h3>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-gray-50 dark:bg-gray-800/80 text-gray-500 uppercase font-semibold border-b border-gray-200 dark:border-gray-800">
                  <tr>
                    <th className="py-3.5 px-4">ID</th>
                    <th className="py-3.5 px-4">Title & Author</th>
                    <th className="py-3.5 px-4">Category</th>
                    <th className="py-3.5 px-4">ISBN</th>
                    <th className="py-3.5 px-4 min-w-[160px]">Status Override</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-gray-800">
                  {books.map(b => (
                    <tr key={b.id} className="hover:bg-gray-50/50 dark:hover:bg-gray-800/40 transition-colors">
                      <td className="py-4 px-4 font-mono font-bold text-gray-400">
                        #{b.id}
                      </td>

                      <td className="py-4 px-4">
                        <div className="font-bold text-gray-900 dark:text-white max-w-xs line-clamp-1">
                          {b.title}
                        </div>
                        <div className="text-gray-500 text-[11px]">
                          {b.author}
                        </div>
                      </td>

                      <td className="py-4 px-4">
                        <span className="px-2 py-0.5 rounded bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-semibold text-[11px]">
                          {b.category || 'General'}
                        </span>
                      </td>

                      <td className="py-4 px-4 font-mono text-gray-500">
                        {b.isbn || 'N/A'}
                      </td>

                      <td className="py-4 px-4">
                        {/* Custom Shadcn Select dropdown */}
                        <Select
                          value={b.status}
                          onChange={v => handleStatusChange(b.id, v as BookStatus)}
                          options={STATUS_CHANGE_OPTIONS}
                        />
                      </td>

                      <td className="py-4 px-4 text-right">
                        <div className="flex items-center justify-end gap-1">
                          <Button
                            onClick={() => {
                              setEditingBook(b);
                              setIsModalOpen(true);
                            }}
                            variant="ghost"
                            size="icon"
                            title="Edit Book"
                          >
                            <Edit2 className="w-4 h-4 text-indigo-600" />
                          </Button>
                          <Button
                            onClick={() => setDeleteTarget(b)}
                            variant="ghost"
                            size="icon"
                            title="Delete Book"
                          >
                            <Trash2 className="w-4 h-4 text-rose-600" />
                          </Button>
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

      {/* Edit / Create Modal */}
      {isModalOpen && (
        <AdminBookModal
          bookToEdit={editingBook}
          onClose={() => {
            setIsModalOpen(false);
            setEditingBook(null);
          }}
          onSave={handleSaveBook}
        />
      )}

      {/* Delete confirmation modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 p-6 space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 dark:bg-rose-950/60 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <div className="text-center space-y-1">
              <h3 className="font-bold text-lg text-gray-900 dark:text-white">Delete Book?</h3>
              <p className="text-xs text-gray-500">
                Are you sure you want to remove <span className="font-semibold text-gray-800 dark:text-gray-200">&quot;{deleteTarget.title}&quot;</span> from the library catalog?
              </p>
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <Button
                onClick={() => setDeleteTarget(null)}
                variant="ghost"
                size="sm"
              >
                Cancel
              </Button>
              <Button
                onClick={handleDeleteBook}
                isLoading={deleting}
                variant="destructive"
                size="sm"
              >
                Confirm Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
