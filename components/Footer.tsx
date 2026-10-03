import React from 'react';
import Link from 'next/link';
import { Library, MapPin, Clock, Phone, Mail, Globe, ShieldCheck } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="mt-auto border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950 text-gray-600 dark:text-gray-400">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-cyan-500 flex items-center justify-center text-white shadow-md">
                <Library className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-indigo-600 to-cyan-500 bg-clip-text text-transparent">
                Rulib
              </span>
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
              Your premier city reading hub. Reserve books online and present your digital token at our front desk for instant physical pickup.
            </p>
          </div>

          {/* Location & Hours */}
          <div className="space-y-2">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-indigo-500" /> Physical Branch
            </h4>
            <p className="text-xs text-gray-600 dark:text-gray-300">
              123 Grand Reading Way, Suite 100<br />
              Metro City, NY 10001
            </p>
            <div className="pt-2 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <p className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5 text-indigo-500" /> Mon - Sat: 8:00 AM – 9:00 PM
              </p>
              <p className="text-[11px] pl-4">Sun: 10:00 AM – 6:00 PM</p>
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Member Services
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <Link href="/books" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Browse Book Catalog
                </Link>
              </li>
              <li>
                <Link href="/verify" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors">
                  Verify Pickup Token
                </Link>
              </li>
              <li>
                <Link href="/admin/login" className="hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Staff Admin Portal
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact & Socials */}
          <div className="space-y-3">
            <h4 className="font-bold text-xs uppercase tracking-wider text-gray-900 dark:text-white mb-3">
              Contact & Support
            </h4>
            <div className="space-y-1.5 text-xs text-gray-600 dark:text-gray-300">
              <p className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-indigo-500" /> (555) 234-5678
              </p>
              <p className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-indigo-500" /> support@rulib.org
              </p>
            </div>

            {/* Dummy Social Links */}
            <div className="pt-2 flex items-center gap-3 text-gray-400">
              <a href="#" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 transition-colors" title="Website">
                <Globe className="w-4 h-4" />
              </a>
              <a href="#" className="p-1.5 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-indigo-600 transition-colors" title="Library Portal">
                <Library className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-gray-200 dark:border-gray-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {new Date().getFullYear()} Rulib Public Library System. All rights reserved.</p>
          <p className="text-[11px] text-gray-400">
            Dedicated to community reading and instant book pickup reservation.
          </p>
        </div>
      </div>
    </footer>
  );
};
