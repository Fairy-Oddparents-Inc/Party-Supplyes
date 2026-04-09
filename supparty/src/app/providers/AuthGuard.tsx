'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { supabase } from '@/lib/supabase';

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const isLoggedInFlag = localStorage.getItem('isLoggedIn');

      // Si no hay sesión en Supabase o la bandera es explícitamente 'false'
      if (!session || isLoggedInFlag === 'false') {
        localStorage.setItem('isLoggedIn', 'false');
        
        if (pathname !== '/login') {
          router.push('/login');
        } else {
          setAuthorized(true);
        }
      } else {
        localStorage.setItem('isLoggedIn', 'true');
        setAuthorized(true);
        
        // Si ya está logueado e intenta ir al login, lo mandamos al home
        if (pathname === '/login') {
          router.push('/features/homePage');
        } else {
          setAuthorized(true);
        }
      }
    };

    checkUser();
  }, [router, pathname]);

  // Bloqueamos el renderizado hasta confirmar que el usuario tiene permitido ver la ruta actual
  if (!authorized && pathname !== '/login') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p>Verificando sesión...</p>
      </div>
    );
  }

  return <>{children}</>;
}