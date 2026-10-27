import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    // AuthGuard, Navbar y el home consultan la sesión a la vez (y StrictMode duplica los efectos en dev):
    // con el LockManager del navegador una llamada "roba" el lock de otra y lanza
    // "Lock broken by another request with the 'steal' option". Se ejecuta sin lock entre pestañas.
    lock: async (_name, _acquireTimeout, fn) => await fn(),
  },
})
