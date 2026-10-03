'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BookOpen, ShieldCheck, Search, LogOut, Menu, X, Library, History } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const isActive = (path: string) => pathname === path;

  return (
    <header className="sticky top-0 z-40 backdrop-blur-md bg-white/80 dark:bg-gray-950/80 border-b border-gray-200/80 dark:border-gray-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-blue-600 to-cyan-500 flex items-center justify-center text-white shadow-md shadow-indigo-500/20 group-hover:scale-105 transition-transform">
              <Library className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-500 bg-clip-text text-transparent">
                Rulib
              </span>
              <span className="block text-[10px] uppercase font-semibold text-gray-500 dark:text-gray-400 tracking-wider -mt-1">
                Library Portal
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            <Link
              href="/"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/') 
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold' 
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              Home
            </Link>

            <Link
              href="/books"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/books')
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <BookOpen className="w-4 h-4" />
              Catalog
            </Link>

            <Link
              href="/verify"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/verify')
                  ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-950/60 dark:text-indigo-300 font-semibold'
                  : 'text-gray-600 dark:text-gray-300 hover:text-indigo-600 hover:bg-gray-50 dark:hover:bg-gray-900'
              }`}
            >
              <Search className="w-4 h-4" />
              Verify Token
            </Link>
          </nav>

          {/* Admin Controls / Login */}
          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated ? (
              <div className="flex items-center gap-2 pl-3 border-l border-gray-200 dark:border-gray-800">
                <Link
                  href="/admin/books"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    pathname?.startsWith('/admin/books')
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  Manage Books
                </Link>

                <Link
                  href="/admin/history"
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                    pathname?.startsWith('/admin/history')
                      ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900 shadow-xs'
                      : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
                  }`}
                >
                  <History className="w-3.5 h-3.5" />
                  Borrow History
                </Link>

                <button
                  onClick={logout}
                  className="p-1.5 rounded-lg text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                  title="Logout Admin"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <Link
                href="/admin/login"
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-gray-900 hover:bg-gray-800 text-white dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100 transition-all flex items-center gap-1.5 shadow-sm"
              >
                <ShieldCheck className="w-4 h-4" />
                Admin Portal
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-gray-200 dark:border-gray-800 bg-white/95 dark:bg-gray-950/95 backdrop-blur-lg px-4 pt-2 pb-4 space-y-2">
          <Link
            href="/"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Home
          </Link>
          <Link
            href="/books"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Catalog
          </Link>
          <Link
            href="/verify"
            onClick={() => setMobileMenuOpen(false)}
            className="block px-3 py-2 rounded-lg text-base font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-900"
          >
            Verify Token
          </Link>
          {isAuthenticated ? (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800 space-y-2">
              <Link
                href="/admin/books"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                Manage Books
              </Link>
              <Link
                href="/admin/history"
                onClick={() => setMobileMenuOpen(false)}
                className="block px-3 py-2 rounded-lg text-base font-medium text-indigo-600 dark:text-indigo-400 hover:bg-indigo-50 dark:hover:bg-indigo-950/40"
              >
                Borrowing History
              </Link>
              <button
                onClick={() => {
                  logout();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-base font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40"
              >
                Logout Admin
              </button>
            </div>
          ) : (
            <div className="pt-2 border-t border-gray-200 dark:border-gray-800">
              <Link
                href="/admin/login"
                onClick={() => setMobileMenuOpen(false)}
                className="block w-full text-center px-4 py-2.5 rounded-xl font-semibold bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              >
                Admin Portal Login
              </Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};
