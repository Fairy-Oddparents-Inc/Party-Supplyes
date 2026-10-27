'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { ChevronRight } from 'lucide-react';
import Footer from '@/components/layout/Footer';
import FiltrosCatalogo, { type ValoresFiltros } from '@/components/catalogo/FiltrosCatalogo';
import CatalogoCard from '@/components/catalogo/CatalogoCard';
import { PRECIO_MAX, POR_PAGINA, TIPOS_MOBILIARIO } from '@/config/catalogo';
import { buscarCatalogo, type ItemOrden, type PaginaCatalogo } from '@/lib/items';

const ORDENES: { value: ItemOrden; label: string }[] = [
  { value: 'recientes', label: 'Relevancia' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'calificacion', label: 'Mejor calificados' },
];

export default function CatalogoPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Suspense fallback={null}>
        <Catalogo />
      </Suspense>
      <Footer />
    </div>
  );
}

function Catalogo() {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get('q') ?? '';
  const max = params.get('max') ? Number(params.get('max')) : PRECIO_MAX;
  const tiposKeys = (params.get('tipos') ?? '').split(',').filter(Boolean);
  const orden = (params.get('orden') as ItemOrden) || 'recientes';
  const pagina = Math.max(1, Number(params.get('p')) || 1);

  const clave = JSON.stringify([q, max, tiposKeys, orden, pagina]);
  const [resultado, setResultado] = useState<{ clave: string; data: PaginaCatalogo; error: string | null } | null>(null);
  const cargando = resultado?.clave !== clave;
  const items = resultado?.data.items ?? [];
  const total = resultado?.data.total ?? 0;
  const totalPaginas = Math.max(1, Math.ceil(total / POR_PAGINA));

  useEffect(() => {
    let vigente = true;
    const terms = TIPOS_MOBILIARIO.filter((t) => tiposKeys.includes(t.key)).map((t) => t.term);
    buscarCatalogo({
      q,
      max: max < PRECIO_MAX ? max : undefined,
      tipos: terms,
      orden,
      pagina,
      porPagina: POR_PAGINA,
    })
      .then((data) => vigente && setResultado({ clave, data, error: null }))
      .catch((e: Error) => vigente && setResultado({ clave, data: { items: [], total: 0 }, error: e.message }));
    return () => { vigente = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clave]);

  // Los filtros viven en la URL: se pueden compartir y el botón "atrás" funciona
  const actualizar = (cambios: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(cambios).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  };

  const aplicar = (v: ValoresFiltros) =>
    actualizar({ max: v.max < PRECIO_MAX ? String(v.max) : '', tipos: v.tipos.join(','), p: '' });

  const tituloSeccion = q
    ? `Resultados para “${q}”`
    : tiposKeys.length === 1
      ? TIPOS_MOBILIARIO.find((t) => t.key === tiposKeys[0])?.label ?? 'Catálogo'
      : 'Catálogo';

  return (
    <div className="mx-auto max-w-7xl px-6 pb-16 pt-6">
      <nav aria-label="Migas de pan" className="flex items-center gap-1 text-xs text-gray-500">
        <Link href="/" className="hover:text-[#E91E63]">Inicio</Link>
        <ChevronRight size={12} />
        <span>{q ? `Resultados para “${q}”` : 'Catálogo'}</span>
      </nav>

      <h1 className="my-6 text-center text-2xl font-extrabold text-gray-900 md:text-3xl">
        Arma tu fiesta completa y ahorra comprando todo junto
      </h1>

      <div className="grid gap-8 lg:grid-cols-[250px_1fr]">
        {/* key: al cambiar la URL (aplicar/limpiar/atrás) el panel se reinicia con los valores vigentes */}
        <FiltrosCatalogo
          key={`${max}|${tiposKeys.join(',')}`}
          inicial={{ max, tipos: tiposKeys }}
          onAplicar={aplicar}
          onLimpiar={() => router.replace('?', { scroll: false })}
        />

        <section>
          <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h2 className="text-xl font-bold text-gray-900">{tituloSeccion}</h2>
              <p className="text-xs text-gray-500">{cargando ? 'Buscando…' : `${total} resultados encontrados`}</p>
            </div>
            <label className="flex items-center gap-2 text-xs text-gray-500">
              Ordenar por:
              <select
                value={orden}
                onChange={(e) => actualizar({ orden: e.target.value === 'recientes' ? '' : e.target.value, p: '' })}
                className="h-8 rounded-md border border-gray-200 bg-white px-2 text-xs font-semibold text-gray-800"
              >
                {ORDENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
              </select>
            </label>
          </div>

          {cargando ? (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {Array.from({ length: 6 }, (_, i) => <div key={i} className="h-96 animate-pulse rounded-xl bg-gray-200" />)}
            </div>
          ) : resultado?.error ? (
            <p className="py-16 text-center text-red-600">No pudimos cargar el catálogo: {resultado.error}</p>
          ) : items.length === 0 ? (
            <p className="py-16 text-center text-gray-500">No encontramos resultados. Prueba con otros filtros.</p>
          ) : (
            <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {items.map((item) => <CatalogoCard key={item.id} item={item} />)}
            </div>
          )}

          {totalPaginas > 1 && (
            <div className="mt-8 flex items-center justify-center gap-4 text-sm">
              <button
                disabled={pagina <= 1}
                onClick={() => actualizar({ p: pagina - 1 > 1 ? String(pagina - 1) : '' })}
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 disabled:opacity-40"
              >
                Anterior
              </button>
              <span className="text-gray-600">Página {pagina} de {totalPaginas}</span>
              <button
                disabled={pagina >= totalPaginas}
                onClick={() => actualizar({ p: String(pagina + 1) })}
                className="rounded-md border border-gray-200 bg-white px-3 py-1.5 disabled:opacity-40"
              >
                Siguiente
              </button>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
