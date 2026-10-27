'use client';

import { useState } from 'react';
import { MapPin, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { CAPACIDADES, PRECIO_MAX, PRECIO_MIN, SERVICIOS, TIPOS_MOBILIARIO } from '@/config/catalogo';

export interface ValoresFiltros {
  max: number;
  tipos: string[];
}

interface Props {
  inicial: ValoresFiltros;
  onAplicar: (v: ValoresFiltros) => void;
  onLimpiar: () => void;
}

const titulo = 'text-sm font-bold text-gray-900 mb-2';
const campo = 'flex items-center gap-2 h-9 rounded-md border border-gray-200 bg-white px-2.5 text-xs text-gray-400';

// Ubicación, radio, disponibilidad, capacidad y servicios todavía no tienen columnas en la BD:
// se muestran como en el Figma pero deshabilitados.
function Pronto() {
  return <span className="ml-1.5 rounded-full bg-gray-100 px-1.5 py-0.5 text-[9px] font-medium text-gray-400">Pronto</span>;
}

export default function FiltrosCatalogo({ inicial, onAplicar, onLimpiar }: Props) {
  const [max, setMax] = useState(inicial.max);
  const [tipos, setTipos] = useState<string[]>(inicial.tipos);

  const alternarTipo = (key: string) =>
    setTipos((t) => (t.includes(key) ? t.filter((x) => x !== key) : [...t, key]));

  return (
    <aside className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-bold text-gray-900">Filtros</h2>
        <button type="button" onClick={onLimpiar} className="text-xs font-semibold text-[#E91E63] hover:underline">
          Limpiar todo
        </button>
      </div>

      <div>
        <p className={titulo}>Ubicación<Pronto /></p>
        <div className={campo}><span className="flex-1">Ingresa tu ubicación</span><MapPin size={14} /></div>
      </div>

      <div className="opacity-60">
        <p className={titulo}>Radio 8 km<Pronto /></p>
        <input type="range" min={0} max={20} defaultValue={8} disabled className="w-full accent-[#E91E63]" aria-label="Radio" />
        <div className="flex justify-between text-[10px] text-gray-400"><span>0</span><span>20</span></div>
      </div>

      <div>
        <p className={titulo}>Disponibilidad<Pronto /></p>
        <div className={campo}><span className="flex-1">Selecciona fecha del evento</span><Calendar size={14} /></div>
      </div>

      <div>
        <p className={titulo}>Rango de Precio hasta {max.toLocaleString('es-MX')}</p>
        <input
          type="range"
          min={PRECIO_MIN}
          max={PRECIO_MAX}
          step={100}
          value={max}
          onChange={(e) => setMax(Number(e.target.value))}
          className="w-full accent-[#E91E63]"
          aria-label="Precio máximo"
        />
        <div className="flex justify-between text-[10px] text-gray-500">
          <span>{PRECIO_MIN}</span><span>{PRECIO_MAX.toLocaleString('es-MX')}</span>
        </div>
      </div>

      <fieldset className="opacity-60">
        <legend className={titulo}>Capacidad<Pronto /></legend>
        <div className="space-y-1.5">
          {CAPACIDADES.map((c) => (
            <label key={c} className="flex items-center gap-2 text-xs text-gray-600">
              <input type="radio" name="capacidad" disabled /> {c}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset>
        <legend className={titulo}>Tipo de mobiliario</legend>
        <div className="space-y-1.5">
          {TIPOS_MOBILIARIO.map((t) => (
            <label key={t.key} className="flex items-center gap-2 text-xs text-gray-600 cursor-pointer">
              <input
                type="checkbox"
                checked={tipos.includes(t.key)}
                onChange={() => alternarTipo(t.key)}
                className="accent-[#E91E63]"
              />
              {t.label}
            </label>
          ))}
        </div>
      </fieldset>

      <fieldset className="opacity-60">
        <legend className={titulo}>Servicios incluidos<Pronto /></legend>
        <div className="space-y-1.5">
          {SERVICIOS.map((s) => (
            <label key={s} className="flex items-center gap-2 text-xs text-gray-600">
              <input type="checkbox" disabled /> {s}
            </label>
          ))}
        </div>
      </fieldset>

      <Button
        type="button"
        variant="outline"
        onClick={() => onAplicar({ max, tipos })}
        className="w-full border-[#E91E63] text-[#E91E63] hover:bg-pink-50"
      >
        Aplicar filtros
      </Button>

      <div className="rounded-xl bg-[#4B1B7D] p-4 text-white">
        <p className="font-bold">¿Necesitas ayuda?</p>
        <p className="mt-1 text-xs opacity-90">Nuestro equipo te ayuda a armar tu fiesta.</p>
      </div>
    </aside>
  );
}
