import { supabase } from '@/lib/supabase';

export type ItemOrden = 'recientes' | 'precio_asc' | 'precio_desc' | 'calificacion';

export interface FiltrosItems {
  q?: string;
  categoria?: string;
  min?: number;
  max?: number;
  orden?: ItemOrden;
}

export interface ItemResultado {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price_per_day: number;
  stock: number | null;
  imagen: string | null;
  proveedor: string | null;
  proveedorVerificado: boolean;
  calificacion: number | null;
  totalReviews: number;
}

interface FilaItem {
  id: string;
  title: string;
  description: string | null;
  category: string | null;
  price_per_day: number;
  stock: number | null;
  created_at: string;
  item_images: { image_url: string; is_primary: boolean | null }[] | null;
  providers: { business_name: string | null; is_verified: boolean | null } | null;
  reviews: { rating: number }[] | null;
}

const SELECT =
  'id,title,description,category,price_per_day,stock,created_at,' +
  'item_images(image_url,is_primary),providers(business_name,is_verified),reviews(rating)';

// Escapa caracteres que rompen el filtro .or() de PostgREST
const limpiar = (t: string) => t.replace(/[,()%*\\]/g, ' ').trim();

export async function buscarItems(f: FiltrosItems): Promise<ItemResultado[]> {
  const dev = process.env.NODE_ENV !== 'production';
  if (dev) console.log('[items] 1/3 buscando con filtros', f);
  let query = supabase.from('items').select(SELECT);

  const q = f.q ? limpiar(f.q) : '';
  if (q) query = query.or(`title.ilike.%${q}%,description.ilike.%${q}%`);
  if (f.categoria) query = query.eq('category', f.categoria);
  if (f.min !== undefined) query = query.gte('price_per_day', f.min);
  if (f.max !== undefined) query = query.lte('price_per_day', f.max);

  if (f.orden === 'precio_asc') query = query.order('price_per_day', { ascending: true });
  else if (f.orden === 'precio_desc') query = query.order('price_per_day', { ascending: false });
  else query = query.order('created_at', { ascending: false });

  console.log('[buscarItems 1/3] filtros:', f);
  const { data, error, status, count } = await query.limit(60).returns<FilaItem[]>();
  console.log(`[buscarItems 2/3] HTTP ${status}, filas=${data?.length ?? 0}, count=${count}`, error ?? '');
  if (error) {
    if (dev) console.error('[items] ✖ error de Supabase', error);
    throw new Error(error.message);
  }
  if (dev) console.log(`[items] 2/3 filas recibidas: ${data?.length ?? 0}`, data);
  console.log('[buscarItems 3/3] filas crudas:', data);

  const items = (data ?? []).map((r): ItemResultado => {
    const ratings = r.reviews ?? [];
    const imgs = r.item_images ?? [];
    const principal = imgs.find((i) => i.is_primary) ?? imgs[0];
    return {
      id: r.id,
      title: r.title,
      description: r.description,
      category: r.category,
      price_per_day: Number(r.price_per_day),
      stock: r.stock,
      imagen: principal?.image_url ?? null,
      proveedor: r.providers?.business_name ?? null,
      proveedorVerificado: !!r.providers?.is_verified,
      calificacion: ratings.length
        ? ratings.reduce((s, x) => s + x.rating, 0) / ratings.length
        : null,
      totalReviews: ratings.length,
    };
  });

  if (dev) console.log('[items] 3/3 resultados mapeados', items);

  if (f.orden === 'calificacion') {
    items.sort((a, b) => (b.calificacion ?? -1) - (a.calificacion ?? -1));
  }
  return items;
}

export async function listarCategorias(): Promise<string[]> {
  const { data } = await supabase.from('items').select('category');
  const set = new Set((data ?? []).map((r) => r.category).filter(Boolean) as string[]);
  return [...set].sort();
}
