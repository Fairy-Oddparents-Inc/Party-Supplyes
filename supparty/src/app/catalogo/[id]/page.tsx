'use client';

import { use, useEffect, useState } from 'react';
import Link from 'next/link';
import { Check, ChevronRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import BuscadorProductos from '@/components/buscador/BuscadorProductos';
import CatalogoCard from '@/components/catalogo/CatalogoCard';
import Galeria from '@/components/producto/Galeria';
import PanelReserva from '@/components/producto/PanelReserva';
import Resenas from '@/components/producto/Resenas';
import Estrellas from '@/components/producto/Estrellas';
import { BENEFICIOS, ESPECIFICACIONES_MOCK, INCLUYE_MOCK } from '@/config/producto';
import { obtenerItem, obtenerRelacionados, type ItemDetalle, type ItemResultado } from '@/lib/items';

type Estado = { id: string; item: ItemDetalle | null; relacionados: ItemResultado[]; error: string | null };

export default function ProductoPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [estado, setEstado] = useState<Estado | null>(null);

  useEffect(() => {
    let vigente = true;
    obtenerItem(id)
      .then(async (item) => {
        const relacionados = item ? await obtenerRelacionados(id, item.category) : [];
        if (vigente) setEstado({ id, item, relacionados, error: null });
      })
      .catch((e: Error) => vigente && setEstado({ id, item: null, relacionados: [], error: e.message }));
    return () => { vigente = false; };
  }, [id]);

  const cargando = estado?.id !== id;
  const item = estado?.item;

  return (
    <div className="min-h-screen bg-gray-50">
      <BuscadorProductos />
      <div className="mx-auto max-w-7xl px-6 pb-16 pt-6">
        <nav aria-label="Migas de pan" className="flex items-center gap-1 text-xs text-gray-500">
          <Link href="/" className="hover:text-[#E91E63]">Inicio</Link><ChevronRight size={12} />
          <Link href="/catalogo" className="hover:text-[#E91E63]">Catálogo</Link><ChevronRight size={12} />
          <span className="truncate">{item?.title ?? '…'}</span>
        </nav>

        {cargando ? (
          <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
            <div className="h-[480px] animate-pulse rounded-xl bg-gray-200" />
            <div className="h-80 animate-pulse rounded-xl bg-gray-200" />
          </div>
        ) : estado?.error ? (
          <p className="py-24 text-center text-red-600">No pudimos cargar el producto: {estado.error}</p>
        ) : !item ? (
          <div className="py-24 text-center text-gray-500">
            <p>Este producto no existe o ya no está disponible.</p>
            <Link href="/catalogo" className="mt-4 inline-block font-semibold text-[#E91E63]">Volver al catálogo</Link>
          </div>
        ) : (
          <>
            <div className="mt-6 grid gap-8 lg:grid-cols-[1fr_340px]">
              <div className="space-y-6">
                <Galeria imagenes={item.imagenes} titulo={item.title} categoria={item.category} />

                <div>
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <h1 className="text-2xl font-extrabold text-gray-900">{item.title}</h1>
                    {item.calificacion !== null && (
                      <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
                        <Estrellas valor={item.calificacion} /> {item.calificacion.toFixed(1)}
                        <span className="text-xs font-normal text-gray-400">({item.totalReviews} reseñas)</span>
                      </p>
                    )}
                  </div>
                  {item.description && <p className="mt-3 text-sm text-gray-600">{item.description}</p>}
                </div>

                {/* Mock: la BD aún no tiene especificaciones técnicas ni "incluye" (ver config/producto.ts) */}
                <dl className="grid grid-cols-2 gap-4 rounded-xl bg-white p-5 shadow-sm md:grid-cols-4">
                  {ESPECIFICACIONES_MOCK.map((e) => (
                    <div key={e.titulo}>
                      <dt className="text-[11px] uppercase text-gray-400">{e.titulo}</dt>
                      <dd className="text-sm font-semibold text-gray-900">{e.valor}</dd>
                    </div>
                  ))}
                </dl>

                <section className="rounded-xl bg-white p-5 shadow-sm">
                  <h2 className="mb-3 text-base font-bold text-gray-900">Tu reserva incluye</h2>
                  <ul className="space-y-2">
                    {INCLUYE_MOCK.map((t) => (
                      <li key={t} className="flex items-start gap-2 text-sm text-gray-600"><Check size={16} className="mt-0.5 text-emerald-500" /> {t}</li>
                    ))}
                  </ul>
                </section>
              </div>

              <PanelReserva item={item} />
            </div>

            <div className="mt-8"><Resenas item={item} /></div>

            {estado!.relacionados.length > 0 && (
              <section className="mt-10">
                <h2 className="mb-4 text-lg font-bold text-gray-900">También te puede interesar</h2>
                <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
                  {estado!.relacionados.map((r) => <CatalogoCard key={r.id} item={r} />)}
                </div>
              </section>
            )}

            <section className="mt-10 grid gap-4 rounded-xl bg-white p-6 shadow-sm sm:grid-cols-2 lg:grid-cols-4">
              {BENEFICIOS.map((b) => (
                <div key={b.titulo}>
                  <p className="text-sm font-bold text-gray-900">{b.titulo}</p>
                  <p className="text-xs text-gray-500">{b.texto}</p>
                </div>
              ))}
            </section>
          </>
        )}
      </div>
      <Footer />
    </div>
  );
}
