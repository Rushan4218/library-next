import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '@/lib/api';
import { Book, BorrowRequest, CreateBookInput, UpdateBookInput, BookStatus } from '@/lib/types';
import { extractUniqueCategories } from '@/lib/categories';

export function useAllBooks() {
  return useQuery({
    queryKey: ['books', 'all'],
    queryFn: () => api.getBooks({ limit: 200 })
  });
}

export function useBooks(params?: { search?: string; category?: string; status?: string; skip?: number; limit?: number }) {
  return useQuery({
    queryKey: ['books', params],
    queryFn: () => api.getBooks(params)
  });
}

export function useBookDetail(id: number) {
  return useQuery({
    queryKey: ['book', id],
    queryFn: () => api.getBook(id),
    enabled: !!id && !isNaN(id)
  });
}

export function useDynamicCategories() {
  const { data: books = [] } = useAllBooks();
  return extractUniqueCategories(books);
}

export function useBorrowBook() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ bookId, details }: { bookId: number; details: BorrowRequest }) =>
      api.borrowBook(bookId, details),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
      queryClient.invalidateQueries({ queryKey: ['borrowHistory'] });
    }
  });
}

export function useVerifyToken(token: string) {
  return useQuery({
    queryKey: ['token', token],
    queryFn: () => api.verifyToken(token),
    enabled: !!token && token.trim().length > 0
  });
}

export function useAdminCreateBook(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateBookInput) => api.createBook(input, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}

export function useAdminUpdateBook(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, input }: { id: number; input: UpdateBookInput }) => api.updateBook(id, input, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}

export function useAdminUpdateStatus(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }: { id: number; status: BookStatus }) => api.updateBookStatus(id, status, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}

export function useAdminDeleteBook(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: number) => api.deleteBook(id, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}

export function useBorrowingHistory(params?: { status?: string; token?: string; user_email?: string; book_id?: number }, adminToken?: string) {
  return useQuery({
    queryKey: ['borrowHistory', params, adminToken],
    queryFn: () => api.getBorrowingHistory(params, adminToken)
  });
}

export function useFulfillBorrow(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: number) => api.fulfillBorrow(recordId, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowHistory'] });
    }
  });
}

export function useReturnBorrow(adminToken?: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (recordId: number) => api.returnBorrow(recordId, adminToken),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['borrowHistory'] });
      queryClient.invalidateQueries({ queryKey: ['books'] });
    }
  });
}
