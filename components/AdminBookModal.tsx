'use client';

import React, { useState } from 'react';
import { Book, CreateBookInput } from '@/lib/types';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, Plus, Edit2 } from 'lucide-react';

interface AdminBookModalProps {
  bookToEdit?: Book | null;
  onClose: () => void;
  onSave: (data: CreateBookInput) => Promise<void>;
}

export const AdminBookModal: React.FC<AdminBookModalProps> = ({ bookToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState<CreateBookInput>({
    title: bookToEdit?.title || '',
    author: bookToEdit?.author || '',
    isbn: bookToEdit?.isbn || '',
    category: bookToEdit?.category || 'Technology',
    description: bookToEdit?.description || ''
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.author) {
      setError('Title and Author are required.');
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await onSave(formData);
      onClose();
    } catch (err: any) {
      setError(err.message || 'Failed to save book');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800/80 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              {bookToEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                {bookToEdit ? 'Edit Book Details' : 'Add New Book to Catalog'}
              </h3>
              <p className="text-xs text-gray-500">
                {bookToEdit ? `Updating ID #${bookToEdit.id}` : 'Fill in catalog metadata'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Book Title *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Design Patterns"
              value={formData.title}
              onChange={e => setFormData({ ...formData, title: e.target.value })}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Author(s) *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. Erich Gamma, Richard Helm..."
              value={formData.author}
              onChange={e => setFormData({ ...formData, author: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                ISBN Number
              </label>
              <Input
                type="text"
                placeholder="e.g. 978-0201633610"
                value={formData.isbn}
                onChange={e => setFormData({ ...formData, isbn: e.target.value })}
                className="font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
                Genre / Category
              </label>
              <Input
                type="text"
                placeholder="e.g. Computer Science"
                value={formData.category}
                onChange={e => setFormData({ ...formData, category: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1">
              Description / Synopsis
            </label>
            <Textarea
              rows={3}
              placeholder="Enter book description..."
              value={formData.description}
              onChange={e => setFormData({ ...formData, description: e.target.value })}
            />
          </div>

          <div className="pt-2 flex items-center justify-end gap-3">
            <Button
              type="button"
              onClick={onClose}
              variant="ghost"
              size="sm"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              isLoading={saving}
              variant="default"
              size="sm"
            >
              {bookToEdit ? 'Save Changes' : 'Create Book'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
