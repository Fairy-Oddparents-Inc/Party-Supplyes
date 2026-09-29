'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      handleNavigation(session);
      setLoading(false);
    });

    // Escuchar cambios de sesión
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      handleNavigation(currentSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleNavigation = (currentSession: any) => {
    if (pathname === '/reset-password') return;

    if (currentSession && (pathname === '/' || pathname === '/login')) {
      router.push('/dashboard');
    }
    if (!currentSession && pathname.startsWith('/dashboard')) {
      router.push('/');
    }
  };

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