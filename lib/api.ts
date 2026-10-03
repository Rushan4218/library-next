import {
  Book,
  BookStatus,
  BorrowRecord,
  BorrowRequest,
  BorrowResponse,
  CreateBookInput,
  TokenVerification,
  UpdateBookInput,
  AuthResponse
} from './types';
import { MockStore } from './mockStore';

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8000/api/v1';

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 3000): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal
    });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const api = {
  // Admin Login
  async loginAdmin(username: string, password: string): Promise<AuthResponse> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/auth/login/json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({ detail: 'Authentication failed' }));
      throw new Error(err.detail || 'Invalid credentials');
    } catch (err: any) {
      if (err.message && err.message.includes('Invalid credentials')) {
        throw err;
      }
      // Demo / Mock fallback check for default credentials
      if (username === 'admin' && password === 'adminsecret') {
        return {
          access_token: 'mock-jwt-token-admin-' + Date.now(),
          token_type: 'bearer'
        };
      }
      throw new Error('Invalid credentials (Try admin / adminsecret)');
    }
  },

  // GET /books
  async getBooks(params?: { search?: string; category?: string; status?: string; skip?: number; limit?: number }): Promise<Book[]> {
    try {
      const query = new URLSearchParams();
      if (params?.search) query.append('search', params.search);
      if (params?.category) query.append('category', params.category);
      if (params?.status) query.append('status', params.status);
      if (params?.skip !== undefined) query.append('skip', String(params.skip));
      if (params?.limit !== undefined) query.append('limit', String(params.limit));

      const res = await fetchWithTimeout(`${BASE_URL}/books?${query.toString()}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback to mock
    }

    let books = MockStore.getBooks();
    if (params?.search) {
      const q = params.search.toLowerCase();
      books = books.filter(b => 
        b.title.toLowerCase().includes(q) ||
        b.author.toLowerCase().includes(q) ||
        (b.isbn && b.isbn.toLowerCase().includes(q))
      );
    }
    if (params?.category && params.category !== 'ALL') {
      books = books.filter(b => b.category?.toLowerCase() === params.category?.toLowerCase());
    }
    if (params?.status && params.status !== 'ALL') {
      books = books.filter(b => b.status === params.status);
    }
    const skip = params?.skip || 0;
    const limit = params?.limit || 50;
    return books.slice(skip, skip + limit);
  },

  // GET /books/{id}
  async getBook(id: number): Promise<Book> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/books/${id}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const book = MockStore.getBooks().find(b => b.id === id);
    if (!book) throw new Error('Book not found');
    return book;
  },

  // POST /books/{id}/borrow
  async borrowBook(bookId: number, details: BorrowRequest): Promise<BorrowResponse> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/books/${bookId}/borrow`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(details)
      });
      if (res.ok) {
        return await res.json();
      }
      const err = await res.json().catch(() => ({}));
      if (err.detail) throw new Error(err.detail);
    } catch (err: any) {
      if (err.message && err.message !== 'Failed to fetch') {
        throw err;
      }
    }

    // Fallback Mock borrow
    const books = MockStore.getBooks();
    const bookIndex = books.findIndex(b => b.id === bookId);
    if (bookIndex === -1) throw new Error('Book not found');
    if (books[bookIndex].status !== 'AVAILABLE') {
      throw new Error(`Book is currently ${books[bookIndex].status.toLowerCase()}`);
    }

    // Update book status
    books[bookIndex].status = 'BORROWED';
    books[bookIndex].updated_at = new Date().toISOString();
    MockStore.saveBooks(books);

    // Create record
    const token = MockStore.generateToken();
    const records = MockStore.getRecords();
    const newRecord: BorrowRecord = {
      id: records.length + 1,
      token,
      book_id: bookId,
      book_title: books[bookIndex].title,
      user_name: details.user_name,
      user_email: details.user_email,
      user_phone: details.user_phone,
      user_address: details.user_address,
      status: 'PENDING_PICKUP',
      borrowed_at: new Date().toISOString(),
      fulfilled_at: null,
      returned_at: null,
      book: books[bookIndex]
    };
    records.unshift(newRecord);
    MockStore.saveRecords(records);

    return {
      token,
      status: 'PENDING_PICKUP',
      book_id: bookId,
      book_title: books[bookIndex].title,
      user_name: details.user_name,
      user_email: details.user_email,
      user_phone: details.user_phone,
      user_address: details.user_address,
      borrowed_at: newRecord.borrowed_at,
      instructions: 'Please present this token at the physical library front desk to pick up your book.'
    };
  },

  // GET /borrow/verify/{token}
  async verifyToken(token: string): Promise<TokenVerification> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/borrow/verify/${encodeURIComponent(token)}`);
      if (res.ok) {
        return await res.json();
      }
    } catch {
      // fallback
    }

    const records = MockStore.getRecords();
    const record = records.find(r => r.token.toLowerCase() === token.trim().toLowerCase());
    if (!record) {
      return {
        valid: false,
        token,
        status: 'CANCELLED',
        book: {
          id: 0,
          title: 'Unknown Book',
          author: 'Unknown',
          status: 'MAINTENANCE',
          created_at: '',
          updated_at: ''
        },
        borrower_name: 'Unknown',
        borrower_email: '',
        borrowed_at: '',
        fulfilled_at: null,
        returned_at: null
      };
    }

    const book = MockStore.getBooks().find(b => b.id === record.book_id) || record.book || {
      id: record.book_id,
      title: record.book_title || 'Unknown Book',
      author: 'Unknown',
      status: 'BORROWED',
      created_at: record.borrowed_at,
      updated_at: record.borrowed_at
    };

    return {
      valid: true,
      token: record.token,
      status: record.status,
      book,
      borrower_name: record.user_name,
      borrower_email: record.user_email,
      borrowed_at: record.borrowed_at,
      fulfilled_at: record.fulfilled_at,
      returned_at: record.returned_at
    };
  },

  // ADMIN ENDPOINTS

  // POST /admin/books
  async createBook(input: CreateBookInput, adminToken?: string): Promise<Book> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/books`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(input)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const books = MockStore.getBooks();
    const newBook: Book = {
      id: books.length > 0 ? Math.max(...books.map(b => b.id)) + 1 : 1,
      title: input.title,
      author: input.author,
      isbn: input.isbn || '',
      description: input.description || '',
      category: input.category || 'General',
      status: 'AVAILABLE',
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    books.unshift(newBook);
    MockStore.saveBooks(books);
    return newBook;
  },

  // PUT /admin/books/{id}
  async updateBook(id: number, input: UpdateBookInput, adminToken?: string): Promise<Book> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/books/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify(input)
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const books = MockStore.getBooks();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Book not found');
    books[idx] = {
      ...books[idx],
      ...input,
      updated_at: new Date().toISOString()
    };
    MockStore.saveBooks(books);
    return books[idx];
  },

  // PATCH /admin/books/{id}/status
  async updateBookStatus(id: number, status: BookStatus, adminToken?: string): Promise<Book> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/books/${id}/status`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        },
        body: JSON.stringify({ status })
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const books = MockStore.getBooks();
    const idx = books.findIndex(b => b.id === id);
    if (idx === -1) throw new Error('Book not found');
    books[idx].status = status;
    books[idx].updated_at = new Date().toISOString();
    MockStore.saveBooks(books);
    return books[idx];
  },

  // DELETE /admin/books/{id}
  async deleteBook(id: number, adminToken?: string): Promise<boolean> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/books/${id}`, {
        method: 'DELETE',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        }
      });
      if (res.status === 204 || res.ok) return true;
    } catch {
      // fallback
    }

    const books = MockStore.getBooks().filter(b => b.id !== id);
    MockStore.saveBooks(books);
    return true;
  },

  // GET /admin/borrowing-history
  async getBorrowingHistory(params?: { status?: string; token?: string; user_email?: string; book_id?: number }, adminToken?: string): Promise<BorrowRecord[]> {
    try {
      const query = new URLSearchParams();
      if (params?.status) query.append('status', params.status);
      if (params?.token) query.append('token', params.token);
      if (params?.user_email) query.append('user_email', params.user_email);
      if (params?.book_id) query.append('book_id', String(params.book_id));

      const res = await fetchWithTimeout(`${BASE_URL}/admin/borrowing-history?${query.toString()}`, {
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    let records = MockStore.getRecords();
    if (params?.status && params.status !== 'ALL') {
      records = records.filter(r => r.status === params.status);
    }
    if (params?.token) {
      const q = params.token.toLowerCase();
      records = records.filter(r => r.token.toLowerCase().includes(q));
    }
    if (params?.user_email) {
      const q = params.user_email.toLowerCase();
      records = records.filter(r => r.user_email.toLowerCase().includes(q));
    }
    if (params?.book_id) {
      records = records.filter(r => r.book_id === params.book_id);
    }
    return records;
  },

  // PATCH /admin/borrowing-history/{record_id}/fulfill
  async fulfillBorrow(recordId: number, adminToken?: string): Promise<BorrowRecord> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/borrowing-history/${recordId}/fulfill`, {
        method: 'PATCH',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const records = MockStore.getRecords();
    const idx = records.findIndex(r => r.id === recordId);
    if (idx === -1) throw new Error('Record not found');
    records[idx].status = 'FULFILLED';
    records[idx].fulfilled_at = new Date().toISOString();
    MockStore.saveRecords(records);
    return records[idx];
  },

  // PATCH /admin/borrowing-history/{record_id}/return
  async returnBorrow(recordId: number, adminToken?: string): Promise<BorrowRecord> {
    try {
      const res = await fetchWithTimeout(`${BASE_URL}/admin/borrowing-history/${recordId}/return`, {
        method: 'PATCH',
        headers: {
          ...(adminToken ? { Authorization: `Bearer ${adminToken}` } : {})
        }
      });
      if (res.ok) return await res.json();
    } catch {
      // fallback
    }

    const records = MockStore.getRecords();
    const idx = records.findIndex(r => r.id === recordId);
    if (idx === -1) throw new Error('Record not found');
    records[idx].status = 'RETURNED';
    records[idx].returned_at = new Date().toISOString();
    MockStore.saveRecords(records);

    // Reset book availability
    const books = MockStore.getBooks();
    const bIdx = books.findIndex(b => b.id === records[idx].book_id);
    if (bIdx !== -1) {
      books[bIdx].status = 'AVAILABLE';
      books[bIdx].updated_at = new Date().toISOString();
      MockStore.saveBooks(books);
    }

    return records[idx];
  }
};
