'use client';

import { useRouter } from 'next/navigation';
import { Calendar, MapPin, Search } from 'lucide-react';

interface Props {
  /** Texto inicial (ej. el `q` de la URL). Si cambia, el campo se reinicia. */
  valorInicial?: string;
  /** Ruta a la que se navega con `?q=` cuando no se pasa `onBuscar`. */
  destino?: string;
  /** Sustituye la navegación (útil cuando la pantalla ya filtra por sí misma). */
  onBuscar?: (q: string) => void;
  placeholder?: string;
  className?: string;
}

// Buscador reutilizable (banda rosa del Figma home-3 / home-4). Ubicación y fecha son
// placeholders deshabilitados hasta que existan esos filtros, igual que en el home.
export default function BuscadorProductos({
  valorInicial = '',
  destino = '/catalogo',
  onBuscar,
  placeholder = 'Carpas, sillas, fotografía, mesas...',
  className = '',
}: Props) {
  const router = useRouter();

  return (
    <div className={`bg-[#E91E63] ${className}`}>
      <form
        role="search"
        onSubmit={(e) => {
          e.preventDefault();
          const q = String(new FormData(e.currentTarget).get('q') ?? '').trim();
          if (onBuscar) onBuscar(q);
          else router.push(q ? `${destino}?q=${encodeURIComponent(q)}` : destino);
        }}
        className="mx-auto flex max-w-7xl flex-col gap-3 px-6 py-3 md:flex-row"
      >
        <label className="flex flex-[2] items-center rounded-full bg-white px-4 text-gray-700">
          <span className="sr-only">Buscar productos</span>
          <input
            key={valorInicial}
            name="q"
            defaultValue={valorInicial}
            placeholder={placeholder}
            className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-gray-400"
          />
          <Search className="shrink-0 text-gray-400" size={18} />
        </label>
        <label className="flex flex-1 items-center rounded-full bg-white px-4 text-gray-700">
          <span className="sr-only">Ubicación</span>
          <input disabled title="Próximamente" placeholder="Ubicación" className="h-10 w-full bg-transparent text-sm outline-none placeholder:text-gray-400" />
          <MapPin className="shrink-0 text-gray-400" size={18} />
        </label>
        <label className="flex flex-1 items-center rounded-full bg-white px-4 text-gray-700">
          <span className="sr-only">Fecha</span>
          <input type="date" disabled title="Próximamente" className="h-10 w-full bg-transparent text-sm outline-none" />
          <Calendar className="shrink-0 text-gray-400" size={18} />
        </label>
        <button type="submit" className="flex h-10 items-center justify-center gap-2 rounded-full bg-[#4B1B7D] px-8 text-sm font-semibold text-white transition-colors hover:bg-[#3d1665]">
          <Search size={16} /> Buscar
        </button>
      </form>
    </div>
  );
}
