// src/components/Navbar.tsx
'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Grid, HelpCircleIcon, Bell, Heart, ShoppingCart, 
  User, Percent, Armchair, Gamepad2, Landmark, Sparkles, Search 
} from "lucide-react";
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

    return () => subscription.unsubscribe();
  }, []);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.refresh(); 
  };

  return (
    <div className="relative w-full bg-[#4B1B7D] text-white px-8 py-3 z-50 select-none flex flex-col justify-between min-h-[110px]">
      
      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <Link href="/" className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Image 
            src="/assets/suppartyLogo.svg" 
            alt="Supparty Logo" 
            width={250} 
            height={80} 
            className="object-contain"
    />
        </Link>
      </div>

      {/* ================= SECCIÓN SUPERIOR: BOTONES COMPLEMENTARIOS ================= */}
      <div className="w-full flex justify-end items-center gap-6 text-[13px] font-medium h-9 mb-2 pl-[200px]">
        <div className="relative h-full flex items-center">
          <Button className="bg-[#E91E63] hover:bg-[#D81B60] text-xs font-bold px-5 h-8 rounded-t-none rounded-b-xl flex items-center gap-1.5 transition-all absolute top-[-12px] right-0 whitespace-nowrap shadow-md">
            <User size={14} />
            Conviértete en Suppartner
          </Button>
        </div>
        
        <div className="flex items-center gap-5 pr-2">
          {user ? (
            <button onClick={handleLogout} className="hover:text-pink-300 flex items-center gap-1.5 transition-colors">
              <User size={15}/> Cerrar Sesión
            </button>
          ) : (
            <div className="flex items-center gap-1.5 hover:text-pink-300 transition-colors">
              <User size={15}/>
              <LoginDialog />
            </div>
          )}

          <Button variant="ghost" size="sm" className="h-auto p-0 text-[13px] hover:bg-transparent text-white hover:text-pink-300 flex items-center gap-1.5 font-medium transition-colors">
            <IconFileDollar size={15} /> Facturación
          </Button>
          
          <Button variant="ghost" size="sm" className="h-auto p-0 text-[13px] hover:bg-transparent text-white hover:text-pink-300 flex items-center gap-1.5 font-medium transition-colors">
            <HelpCircleIcon size={15} /> Ayuda
          </Button>
        </div>
      </div>

      {/* ================= SECCIÓN INFERIOR: MENÚS Y UTILIDADES ================= */}
      {/* 🛠️ Le ponemos 'pl-[200px]' para asegurar que los elementos jamás se encimen con el espacio del logo absoluto a la izquierda */}
      <div className="w-full flex items-center justify-between relative pl-[200px]">
        
        {/* BLOQUE CENTRAL-DERECHO: CATEGORÍAS */}
        <div className="flex items-center gap-4 xl:gap-6 ml-auto mr-4">
          <NavCircleItem icon={<Grid size={20}/>} label="Categorías" hasArrow />
          <NavCircleItem icon={<Percent size={20}/>} label="Ofertas" />
          <NavCircleItem icon={<Armchair size={20}/>} label="Mobiliario" />
          <NavCircleItem icon={<Gamepad2 size={20}/>} label="Juegos" />
          <NavCircleItem icon={<Landmark size={20}/>} label="Salones" />
          <NavCircleItem icon={<Sparkles size={20}/>} label="Experiencias" />
        </div>
          
        {/* BLOQUE EXTREMA DERECHA: BOTONES DE CONTROL */}
        <div className="flex items-center gap-4 border-l border-white/20 pl-6 shrink-0">
          
          {/* Buscar */}
          <button className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-[#E91E63] group-hover:bg-[#D81B60] flex items-center justify-center text-white shadow-md transition-colors">
              <Search size={20} />
            </div>
            <span className="mt-1 text-[11px] font-medium text-white/90 group-hover:text-white transition-colors">Buscar</span>
          </button>

          {/* Mi Perfil */}
          <button className="flex flex-col items-center group">
            <div className="w-10 h-10 rounded-full bg-white text-slate-700 group-hover:bg-slate-100 flex items-center justify-center shadow-md transition-colors">
              <User size={20} />
            </div>
            <span className="mt-1 text-[11px] font-medium text-white/90 group-hover:text-white transition-colors">Mi perfil</span>
          </button>

          {/* Utilidades finales */}
          <div className="flex items-center gap-2.5 ml-1 text-white/90">
            <button className="hover:text-pink-400 relative p-1.5 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E91E63] rounded-full border border-[#4B1B7D]"></span>
            </button>
            <button className="hover:text-pink-400 p-1.5 transition-colors"><Heart size={22} /></button>
            <button className="hover:text-pink-400 p-1.5 transition-colors"><ShoppingCart size={22} /></button>
          </div>

        </div>

      </div>

    </div>
  );
}

/* MINI COMPONENTE PARA LOS ICONOS CIRCULARES BLANCOS */
function NavCircleItem({ icon, label, hasArrow = false }: { icon: React.ReactNode, label: string, hasArrow?: boolean }) {
  return (
    <button className="flex flex-col items-center group text-white/85 hover:text-white transition-colors w-20">
      <div className="w-10 h-10 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-all shadow-sm">
        {icon}
      </div>
      <span className="text-[11px] font-medium mt-1.5 flex items-center justify-center gap-0.5 whitespace-nowrap tracking-wide">
        {label} {hasArrow && <span className="text-[8px] opacity-80 ml-0.5">▼</span>}
      </span>
    </button>
  );
}