'use client';

import React from 'react';
import { BorrowResponse } from '@/lib/types';
import { X, CheckCircle2, Ticket, QrCode, Printer, MapPin, Calendar, BookOpen, User, Phone, Mail } from 'lucide-react';

interface ReceiptModalProps {
  data: BorrowResponse;
  onClose: () => void;
}

export const ReceiptModal: React.FC<ReceiptModalProps> = ({ data, onClose }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="relative w-full max-w-lg bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl overflow-hidden print:shadow-none print:border-none print:w-full">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 p-6 text-white text-center relative print:bg-none print:text-black">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-full bg-white/20 hover:bg-white/30 text-white transition-colors print:hidden"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="w-12 h-12 mx-auto rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center mb-3">
            <CheckCircle2 className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-xl font-extrabold tracking-tight">Borrow Request Confirmed!</h2>
          <p className="text-xs text-emerald-100 font-medium mt-1">
            Your physical pickup token is ready
          </p>
        </div>

        {/* Receipt Content */}
        <div className="p-6 space-y-6">
          {/* Token Box */}
          <div className="bg-emerald-50/80 dark:bg-emerald-950/40 border-2 border-dashed border-emerald-300 dark:border-emerald-700/80 rounded-2xl p-5 text-center relative">
            <span className="text-[10px] uppercase font-bold text-emerald-700 dark:text-emerald-300 tracking-wider">
              Pick-up Token Code
            </span>
            <div className="text-2xl sm:text-3xl font-mono font-black text-emerald-900 dark:text-emerald-100 tracking-widest my-2 select-all">
              {data.token}
            </div>

            {/* QR / Barcode Visual */}
            <div className="mt-3 flex items-center justify-center gap-3 pt-3 border-t border-emerald-200/60 dark:border-emerald-800/60">
              <div className="w-16 h-16 bg-white p-1 rounded-lg border border-emerald-200 flex items-center justify-center text-slate-800 shadow-xs">
                <QrCode className="w-14 h-14" />
              </div>
              <div className="text-left text-xs space-y-1 text-emerald-800 dark:text-emerald-300">
                <p className="font-semibold flex items-center gap-1">
                  <Ticket className="w-3.5 h-3.5" /> Present at Front Desk
                </p>
                <p className="text-[11px] opacity-80 max-w-[200px]">
                  Show this token or QR code to the library staff for instant verification.
                </p>
              </div>
            </div>
          </div>

          {/* Details list */}
          <div className="space-y-3 text-xs">
            <div className="p-3 bg-gray-50 dark:bg-gray-800/50 rounded-xl space-y-1.5">
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <BookOpen className="w-3.5 h-3.5 text-indigo-500" /> Book Title
                </span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {data.book_title || `Book #${data.book_id}`}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-indigo-500" /> Borrower Name
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.user_name}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Mail className="w-3.5 h-3.5 text-indigo-500" /> Email
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.user_email}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Phone className="w-3.5 h-3.5 text-indigo-500" /> Phone
                </span>
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {data.user_phone}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-500 dark:text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-indigo-500" /> Request Time
                </span>
                <span className="font-mono text-gray-800 dark:text-gray-200">
                  {new Date(data.borrowed_at).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-2 p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl text-indigo-900 dark:text-indigo-300">
              <MapPin className="w-4 h-4 text-indigo-600 mt-0.5 shrink-0" />
              <p className="text-[11px] leading-relaxed">
                {data.instructions || 'Please present this token at the physical library front desk to pick up your book.'}
              </p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 print:hidden">
            <button
              onClick={handlePrint}
              className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 transition-colors flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" /> Print Token Receipt
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2 rounded-xl text-xs font-semibold bg-indigo-600 hover:bg-indigo-500 text-white shadow-sm transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
