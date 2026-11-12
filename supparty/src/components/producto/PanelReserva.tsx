'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { BadgeCheck, CalendarPlus, Store } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { ItemDetalle } from '@/lib/items';

const DIA = 86_400_000;
const aMs = (s: string) => new Date(`${s}T00:00:00`).getTime();
const hoy = () => new Date(new Date().toDateString()).getTime();
const iso = (ms: number) => {
  const d = new Date(ms);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
};

export default function PanelReserva({ item }: { item: ItemDetalle }) {
  const router = useRouter();
  const [inicio, setInicio] = useState('');
  const [fin, setFin] = useState('');

  const dias = inicio && fin ? Math.round((aMs(fin) - aMs(inicio)) / DIA) + 1 : 0;
  const total = dias > 0 ? dias * item.price_per_day : 0;
  const choca =
    dias > 0 && item.ocupado.some((o) => aMs(inicio) <= aMs(o.end) && aMs(fin) >= aMs(o.start));
  const invalido = !!inicio && !!fin && dias < 1;
  const listo = dias > 0 && !choca;

  // La página es pública; el login se pide solo al intentar reservar
  const accion = async (destino: string) => {
    if (!listo) return;
    const { data } = await supabase.auth.getSession();
    if (!data.session) {
      router.push('/login');
      return;
    }
    router.push(destino);
  };

  return (
    <aside className="flex flex-col gap-4">
      <div className="rounded-xl bg-white p-5 shadow-sm">
        <p className="text-xs text-gray-500">Desde</p>
        <p className="text-3xl font-extrabold text-gray-900">
          ${item.price_per_day.toLocaleString('es-MX')} <span className="text-xs font-normal text-gray-500">MXN / día</span>
        </p>

        <div className="mt-4 grid grid-cols-2 gap-3 text-xs text-gray-600">
          <label className="flex flex-col gap-1">Fecha de inicio
            <input type="date" min={iso(hoy())} value={inicio}
              onChange={(e) => { setInicio(e.target.value); if (fin && e.target.value > fin) setFin(''); }}
              className="h-9 rounded-md border border-gray-200 px-2 text-sm text-gray-900" />
          </label>
          <label className="flex flex-col gap-1">Fecha de fin
            <input type="date" min={inicio || iso(hoy())} value={fin} onChange={(e) => setFin(e.target.value)}
              className="h-9 rounded-md border border-gray-200 px-2 text-sm text-gray-900" />
          </label>
        </div>

        {invalido && <p className="mt-2 text-xs text-red-600">La fecha de fin debe ser posterior al inicio.</p>}
        {choca && <p className="mt-2 text-xs text-red-600">Esas fechas ya están reservadas. Elige otro rango.</p>}
        {listo && <p className="mt-2 text-xs text-emerald-600">Disponible en las fechas elegidas.</p>}

        <dl className="mt-4 space-y-1 border-t border-gray-100 pt-3 text-sm">
          <div className="flex justify-between text-gray-600"><dt>Días</dt><dd>{dias || '—'}</dd></div>
          <div className="flex justify-between text-base font-bold text-gray-900">
            <dt>Total</dt><dd>{listo ? `$${total.toLocaleString('es-MX')} MXN` : '—'}</dd>
          </div>
        </dl>

        <button type="button" disabled={!listo} onClick={() => accion('/carrito')}
          className="mt-4 h-11 w-full rounded-lg bg-[#E91E63] text-sm font-semibold text-white transition-colors hover:bg-[#D81B60] disabled:cursor-not-allowed disabled:opacity-50">
          Rentar ahora
        </button>
        <button type="button" disabled={!listo} onClick={() => accion('/reservaciones')}
          className="mt-2 flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#E91E63] text-sm font-semibold text-[#E91E63] transition-colors hover:bg-pink-50 disabled:cursor-not-allowed disabled:opacity-50">
          <CalendarPlus size={16} /> Agregar a evento
        </button>
      </div>

      {item.proveedor && (
        <div className="rounded-xl bg-white p-5 shadow-sm">
          <p className="flex items-center gap-2 text-sm font-bold text-gray-900">
            <Store size={16} className="text-[#E91E63]" /> {item.proveedor}
            {item.proveedorVerificado && <BadgeCheck size={16} className="text-cyan-500" />}
          </p>
          {item.proveedorDescripcion && <p className="mt-2 line-clamp-3 text-xs text-gray-500">{item.proveedorDescripcion}</p>}
        </div>
      )}
    </aside>
  );
}
