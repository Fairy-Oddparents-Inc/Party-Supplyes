'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Grid, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { IconFileDollar } from '@tabler/icons-react';
import LoginDialog from '../app/login/page';

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const getInitialUser = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
    };
    getInitialUser();

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    <div className="fixed w-full top-0 z-50 bg-white">
      <header className="bg-[#4B1B7D] text-white p-4 flex justify-between items-center">
        
        {/* GRUPO IZQUIERDO: Logo + Saludo */}
        <div className="flex items-center gap-6">
          <Link href="/" className="text-2xl font-bold">Supparty</Link>
          
          {user && (
            <div className="hidden md:flex items-center text-sm font-medium opacity-90 border-l border-white/20 pl-6">
              <span className="italic">¡Hola, {user.user_metadata?.full_name || user.email}!</span>
            </div>
          )}
        </div>
        
        {/* GRUPO DERECHO: Login/Logout + Acciones */}
        <div className="flex items-center gap-4">
          <Button className="bg-[#E91E63] hover:bg-[#D81B60] px-6 hidden md:flex">
            Conviértete en Suppartner
          </Button>
          
          {user ? (
            <Button onClick={handleLogout} variant="secondary" className="text-[#4B1B7D]">
              Cerrar Sesión
            </Button>
          ) : (
            <LoginDialog />
          )}

          <div className="hidden md:flex gap-2 items-center">
            <Button variant="ghost" className="hover:bg-white/10">
                <IconFileDollar className="mr-2 h-4 w-4" />
                <span>Facturación</span>
            </Button>
            <Button variant="ghost" className="hover:bg-white/10">
                <HelpCircleIcon className="mr-2 h-4 w-4" />
                <span>Ayuda</span>
            </Button>
          </div>
        </div>

      </header>

      <nav className="py-4 px-10 border-b shadow-sm bg-white">
        <div className="max-w-6xl mx-auto flex justify-around text-center">
          <CategoryItem icon={<Grid size={24}/>} label="Categorías" />
        </div>
      </nav>
    </div>
  );
}

function CategoryItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#4B1B7D] group-hover:text-[#4B1B7D] transition-colors text-slate-600">
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider mt-2 font-semibold text-slate-600 group-hover:text-[#4B1B7D]">
        {label}
      </span>
    </div>
  );
}