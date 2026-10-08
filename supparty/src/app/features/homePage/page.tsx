'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Calendar, MapPin, Star, BadgeCheck } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { buscarItems, listarCategorias, type ItemOrden, type ItemResultado } from "@/lib/items";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="pb-16">
        <Suspense fallback={null}>
          <BuscadorYResultados />
        </Suspense>

        {/* Banner IA (placeholder del robot: sustituir por la ilustración) */}
        <section className="mt-6 bg-gradient-to-r from-[#1E90E6] to-[#1FB5C4]">
          <div className="max-w-6xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-center gap-6 text-white">
            <ImagePlaceholder label="Robot IA" className="w-28 h-28 rounded-full shrink-0" />
            <div className="text-center md:text-left">
              <h3 className="text-2xl md:text-3xl font-bold leading-tight">Tu asistente IA para<br />organizar la mejor fiesta</h3>
              <Button className="mt-3 rounded-full bg-[#4B1B7D] hover:bg-[#3d1665] text-white font-semibold px-8">
                Recibe ayuda personalizada
              </Button>
            </div>
          </div>
        </section>

        <section className="max-w-6xl mx-auto px-6 pt-12">
          <h2 className="text-xl font-bold text-[#4B1B7D] mb-6">¿Por qué reservar tus servicios para tu evento con Supparty?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            <FeatureCard title="Todo lo que necesitas en un solo lugar" desc="Olvídate de buscar en redes sociales, llamar a cada proveedor e invertir horas en cotizar. En Supparty encuentras mobiliario, experiencias, alimentos, bebidas y más." />
            <FeatureCard title="Suppartners verificados y confiables" desc="Cada Suppartner pasa por un proceso de validación estricto para garantizar profesionalismo, puntualidad y calidad en el servicio." />
            <FeatureCard title="Transparencia total antes de contratar" desc="Consulta fotos reales, descripciones, precios claros, disponibilidad y valoraciones de otros usuarios antes de tomar una decisión." />
            <FeatureCard title="Reserva rápida y segura" desc="Confirma tu servicio en pocos pasos y asegura tu fecha con respaldo. Con Supparty, tu reserva queda registrada y protegida." />
          </div>
        </section>

      </div>
      <Footer />
    </div>
  );
}

function ImagePlaceholder({ label, className = '' }: { label: string; className?: string }) {
  return (
    <div className={`bg-white/30 border-2 border-dashed border-white/60 flex items-center justify-center text-center text-xs font-medium text-white/90 p-2 ${className}`}>
      {label}
    </div>
  );
}

function FeatureCard({ title, desc }: { title: string, desc: string }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col">
      <h4 className="font-bold text-[#4B1B7D] mb-3">{title}</h4>
      <p className="text-sm text-gray-600 flex-1">{desc}</p>
      <div className="mt-4 h-40 rounded-xl bg-gray-100 border-2 border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
        Ilustración
      </div>
    </div>
  );
}

const ORDENES: { value: ItemOrden; label: string }[] = [
  { value: 'recientes', label: 'Más recientes' },
  { value: 'precio_asc', label: 'Precio: menor a mayor' },
  { value: 'precio_desc', label: 'Precio: mayor a menor' },
  { value: 'calificacion', label: 'Mejor calificados' },
];

const selectClass = "h-9 rounded-md border border-gray-300 bg-white px-2 text-sm text-gray-700";

function BuscadorYResultados() {
  const router = useRouter();
  const params = useSearchParams();

  const q = params.get('q') ?? '';
  const cat = params.get('cat') ?? '';
  const min = params.get('min') ?? '';
  const max = params.get('max') ?? '';
  const orden = (params.get('orden') as ItemOrden) || 'recientes';

  const [nombre, setNombre] = useState<string | null>(null);
  const [categorias, setCategorias] = useState<string[]>([]);
  const claveBusqueda = JSON.stringify([q, cat, min, max, orden]);
  const [resultado, setResultado] = useState<{ clave: string; items: ItemResultado[]; error: string | null } | null>(null);
  const cargando = resultado?.clave !== claveBusqueda;
  const items = resultado?.items ?? [];
  const error = resultado?.error ?? null;

  useEffect(() => {
    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return setNombre(null);
      const { data } = await supabase.from('profiles').select('full_name').eq('id', user.id).maybeSingle();
      setNombre(data?.full_name || user.user_metadata?.full_name || user.email || null);
    });
    // Dev: dispara el diagnóstico de tablas; sus logs salen en la terminal de `next dev`
    if (process.env.NODE_ENV !== 'production') fetch('/api/debug/db').catch(() => {});
    listarCategorias().then(setCategorias).catch(() => {});
  }, []);

  useEffect(() => {
    let vigente = true;
    buscarItems({
      q,
      categoria: cat || undefined,
      min: min !== '' ? Number(min) : undefined,
      max: max !== '' ? Number(max) : undefined,
      orden,
    })
      .then((r) => vigente && setResultado({ clave: claveBusqueda, items: r, error: null }))
      .catch((e: Error) => vigente && setResultado({ clave: claveBusqueda, items: [], error: e.message }));
    return () => { vigente = false; };
  }, [claveBusqueda, q, cat, min, max, orden]);

  // Los filtros viven en la URL: se pueden compartir y el botón "atrás" funciona
  const actualizar = (cambios: Record<string, string>) => {
    const next = new URLSearchParams(params.toString());
    Object.entries(cambios).forEach(([k, v]) => (v ? next.set(k, v) : next.delete(k)));
    const qs = next.toString();
    router.replace(qs ? `?${qs}` : '?', { scroll: false });
  };

  const hayFiltros = !!(q || cat || min || max || orden !== 'recientes');

  return (
    <>
      <section>
        <Image
          src="/assets/Halloween.png"
          alt="Verano Party"
          width={3635}
          height={790}
          priority
          className="w-full h-auto"
        />
      </section>

      <section className="px-6 -mt-14 relative z-10">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            actualizar({ q: String(new FormData(e.currentTarget).get('q') ?? '').trim() });
          }}
          className="max-w-4xl mx-auto bg-[#E91E63] p-5 rounded-2xl shadow-lg text-white text-center"
        >
          <h1 className="text-xl font-bold">Tu evento comienza aquí</h1>
          <p className="text-xs opacity-90 mb-4">Busca servicios y revisa la disponibilidad para esa fecha especial</p>
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-[2] flex items-center bg-white rounded-full px-4 text-gray-700">
              <Input
                name="q"
                defaultValue={q}
                key={q}
                placeholder="Carpas, sillas, fotografía, mesas..."
                className="border-0 shadow-none focus-visible:ring-0 bg-transparent"
              />
              <Search className="text-gray-400 shrink-0" size={18} />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-full px-4 text-gray-700">
              {/* Pendiente: filtro por ubicación */}
              <Input disabled title="Próximamente" placeholder="Ubicación" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
              <MapPin className="text-gray-400 shrink-0" size={18} />
            </div>
            <div className="flex-1 flex items-center bg-white rounded-full px-4 text-gray-700">
              {/* Pendiente: filtro por disponibilidad cuando se conozcan los valores de bookings.status */}
              <Input type="date" disabled title="Próximamente" className="border-0 shadow-none focus-visible:ring-0 bg-transparent" />
              <Calendar className="text-gray-400 shrink-0" size={18} />
            </div>
            <Button type="submit" className="bg-[#4B1B7D] hover:bg-[#3d1665] rounded-full px-8 w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" /> Buscar
            </Button>
          </div>
        </form>
      </section>

      <section className="max-w-6xl mx-auto px-6 pt-10 pb-6">
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <select value={cat} onChange={(e) => actualizar({ cat: e.target.value })} className={selectClass} aria-label="Categoría">
            <option value="">Todas las categorías</option>
            {categorias.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
          <Input type="number" min={0} placeholder="Precio mín." defaultValue={min} key={`min-${min}`}
            onBlur={(e) => actualizar({ min: e.target.value })} className="h-9 w-32 bg-white" />
          <Input type="number" min={0} placeholder="Precio máx." defaultValue={max} key={`max-${max}`}
            onBlur={(e) => actualizar({ max: e.target.value })} className="h-9 w-32 bg-white" />
          <select value={orden} onChange={(e) => actualizar({ orden: e.target.value === 'recientes' ? '' : e.target.value })}
            className={selectClass} aria-label="Ordenar por">
            {ORDENES.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          {hayFiltros && (
            <button onClick={() => router.replace('?', { scroll: false })} className="text-sm text-[#E91E63] hover:underline">
              Limpiar filtros
            </button>
          )}
        </div>

        <h2 className="text-2xl font-bold text-[#4B1B7D] mb-6">
          {q ? `Resultados para “${q}”` : hayFiltros ? 'Resultados' : 'Encuentra todo lo que necesitas en un solo lugar'}
        </h2>

        {cargando ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-72 rounded-xl bg-gray-200 animate-pulse" />)}
          </div>
        ) : error ? (
          <p className="text-center text-red-600">No pudimos cargar los resultados: {error}</p>
        ) : items.length === 0 ? (
          <p className="text-center text-gray-500 py-10">No encontramos resultados. Prueba con otros filtros.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {items.map((item) => <ItemCard key={item.id} item={item} />)}
          </div>
        )}
      </section>
    </>
  );
}

function ItemCard({ item }: { item: ItemResultado }) {
  return (
    <div className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow">
      {item.imagen ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.imagen} alt={item.title} className="h-48 w-full object-cover" />
      ) : (
        <div className="h-48 bg-gray-100 border-b border-dashed border-gray-300 flex items-center justify-center text-xs text-gray-400">
          Imagen del paquete
        </div>
      )}
      <div className="p-4 text-sm space-y-2 text-gray-600">
        <h3 className="text-center text-lg font-bold text-[#4B1B7D]">{item.title}</h3>
        {item.category && <p className="text-xs uppercase tracking-wide text-gray-400">{item.category}</p>}
        <p className="font-bold text-gray-800">${item.price_per_day.toLocaleString('es-MX')} <span className="font-normal text-gray-500">/ día</span></p>
        {item.calificacion !== null && (
          <p className="flex items-center gap-1">
            <Star size={14} className="text-amber-400" fill="currentColor" />
            {item.calificacion.toFixed(1)} <span className="text-gray-400">({item.totalReviews})</span>
          </p>
        )}
        {item.proveedor && (
          <p className="flex items-center gap-1 text-xs">
            {item.proveedor} {item.proveedorVerificado && <BadgeCheck size={14} className="text-cyan-500" />}
          </p>
        )}
      </div>
    </div>
  );
}
