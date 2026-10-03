import { Book } from './types';

/**
 * Extracts and deduplicates individual categories from a list of books.
 * Handles comma-separated values like "Fantasy, Romance", trims whitespace,
 * eliminates duplicate categories, and returns a sorted list.
 */
export function extractUniqueCategories(books: Book[]): string[] {
  const categorySet = new Set<string>();

  books.forEach(book => {
    if (!book.category) return;

    // Split by comma in case multiple categories are stored as "Fantasy, Romance"
    const parts = book.category.split(',');
    parts.forEach(part => {
      const trimmed = part.trim();
      if (trimmed) {
        // Capitalize first letter of each word for clean presentation
        const formatted = trimmed
          .split(' ')
          .map(w => w.charAt(0).toUpperCase() + w.slice(1))
          .join(' ');
        categorySet.add(formatted);
      }
    });
  });

  const categories = Array.from(categorySet);
  categories.sort((a, b) => a.localeCompare(b));
  return categories;
}
