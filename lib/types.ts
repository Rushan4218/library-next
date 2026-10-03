export type BookStatus = 'AVAILABLE' | 'BORROWED' | 'MAINTENANCE' | 'RESERVED';

export type BorrowStatus = 'PENDING_PICKUP' | 'FULFILLED' | 'RETURNED' | 'CANCELLED';

export interface Book {
  id: number;
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  category?: string;
  status: BookStatus;
  created_at: string;
  updated_at: string;
}

export interface BorrowRequest {
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
}

export interface BorrowResponse {
  token: string;
  status: BorrowStatus;
  book_id: number;
  book_title?: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  borrowed_at: string;
  instructions?: string;
}

export interface TokenVerification {
  valid: boolean;
  token: string;
  status: BorrowStatus;
  book: Book;
  borrower_name: string;
  borrower_email: string;
  borrowed_at: string;
  fulfilled_at: string | null;
  returned_at: string | null;
}

export interface BorrowRecord {
  id: number;
  token: string;
  book_id: number;
  book_title?: string;
  user_name: string;
  user_email: string;
  user_phone: string;
  user_address: string;
  status: BorrowStatus;
  borrowed_at: string;
  fulfilled_at: string | null;
  returned_at: string | null;
  book?: Book;
}

export interface CreateBookInput {
  title: string;
  author: string;
  isbn?: string;
  description?: string;
  category?: string;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
  isbn?: string;
  description?: string;
  category?: string;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}
