// Solo desarrollo: consulta todas las tablas con la clave anon y loguea cada paso en la terminal de `next dev`.
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

const TABLAS = ['items', 'item_images', 'providers', 'profiles', 'bookings', 'reviews', 'notifications'];
const log = (...a: unknown[]) => console.log('[debug-db]', ...a);

export async function GET() {
  if (process.env.NODE_ENV === 'production') return new NextResponse('No disponible', { status: 404 });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  log('1/4 variables de entorno →', {
    url: url ? new URL(url).host : 'FALTA',
    anonKey: key ? `presente (${key.length} caracteres)` : 'FALTA',
  });
  if (!url || !key) {
    log('✖ faltan variables en .env.local; abortando');
    return NextResponse.json({ error: 'faltan variables de entorno' }, { status: 500 });
  }

  log('2/4 creando cliente Supabase (rol: anon, sin sesión)');
  const supabase = createClient(url, key, { auth: { persistSession: false } });

  log('3/4 consultando tablas:', TABLAS.join(', '));
  const resumen: Record<string, unknown> = {};
  for (const t of TABLAS) {
    const t0 = Date.now();
    const { data, error, count, status } = await supabase.from(t).select('*', { count: 'exact' }).limit(20);
    const ms = Date.now() - t0;
    if (error) {
      log(`✖ ${t} → HTTP ${status} (${ms}ms) error: ${error.message} [${error.code}]`);
      resumen[t] = { status, error: error.message };
      continue;
    }
    log(`✔ ${t} → HTTP ${status} (${ms}ms) filas totales: ${count}, devueltas: ${data.length}` +
      (data.length === 0 ? '  ⚠ vacía para anon (¿RLS sin política de select?)' : ''));
    if (data.length) console.log(JSON.stringify(data.slice(0, 5), null, 1));
    resumen[t] = { status, count, devueltas: data.length };
  }

  const { data: st } = await supabase.from('bookings').select('status');
  log('4/4 valores distintos de bookings.status →', [...new Set((st ?? []).map((b) => b.status))]);

  return NextResponse.json(resumen);
}
