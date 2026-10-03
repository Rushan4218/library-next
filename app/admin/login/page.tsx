'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ShieldCheck, User, Lock, ArrowRight, Info } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const { login, isAuthenticated } = useAuth();

  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('adminsecret');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/books');
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      setError('Please enter username and password');
      return;
    }

    setLoading(true);
    setError(null);
    try {
      await login(username, password);
      router.push('/admin/books');
    } catch (err: any) {
      setError(err.message || 'Login failed. Invalid admin credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <Navbar />

      <main className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md bg-white dark:bg-gray-900 rounded-3xl border border-gray-200 dark:border-gray-800 shadow-2xl p-8 space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-2xl bg-indigo-600 text-white flex items-center justify-center mx-auto shadow-md shadow-indigo-600/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-black tracking-tight text-gray-900 dark:text-white">
              Admin Portal
            </h1>
            <p className="text-xs text-gray-500">
              Sign in with environment-based admin credentials
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 text-xs font-medium">
                {error}
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Admin Username
              </label>
              <Input
                type="text"
                required
                placeholder="admin"
                value={username}
                onChange={e => setUsername(e.target.value)}
                icon={<User className="w-4 h-4" />}
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 dark:text-gray-300 mb-1.5">
                Admin Password
              </label>
              <Input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                icon={<Lock className="w-4 h-4" />}
              />
            </div>

            <div className="p-3 bg-indigo-50/60 dark:bg-indigo-950/40 rounded-xl text-[11px] text-indigo-800 dark:text-indigo-300 flex items-start gap-2">
              <Info className="w-4 h-4 text-indigo-500 shrink-0 mt-0.5" />
              <span>
                Default credentials configured in `.env`: <br />
                Username: <code className="font-bold">admin</code> | Password: <code className="font-bold">adminsecret</code>
              </span>
            </div>

            <Button
              type="submit"
              isLoading={loading}
              variant="default"
              size="lg"
              className="w-full"
            >
              Authenticate & Continue <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
