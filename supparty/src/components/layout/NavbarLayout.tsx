// src/components/layout/NavbarLayout.tsx
'use client';

import { usePathname } from 'next/navigation';
import Navbar from '@/components/Navbar';

// Layout global: navbar sticky + contenido. Todas las páginas son hijas de este layout.
// El footer NO va aquí: cada página coloca <Footer /> por su cuenta.
export default function NavbarLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const hideNavbar = pathname === '/login';
  const variant = pathname.startsWith('/dashboard') ? 'dashboard' : 'public';

  return (
    <>
      {!hideNavbar && <Navbar variant={variant} />}
      <main>{children}</main>
    </>
  );
}
