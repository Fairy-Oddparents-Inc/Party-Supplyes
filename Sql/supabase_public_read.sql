-- BD de PRUEBA: lectura abierta (anon + autenticados) en todas las tablas.
-- Ejecutar en el SQL editor de Supabase. Es idempotente.
do $$
declare t text;
begin
  foreach t in array array['items','item_images','providers','profiles','bookings','reviews','notifications']
  loop
    execute format('alter table public.%I enable row level security', t);
    execute format('drop policy if exists "test_public_read" on public.%I', t);
    execute format('create policy "test_public_read" on public.%I for select using (true)', t);
  end loop;
end $$;
para