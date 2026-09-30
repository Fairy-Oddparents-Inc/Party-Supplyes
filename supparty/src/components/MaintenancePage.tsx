// src/components/MaintenancePage.tsx
import Link from 'next/link';
import { IconBarrierBlock } from '@tabler/icons-react';
import Footer from '@/components/layout/Footer';

// Vista para las secciones que todavía no existen.
// Cuando se desarrolle una sección, se reemplaza el contenido de su page.tsx.
export default function MaintenancePage({ title }: { title: string }) {
  return (
    <>
      <section className="min-h-[60vh] bg-gray-50 flex flex-col items-center justify-center text-center px-6 py-20">
        <div className="w-24 h-24 rounded-full bg-[#EFE9F7] text-[#4B1B7D] flex items-center justify-center mb-6">
          <IconBarrierBlock size={48} stroke={1.5} />
        </div>
        <h1 className="text-3xl font-bold text-[#4B1B7D] mb-2">{title}</h1>
        <p className="text-gray-600 max-w-md">
          Estamos trabajando en esta sección. Muy pronto estará disponible.
        </p>
        <Link href="/" className="mt-8 bg-[#E91E63] hover:bg-[#D81B60] text-white font-semibold px-6 py-2.5 rounded-full transition-colors">
          Volver al inicio
        </Link>
      </section>
      <Footer />
    </>
  );
}
