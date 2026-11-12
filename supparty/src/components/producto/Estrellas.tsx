import { Star } from 'lucide-react';

export default function Estrellas({ valor, size = 14 }: { valor: number; size?: number }) {
  return (
    <span className="inline-flex" aria-label={`${valor.toFixed(1)} de 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} size={size} className={n <= Math.round(valor) ? 'text-amber-400' : 'text-gray-300'} fill="currentColor" />
      ))}
    </span>
  );
}
