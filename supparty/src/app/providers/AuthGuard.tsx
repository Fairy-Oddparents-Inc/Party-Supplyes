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
    // 1. Obtener sesión inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      handleNavigation(session);
      setLoading(false);
    });

    // 2. Escuchar cambios de sesión en tiempo real
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, currentSession) => {
      setSession(currentSession);
      handleNavigation(currentSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, [pathname]);

  const handleNavigation = (currentSession: any) => {
    // Si está logueado e intenta ir a la raíz o al login, lo mandamos al dashboard
    if (currentSession && (pathname === '/' || pathname === '/login')) {
      router.push('/dashboard');
    }
    // Si NO está logueado e intenta ir a una ruta privada (ej: /dashboard)
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

  // Evaluamos si es el Dashboard privado para no renderizar la Navbar pública de arriba
  const isDashboard = pathname.startsWith('/dashboard');

  return (
    <>
      {/* Solo muestra la Navbar pública si NO es el login y NO es el dashboard de usuario */}
      {pathname !== '/login' && <Navbar />}
      
      <main>
          {children}
      </main>
    </>
  );
}