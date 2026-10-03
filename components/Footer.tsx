import React from 'react';
import Link from 'next/link';
import { Library, Heart, Shield, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white">
                <Library className="w-4 h-4" />
              </div>
              <span className="font-extrabold text-lg tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Rulib
              </span>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 max-w-sm">
              Modern digital catalog and instant pickup reservation system for public & university libraries.
            </p>
            <div className="flex items-center gap-3 text-xs text-emerald-600 dark:text-emerald-400 font-medium">
              <span className="flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> API Online
              </span>
              <span className="flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" /> JWT Admin Auth
              </span>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Explore
            </h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/books" className="hover:text-indigo-600 transition-colors">
                  Book Catalog
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-indigo-600 transition-colors">
                  Token Verification
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-indigo-600 transition-colors">
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Backend Info */}
          <div>
            <h4 className="font-semibold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Backend Integration
            </h4>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
              FastAPI + PostgreSQL + SQLAlchemy 2.0
            </p>
            <span className="inline-block px-2.5 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-[11px] font-mono text-gray-700 dark:text-gray-300">
              http://localhost:8000/api/v1
            </span>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Rulib Library Systems. All rights reserved.</p>
          <p className="flex items-center gap-1">
            Built with Next.js App Router & Tailwind CSS
          </p>
        </div>
      </div>
    </footer>
  );
};
