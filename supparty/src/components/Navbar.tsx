// src/components/Navbar.tsx
'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Grid, HelpCircleIcon, Bell, Heart, ShoppingCart, ChevronLeft, ChevronRight,
  User, Percent, Armchair, Gamepad2, Landmark, Sparkles, Search, Lightbulb, UserPlus
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase';
import { IconFileDollar } from '@tabler/icons-react';
import LoginDialog from '../app/login/page';
import { siteConfig } from '@/config/site';

type UserType = Awaited<ReturnType<typeof supabase.auth.getUser>>['data']['user'];

const CATEGORY_ICONS: Record<string, React.ReactNode> = {
  catalogo: <Grid size={20} />,
  ofertas: <Percent size={20} />,
  mobiliario: <Armchair size={20} />,
  juegos: <Gamepad2 size={20} />,
  salones: <Landmark size={20} />,
  experiencias: <Sparkles size={20} />,
};

const TOP_LINK_ICONS: Record<string, React.ReactNode> = {
  '/como-funciona': <Lightbulb size={15} />,
  '/facturacion': <IconFileDollar size={15} />,
  '/ayuda': <HelpCircleIcon size={15} />,
};

const topLinkClass = "hover:text-pink-300 flex items-center gap-1.5 transition-colors";

export default function Navbar({ variant = 'public' }: { variant?: 'public' | 'dashboard' }) {
  const router = useRouter();
  const [user, setUser] = useState<UserType>(null);
  const isDashboard = variant === 'dashboard';
  // El layout persiste entre rutas: al cambiar de variante se reinicia el estado
  // (cerradas en el dashboard, abiertas en las vistas públicas).
  const [showCategories, setShowCategories] = useState(!isDashboard);
  const [prevVariant, setPrevVariant] = useState(variant);
  if (prevVariant !== variant) {
    setPrevVariant(variant);
    setShowCategories(!isDashboard);
  }
  const loginRef = useRef<HTMLDivElement>(null);

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

  // "Regístrate" abre el mismo modal de login (el usuario cambia a registro dentro del modal).
  // Se dispara el trigger del LoginDialog para no montar una segunda instancia.
  const openLoginDialog = () => {
    loginRef.current?.querySelector('button')?.click();
  };

  const avatarUrl: string | undefined = user?.user_metadata?.avatar_url ?? user?.user_metadata?.picture;

  return (
    <header className="sticky top-0 w-full bg-[#4B1B7D] text-white px-8 py-3 z-50 select-none flex flex-col justify-between min-h-[110px]">

      <div className="absolute left-8 top-1/2 -translate-y-1/2 z-10">
        <Link href="/" className="text-3xl font-black tracking-tight flex items-center gap-2">
          <Image
            src="/assets/suppartyLogo.svg"
            alt="Supparty Logo"
            width={250}
            height={80}
            className="object-contain"
            priority
          />
        </Link>
      </div>

      {/* ================= SECCIÓN SUPERIOR: BOTONES COMPLEMENTARIOS ================= */}
      <div className="w-full flex justify-end items-center gap-6 text-[13px] font-medium h-9 mb-2 pl-[200px]">
        <div className="relative h-full flex items-center">
          <Button asChild className="bg-[#E91E63] hover:bg-[#D81B60] text-xs font-bold px-5 h-8 rounded-t-none rounded-b-xl flex items-center gap-1.5 transition-all absolute top-[-12px] right-0 whitespace-nowrap shadow-md">
            <Link href="/suppartners">
              <User size={14} />
              Conviértete en Suppartner
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-5 pr-2">
          {user ? (
            <button onClick={handleLogout} className={topLinkClass}>
              <User size={15} /> Cerrar Sesión
            </button>
          ) : (
            <>
              <div ref={loginRef} className="flex items-center gap-1.5 hover:text-pink-300 transition-colors">
                <User size={15} />
                <Suspense fallback={<span>Iniciar Sesión</span>}>
                  <LoginDialog />
                </Suspense>
              </div>
              <button onClick={openLoginDialog} className={`${topLinkClass} cursor-pointer`}>
                <UserPlus size={15} /> Regístrate
              </button>
            </>
          )}

          {siteConfig.topLinks.map((link) => (
            <Link key={link.href} href={link.href} className={topLinkClass}>
              {TOP_LINK_ICONS[link.href]} {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* ================= SECCIÓN INFERIOR: MENÚS Y UTILIDADES ================= */}
      {/* 🛠️ Le ponemos 'pl-[200px]' para asegurar que los elementos jamás se encimen con el espacio del logo absoluto a la izquierda */}
      <div className="w-full flex items-center justify-between relative pl-[200px] min-h-[64px]">

        {/* BLOQUE CENTRAL-DERECHO: CATEGORÍAS (colapsables con un botón en todas las vistas) */}
        <div className="flex items-center gap-4 xl:gap-6 ml-auto mr-4">
          <button
            onClick={() => setShowCategories(!showCategories)}
            aria-label={showCategories ? 'Ocultar categorías' : 'Mostrar categorías'}
            className="flex items-center gap-1 text-white/85 hover:text-white transition-colors"
          >
            {showCategories ? <ChevronRight size={18} /> : <ChevronLeft size={18} />}
            {!showCategories && (
              <span className="w-10 h-10 rounded-full bg-white/90 text-[#4B1B7D] flex items-center justify-center shadow-sm">
                <Grid size={20} />
              </span>
            )}
          </button>

          {/* Siempre se renderizan: el despliegue anima ancho/opacidad sin alterar el alto del header */}
          <div
            aria-hidden={!showCategories}
            className={`flex items-center gap-4 xl:gap-6 overflow-hidden transition-all duration-300 ease-in-out ${
              showCategories ? 'max-w-[700px] opacity-100' : 'max-w-0 opacity-0 pointer-events-none'
            }`}
          >
            {siteConfig.categories.map((category) => (
              <NavCircleItem
                key={category.key}
                href={category.href}
                icon={CATEGORY_ICONS[category.key]}
                label={category.label}
                hasArrow={category.key === 'catalogo'}
              />
            ))}
          </div>
        </div>

        {/* BLOQUE EXTREMA DERECHA: BOTONES DE CONTROL */}
        <div className="flex items-center gap-4 border-l border-white/20 pl-6 shrink-0">

          {/* Buscar (solo en el dashboard, como en el Figma) */}
          {isDashboard && (
            <button className="flex flex-col items-center group" aria-label="Buscar">
              <div className="w-10 h-10 rounded-full bg-[#E91E63] group-hover:bg-[#D81B60] flex items-center justify-center text-white shadow-md transition-colors">
                <Search size={20} />
              </div>
            </button>
          )}

          {/* Mi Perfil */}
          <Link href="/dashboard" className="flex flex-col items-center group" aria-label="Mi perfil">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shadow-md transition-colors overflow-hidden ${isDashboard ? 'bg-[#1FB5C4] text-white group-hover:bg-[#19a0ad]' : 'bg-white text-slate-700 group-hover:bg-slate-100'}`}>
              {avatarUrl ? (
                <Image
                  src={avatarUrl}
                  alt="Foto de perfil"
                  width={40}
                  height={40}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
              ) : (
                <User size={20} />
              )}
            </div>
            {!isDashboard && (
              <span className="mt-1 text-[11px] font-medium text-white/90 group-hover:text-white transition-colors">Mi perfil</span>
            )}
          </Link>

          {/* Utilidades finales */}
          <div className="flex items-center gap-2.5 ml-1 text-white/90">
            <Link href="/notificaciones" aria-label="Notificaciones" className="hover:text-pink-400 relative p-1.5 transition-colors">
              <Bell size={22} />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-[#E91E63] rounded-full border border-[#4B1B7D]"></span>
            </Link>
            <Link href="/favoritos" aria-label="Favoritos" className="hover:text-pink-400 p-1.5 transition-colors"><Heart size={22} /></Link>
            <Link href="/carrito" aria-label="Carrito" className="hover:text-pink-400 p-1.5 transition-colors"><ShoppingCart size={22} /></Link>
          </div>

        </div>

      </div>

    </header>
  );
}

/* MINI COMPONENTE PARA LOS ICONOS CIRCULARES BLANCOS */
function NavCircleItem({ href, icon, label, hasArrow = false }: { href: string, icon: React.ReactNode, label: string, hasArrow?: boolean }) {
  return (
    <Link href={href} className="flex flex-col items-center group text-white/85 hover:text-white transition-colors w-20">
      <div className="w-10 h-10 rounded-full bg-white/15 group-hover:bg-white/25 flex items-center justify-center transition-all shadow-sm">
        {icon}
      </div>
      <span className="text-[11px] font-medium mt-1.5 flex items-center justify-center gap-0.5 whitespace-nowrap tracking-wide">
        {label} {hasArrow && <span className="text-[8px] opacity-80 ml-0.5">▼</span>}
      </span>
    </Link>
  );
}
