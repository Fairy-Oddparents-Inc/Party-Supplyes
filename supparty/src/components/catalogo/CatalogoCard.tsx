import { ArrowRight, BadgeCheck, Heart, Images, Star, Store } from 'lucide-react';
import type { ItemResultado } from '@/lib/items';

// Tarjeta del catálogo (Figma). Solo muestra lo que existe en la BD: ubicación, "entrega incluida",
// características y anticipo ("Aparta desde") se agregarán cuando el modelo los tenga.
export default function CatalogoCard({ item }: { item: ItemResultado }) {
  return (
    <article className="flex flex-col overflow-hidden rounded-xl bg-white shadow-sm hover:shadow-lg transition-shadow">
      <div className="relative h-44 bg-gray-200">
        {item.imagen && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={item.imagen} alt={item.title} referrerPolicy="no-referrer" className="h-full w-full object-cover" />
        )}
        <span className="absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white text-[#E91E63] shadow" aria-hidden>
          <Heart size={16} />
        </span>
        {item.totalImagenes > 0 && (
          <span className="absolute bottom-3 right-3 flex items-center gap-1 rounded-md bg-[#4B1B7D] px-2 py-0.5 text-[11px] font-semibold text-white">
            <Images size={12} /> 1/{item.totalImagenes}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-4">
        <div className="flex items-start justify-between gap-3">
          <h3 className="text-base font-bold leading-snug text-gray-900">{item.title}</h3>
          {item.calificacion !== null && (
            <div className="shrink-0 text-right">
              <p className="flex items-center justify-end gap-1 text-sm font-bold text-gray-900">
                <Star size={14} className="text-amber-400" fill="currentColor" /> {item.calificacion.toFixed(1)}
              </p>
              <p className="text-[10px] text-gray-400">({item.totalReviews} reseñas)</p>
            </div>
          )}
        </div>

        {item.proveedor && (
          <p className="flex items-center gap-1.5 text-xs text-gray-600">
            <Store size={13} className="text-[#E91E63]" /> {item.proveedor}
            {item.proveedorVerificado && <BadgeCheck size={14} className="text-cyan-500" />}
          </p>
        )}

        {item.description && <p className="line-clamp-2 text-xs text-gray-500">{item.description}</p>}

        <div className="mt-auto">
          <p className="text-[11px] text-gray-500">Desde</p>
          <p className="text-xl font-extrabold text-gray-900">
            ${item.price_per_day.toLocaleString('es-MX')} <span className="text-[11px] font-normal text-gray-500">MXN / día</span>
          </p>
        </div>

        {/* Pendiente: página de detalle */}
        <button
          type="button"
          className="flex h-10 items-center justify-center gap-2 rounded-lg bg-[#E91E63] text-sm font-semibold text-white hover:bg-[#D81B60] transition-colors"
        >
          Ver detalles <ArrowRight size={16} />
        </button>
      </div>
    </article>
  );
}
