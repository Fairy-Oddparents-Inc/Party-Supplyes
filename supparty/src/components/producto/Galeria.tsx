'use client';

import { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight, X } from 'lucide-react';

export default function Galeria({ imagenes, titulo, categoria }: { imagenes: string[]; titulo: string; categoria: string | null }) {
  const [actual, setActual] = useState(0);
  const [abierto, setAbierto] = useState(false);
  const n = imagenes.length;
  const ir = (d: number) => setActual((i) => (i + d + n) % n);

  useEffect(() => {
    if (!abierto) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setAbierto(false);
      if (e.key === 'ArrowLeft') setActual((i) => (i - 1 + n) % n);
      if (e.key === 'ArrowRight') setActual((i) => (i + 1) % n);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [abierto, n]);

  if (n === 0) return <div className="flex h-80 items-center justify-center rounded-xl bg-gray-200 text-sm text-gray-400 md:h-[420px]">Sin imágenes</div>;

  return (
    <div>
      <button type="button" onClick={() => setAbierto(true)} className="relative block h-80 w-full overflow-hidden rounded-xl bg-gray-200 md:h-[420px]" aria-label="Ampliar imagen">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imagenes[actual]} alt={titulo} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        {categoria && <span className="absolute left-3 top-3 rounded-md bg-[#E91E63] px-2 py-1 text-xs font-semibold text-white">{categoria}</span>}
      </button>

      {n > 1 && (
        <div className="mt-3 flex gap-2 overflow-x-auto">
          {imagenes.map((src, i) => (
            <button key={src + i} type="button" onClick={() => setActual(i)} aria-label={`Imagen ${i + 1}`}
              className={`h-16 w-20 shrink-0 overflow-hidden rounded-md border-2 ${i === actual ? 'border-[#E91E63]' : 'border-transparent'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={src} alt="" referrerPolicy="no-referrer" className="h-full w-full object-cover" />
            </button>
          ))}
        </div>
      )}

      {abierto && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4" role="dialog" aria-modal="true" onClick={() => setAbierto(false)}>
          <button type="button" aria-label="Cerrar" className="absolute right-4 top-4 text-white" onClick={() => setAbierto(false)}><X size={28} /></button>
          {n > 1 && (
            <button type="button" aria-label="Anterior" className="absolute left-4 text-white" onClick={(e) => { e.stopPropagation(); ir(-1); }}><ChevronLeft size={36} /></button>
          )}
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={imagenes[actual]} alt={titulo} referrerPolicy="no-referrer" className="max-h-full max-w-full object-contain" onClick={(e) => e.stopPropagation()} />
          {n > 1 && (
            <button type="button" aria-label="Siguiente" className="absolute right-4 text-white" onClick={(e) => { e.stopPropagation(); ir(1); }}><ChevronRight size={36} /></button>
          )}
          <span className="absolute bottom-4 text-sm text-white">{actual + 1} / {n}</span>
        </div>
      )}
    </div>
  );
}
