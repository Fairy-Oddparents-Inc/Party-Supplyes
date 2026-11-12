import type { ItemDetalle } from '@/lib/items';
import Estrellas from './Estrellas';

export default function Resenas({ item }: { item: ItemDetalle }) {
  const conteo = [5, 4, 3, 2, 1].map((n) => ({ n, c: item.resenas.filter((r) => r.rating === n).length }));
  return (
    <section className="rounded-xl bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-bold text-gray-900">Reseñas de clientes</h2>
      {item.totalReviews === 0 ? (
        <p className="text-sm text-gray-500">Este producto aún no tiene reseñas.</p>
      ) : (
        <div className="grid gap-6 md:grid-cols-[220px_1fr]">
          <div>
            <p className="text-5xl font-extrabold text-gray-900">{item.calificacion!.toFixed(1)}</p>
            <Estrellas valor={item.calificacion!} size={16} />
            <p className="mt-1 text-xs text-gray-500">{item.totalReviews} reseñas</p>
            <div className="mt-3 space-y-1">
              {conteo.map(({ n, c }) => (
                <div key={n} className="flex items-center gap-2 text-[11px] text-gray-500">
                  <span className="w-3">{n}</span>
                  <div className="h-1.5 flex-1 rounded bg-gray-100">
                    <div className="h-full rounded bg-amber-400" style={{ width: `${(c / item.totalReviews) * 100}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <ul className="grid gap-4 sm:grid-cols-2">
            {item.resenas.slice(0, 6).map((r) => (
              <li key={r.id} className="rounded-lg border border-gray-100 p-4">
                <div className="flex items-center gap-2">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  {r.avatar ? <img src={r.avatar} alt="" referrerPolicy="no-referrer" className="h-8 w-8 rounded-full object-cover" /> : <span className="h-8 w-8 rounded-full bg-gray-200" />}
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{r.autor}</p>
                    <Estrellas valor={r.rating} size={11} />
                  </div>
                </div>
                {r.comment && <p className="mt-2 text-xs text-gray-600">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </div>
      )}
    </section>
  );
}
