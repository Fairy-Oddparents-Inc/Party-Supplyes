'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { Session } from '@supabase/supabase-js';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loading, setLoading] = useState(true);

  // Declaramos handleNavigation con useCallback antes de usarlo en el useEffect
  const handleNavigation = useCallback(
    (currentSession: Session | null) => {
      if (pathname === '/reset-password') return;

      if (currentSession && (pathname === '/' || pathname === '/login')) {
        router.push('/dashboard');
      }
      if (!currentSession && pathname.startsWith('/dashboard')) {
        router.push('/');
      }
    },
    [pathname, router]
  );

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      handleNavigation(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      handleNavigation(currentSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [handleNavigation]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-slate-50">
        <p className="text-[#4B1B7D] font-medium animate-pulse">Verificando sesión...</p>
      </div>
    );
  }

  return (
    <>
      {pathname !== '/login' && !pathname.startsWith('/dashboard') && <Navbar />}
      <main>{children}</main>
    </>
  );
}