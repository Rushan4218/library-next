import React from 'react';
import Link from 'next/link';
import { Book } from '@/lib/types';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
import { User, Hash, ArrowRight, BookmarkCheck } from 'lucide-react';

interface BookCardProps {
  book: Book;
  onBorrow: (book: Book) => void;
}

export const BookCard: React.FC<BookCardProps> = ({ book, onBorrow }) => {
  const isAvailable = book.status === 'AVAILABLE';

  // Parse comma-separated categories safely
  const categories = book.category
    ? book.category.split(',').map(c => c.trim()).filter(Boolean)
    : ['General'];

  const primaryCategory = categories[0] || 'General';
  const extraCount = categories.length - 1;

  return (
    <div className="group relative flex flex-col justify-between bg-white dark:bg-gray-900 rounded-2xl border border-gray-200/80 dark:border-gray-800 p-5 shadow-sm hover:shadow-xl hover:border-indigo-200 dark:hover:border-indigo-900/60 transition-all duration-300">
      <div>
        {/* Top Header: Category Badge(s) & Status */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-1.5 overflow-hidden max-w-[65%]">
            <span
              className="inline-block text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60 px-2.5 py-1 rounded-md truncate"
              title={categories.join(', ')}
            >
              {primaryCategory}
            </span>
            {extraCount > 0 && (
              <span
                className="inline-block text-[10px] font-bold text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-1.5 py-0.5 rounded-md shrink-0"
                title={categories.slice(1).join(', ')}
              >
                +{extraCount}
              </span>
            )}
          </div>
          <StatusBadge status={book.status} type="book" size="sm" />
        </div>

        {/* Title & Author */}
        <Link href={`/books/${book.id}`} className="block group-hover:text-indigo-600 transition-colors">
          <h3 className="font-bold text-lg text-gray-900 dark:text-white line-clamp-2 leading-snug mb-1">
            {book.title}
          </h3>
        </Link>
        
        <p className="text-xs text-gray-500 dark:text-gray-400 flex items-center gap-1 mb-3">
          <User className="w-3.5 h-3.5 text-gray-400 shrink-0" />
          <span className="font-medium text-gray-700 dark:text-gray-300 truncate">{book.author}</span>
        </p>

        {/* ISBN if available */}
        {book.isbn && (
          <div className="inline-flex items-center gap-1 text-[11px] font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded mb-3">
            <Hash className="w-3 h-3 text-gray-400" />
            {book.isbn}
          </div>
        )}

        {/* Description preview */}
        {book.description && (
          <p className="text-xs text-gray-600 dark:text-gray-400 line-clamp-3 mb-4 leading-relaxed">
            {book.description}
          </p>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-gray-100 dark:border-gray-800/80 flex items-center justify-between gap-2">
        <Link
          href={`/books/${book.id}`}
          className="text-xs font-semibold text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 flex items-center gap-1 transition-colors"
        >
          Details <ArrowRight className="w-3.5 h-3.5" />
        </Link>

        {isAvailable ? (
          <Button
            onClick={() => onBorrow(book)}
            variant="default"
            size="sm"
          >
            <BookmarkCheck className="w-3.5 h-3.5 mr-1" />
            Borrow Book
          </Button>
        ) : (
          <Button
            disabled
            variant="secondary"
            size="sm"
          >
            Unavailable
          </Button>
        )}
      </div>
    </div>
  );
};
