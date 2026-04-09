'use client';

import Link from 'next/link';
import { Search, Heart, ShoppingCart, User, Grid, UserIcon, HelpCircleIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { IconFileDollar } from '@tabler/icons-react';

export default function Navbar() {
  const router = useRouter();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (!error) {
      localStorage.setItem('isLoggedIn', 'false');
      router.push('/login');
    } else {
      console.error('Error al cerrar sesión:', error.message);
    }
  };

  return (
    <div className="fixed w-full top-0 z-50 bg-white">
      {/* Top Header */}
      <header className="bg-[#4B1B7D] text-white p-4 flex justify-between items-center">
        <Link href="/features/homePage" className="text-2xl font-bold">Supparty</Link>
        
        <div className="flex items-center gap-6">
            <Button className="bg-[#E91E63] hover:bg-[#D81B60] px-6">
                Conviértete en Suppartner
            </Button>
        
        <div className="flex items-center gap-6">
          <div className="flex gap-4 items-center text-sm font-medium">
            <Button className="bg-[#4B1B7D] hover:bg-[#D81B60]" onClick={handleLogout}>
                <UserIcon/>
                    <span>
                        Cerrar Sesión
                    </span>
                </Button>
             <Button className="bg-[#4B1B7D] hover:bg-[#D81B60]" onClick={handleLogout}>
                <IconFileDollar/>
                    <span>
                        Facturación
                    </span>
                </Button>
                <Button className="bg-[#4B1B7D] hover:bg-[#D81B60]" onClick={handleLogout}>
                <HelpCircleIcon/>
                    <span>
                        Ayuda
                    </span>
                </Button>
          </div>
        </div>
        </div>
      </header>

      {/* Categories Nav */}
      <nav className="py-4 px-10 border-b shadow-sm">
        <div className="max-w-6xl mx-auto flex justify-around text-center">
          <CategoryItem icon={<Grid size={24}/>} label="Categorías" />
          {/* Puedes agregar más CategoryItems aquí */}
        </div>
      </nav>
    </div>
  );
}

function CategoryItem({ icon, label }: { icon: React.ReactNode, label: string }) {
  return (
    <div className="flex flex-col items-center group cursor-pointer">
      <div className="w-12 h-12 rounded-full border border-slate-200 flex items-center justify-center group-hover:border-[#4B1B7D] group-hover:text-[#4B1B7D] transition-colors">
        {icon}
      </div>
      <span className="text-[10px] uppercase tracking-wider mt-2 font-semibold text-slate-600 group-hover:text-[#4B1B7D]">
        {label}
      </span>
    </div>
  );
}