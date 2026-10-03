'use client';

import React, { useState } from 'react';
import { Book, BorrowRequest, BorrowResponse } from '@/lib/types';
import { api } from '@/lib/api';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { X, BookOpen, User, Mail, Phone, MapPin, CheckCircle } from 'lucide-react';

interface BorrowModalProps {
  book: Book;
  onClose: () => void;
  onSuccess: (response: BorrowResponse) => void;
}

export const BorrowModal: React.FC<BorrowModalProps> = ({ book, onClose, onSuccess }) => {
  const [formData, setFormData] = useState<BorrowRequest>({
    user_name: '',
    user_email: '',
    user_phone: '',
    user_address: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.user_name || !formData.user_email || !formData.user_phone || !formData.user_address) {
      setError('Please fill in all required fields.');
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await api.borrowBook(book.id, formData);
      onSuccess(res);
    } catch (err: any) {
      setError(err.message || 'Failed to complete borrow request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 pt-6 pb-4 border-b border-gray-100 dark:border-gray-800/80 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                Borrow Book Request
              </h3>
              <p className="text-xs text-gray-500 dark:text-gray-400 font-medium line-clamp-1">
                {book.title}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-medium">
              {error}
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Full Name *
            </label>
            <Input
              type="text"
              required
              placeholder="e.g. John Doe"
              value={formData.user_name}
              onChange={e => setFormData({ ...formData, user_name: e.target.value })}
              icon={<User className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Email Address *
            </label>
            <Input
              type="email"
              required
              placeholder="john.doe@example.com"
              value={formData.user_email}
              onChange={e => setFormData({ ...formData, user_email: e.target.value })}
              icon={<Mail className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Phone Number *
            </label>
            <Input
              type="tel"
              required
              placeholder="+1 (555) 019-2834"
              value={formData.user_phone}
              onChange={e => setFormData({ ...formData, user_phone: e.target.value })}
              icon={<Phone className="w-4 h-4" />}
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
              Contact / Delivery Address *
            </label>
            <Textarea
              required
              rows={2}
              placeholder="123 Library Way, Suite 400..."
              value={formData.user_address}
              onChange={e => setFormData({ ...formData, user_address: e.target.value })}
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
              isLoading={isSubmitting}
              variant="default"
              size="sm"
            >
              <CheckCircle className="w-4 h-4 mr-1.5" /> Confirm Borrow & Get Token
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
