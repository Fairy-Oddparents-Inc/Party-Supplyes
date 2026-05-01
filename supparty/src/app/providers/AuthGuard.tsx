'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import Navbar from '@/components/Navbar';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  const publicRoutes = ['/', '/features/homePage']; 

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      
      const isPublic = publicRoutes.includes(pathname);

      if (isPublic) {
        setAuthorized(true);
        return;
      }

      if (!session) {
        router.push('/login');
        return;
      }

      if (pathname === '/login') {
        router.push('/'); 
      }

      setAuthorized(true);
    };

    checkUser();
  }, [router, pathname]);

  if (!authorized && !publicRoutes.includes(pathname)) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return (
    <>
      {pathname !== '/login' && <Navbar />}
      
      <main className={pathname !== '/login' ? "pt-40" : ""}>
        {children}
      </main>
    </>
  );
}