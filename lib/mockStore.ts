import { Book, BorrowRecord, BorrowStatus, BookStatus } from './types';

const INITIAL_BOOKS: Book[] = [
  {
    id: 1,
    title: "Clean Code: A Handbook of Agile Software Craftsmanship",
    author: "Robert C. Martin",
    isbn: "978-0132350884",
    category: "Technology",
    description: "Even bad code can function. But if code isn't clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn't have to be that way.",
    status: "AVAILABLE",
    created_at: "2026-09-01T10:00:00Z",
    updated_at: "2026-09-01T10:00:00Z",
  },
  {
    id: 2,
    title: "Design Patterns: Elements of Reusable Object-Oriented Software",
    author: "Erich Gamma, Richard Helm, Ralph Johnson, John Vlissides",
    isbn: "978-0201633610",
    category: "Computer Science",
    description: "Capturing a wealth of experience about the design of object-oriented software, four top-notch designers present a catalog of simple and succinct solutions to commonly occurring design problems.",
    status: "AVAILABLE",
    created_at: "2026-09-05T11:30:00Z",
    updated_at: "2026-09-05T11:30:00Z",
  },
  {
    id: 3,
    title: "Designing Data-Intensive Applications",
    author: "Martin Kleppmann",
    isbn: "978-1449373320",
    category: "Technology",
    description: "Data is at the center of many challenges in system design today. Difficult issues such as scalability, consistency, reliability, efficiency, and maintainability need to be figured out.",
    status: "BORROWED",
    created_at: "2026-09-10T09:15:00Z",
    updated_at: "2026-10-01T14:20:00Z",
  },
  {
    id: 4,
    title: "Structure and Interpretation of Computer Programs",
    author: "Harold Abelson, Gerald Jay Sussman",
    isbn: "978-0262510875",
    category: "Computer Science",
    description: "Structure and Interpretation of Computer Programs has had a dramatic impact on computer science curricula at the M.I.T. level.",
    status: "AVAILABLE",
    created_at: "2026-09-12T16:00:00Z",
    updated_at: "2026-09-12T16:00:00Z",
  },
  {
    id: 5,
    title: "The Pragmatic Programmer: Your Journey to Mastery",
    author: "David Thomas, Andrew Hunt",
    isbn: "978-0135957059",
    category: "Technology",
    description: "The Pragmatic Programmer cuts through the increasing specialization and technicalities of modern software development to examine the core process.",
    status: "MAINTENANCE",
    created_at: "2026-09-15T08:45:00Z",
    updated_at: "2026-10-02T10:00:00Z",
  },
  {
    id: 6,
    title: "Dune",
    author: "Frank Herbert",
    isbn: "978-0441172719",
    category: "Sci-Fi & Fantasy",
    description: "Set on the desert planet Arrakis, Dune is the story of the boy Paul Atreides, heir to a noble family tasked with ruling an inhospitable world where the only thing of value is the 'spice' melange.",
    status: "AVAILABLE",
    created_at: "2026-09-20T12:00:00Z",
    updated_at: "2026-09-20T12:00:00Z",
  },
  {
    id: 7,
    title: "Thinking, Fast and Slow",
    author: "Daniel Kahneman",
    isbn: "978-0374533557",
    category: "Psychology",
    description: "In the international bestseller, Daniel Kahneman, the renowned psychologist and winner of the Nobel Prize in Economics, takes us on a groundbreaking tour of the mind.",
    status: "RESERVED",
    created_at: "2026-09-22T15:30:00Z",
    updated_at: "2026-10-03T11:00:00Z",
  },
  {
    id: 8,
    title: "Atomic Habits",
    author: "James Clear",
    isbn: "978-0735211292",
    category: "Self-Help",
    description: "No matter your goals, Atomic Habits offers a proven framework for improving—every day. James Clear reveals practical strategies to form good habits and break bad ones.",
    status: "AVAILABLE",
    created_at: "2026-09-25T14:10:00Z",
    updated_at: "2026-09-25T14:10:00Z",
  }
];

const INITIAL_RECORDS: BorrowRecord[] = [
  {
    id: 1,
    token: "LIB-9X82-K4M1",
    book_id: 3,
    book_title: "Designing Data-Intensive Applications",
    user_name: "Sarah Connor",
    user_email: "sarah@cyberdyne.io",
    user_phone: "+1-555-0199",
    user_address: "742 Evergreen Terrace, Springfield",
    status: "PENDING_PICKUP",
    borrowed_at: "2026-10-01T14:20:00Z",
    fulfilled_at: null,
    returned_at: null,
    book: INITIAL_BOOKS[2]
  }
];

const STORAGE_KEY_BOOKS = 'rulib_books_v1';
const STORAGE_KEY_RECORDS = 'rulib_records_v1';

export class MockStore {
  static getBooks(): Book[] {
    if (typeof window === 'undefined') return INITIAL_BOOKS;
    const data = localStorage.getItem(STORAGE_KEY_BOOKS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(INITIAL_BOOKS));
      return INITIAL_BOOKS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_BOOKS;
    }
  }

  static saveBooks(books: Book[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_BOOKS, JSON.stringify(books));
  }

  static getRecords(): BorrowRecord[] {
    if (typeof window === 'undefined') return INITIAL_RECORDS;
    const data = localStorage.getItem(STORAGE_KEY_RECORDS);
    if (!data) {
      localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(INITIAL_RECORDS));
      return INITIAL_RECORDS;
    }
    try {
      return JSON.parse(data);
    } catch {
      return INITIAL_RECORDS;
    }
  }

  static saveRecords(records: BorrowRecord[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEY_RECORDS, JSON.stringify(records));
  }

  static generateToken(): string {
    const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
    const randPart1 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    const randPart2 = Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    return `LIB-${randPart1}-${randPart2}`;
  }
}
