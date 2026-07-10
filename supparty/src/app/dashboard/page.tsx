'use client';

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { 
  LayoutDashboard, Calendar, FileText, CreditCard, 
  MessageSquare, Heart, Award, Settings, HelpCircle, CheckCircle2, Star 
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
// 1. IMPORTA TU NAVBAR AQUÍ
import Navbar from '@/components/Navbar'; 

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
  }, []);

  return (
    // CAMBIAMOS A FLEX-COL PARA QUE EL NAVBAR QUEDE ARRIBA DEL TODO Y EL CONTENIDO ABAJO
    <div className="min-h-screen bg-[#F4F3F8] flex flex-col">
      
      {/* CONTENEDOR INFERIOR: Ocupará todo el espacio restante debajo del Navbar */}
      <div className="flex flex-1">
        
        {/* SIDEBAR IZQUIERDO (Imagen 4) */}
        <aside className="w-64 bg-white border-r border-slate-100 p-4 flex flex-col justify-between hidden lg:flex">
          <div className="space-y-6">
            <nav className="space-y-1">
              <SidebarLink icon={<LayoutDashboard size={18}/>} label="Resumen" active />
              <SidebarLink icon={<Calendar size={18}/>} label="Mis eventos" />
              <SidebarLink icon={<CheckCircle2 size={18}/>} label="Reservaciones" />
              <SidebarLink icon={<CreditCard size={18}/>} label="Pagos" />
              <SidebarLink icon={<MessageSquare size={18}/>} label="Mensajes" />
              <SidebarLink icon={<Heart size={18}/>} label="Favoritos" />
              <SidebarLink icon={<Award size={18}/>} label="Recompensas" />
              <SidebarLink icon={<Settings size={18}/>} label="Configuración" />
            </nav>
          </div>

          {/* Banner de ayuda inferior */}
          <div className="bg-[#EFE9F7] p-4 rounded-xl text-center space-y-3">
            <p className="text-xs font-bold text-[#2D144B]">¿Necesitas ayuda?</p>
            <p className="text-[11px] text-slate-500">Nuestro equipo está listo para apoyarte.</p>
            <Button size="sm" className="w-full bg-white text-[#2D144B] border border-[#2D144B]/20 hover:bg-slate-50 text-xs">
              Contactar soporte
            </Button>
          </div>
        </aside>

        {/* CONTENIDO PRINCIPAL */}
        <main className="flex-1 p-8 space-y-6 overflow-y-auto">
          
          {/* Cabecera de Perfil de Diego */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="w-20 h-20 rounded-full bg-slate-200 border-2 border-slate-300 relative">
                <div className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow text-[10px]">📷</div>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-slate-800">¡Hola, {user?.user_metadata?.full_name || 'Diego'}!</h1>
                <p className="text-sm text-slate-500">Gracias por confiar en Supparty</p>
                <div className="text-xs text-slate-400 mt-1 flex flex-col gap-0.5">
                  <span>📍 Naucalpan, Edo. Mex.</span>
                  <span>✉️ {user?.email || 'diego.ramirez@gmail.com'}</span>
                </div>
                <button className="text-xs text-pink-500 font-semibold mt-2 hover:underline">Editar perfil →</button>
              </div>
            </div>
            
            {/* Score del Cliente */}
            <div className="bg-[#F8F9FA] border border-green-200 p-4 rounded-xl flex flex-col items-center justify-center text-center">
              <span className="text-xs text-green-700 font-bold bg-green-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                ✓ Cliente Verificado
              </span>
              <div className="mt-2 text-center">
                <span className="text-3xl font-black text-slate-800">4.6</span>
                <span className="text-slate-400 text-sm"> /5</span>
              </div>
              <div className="flex gap-0.5 text-amber-400 my-1">
                {[...Array(5)].map((_, i) => <Star key={i} size={14} fill="currentColor"/>)}
              </div>
              <p className="text-[10px] text-slate-400">Basado en 52 proveedores</p>
            </div>
          </section>

          {/* Franja de Próximo Evento (Counter) */}
          <section className="bg-[#1C0E35] text-white p-5 rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-wider text-pink-400 font-bold">Tu próximo evento</span>
              <h2 className="text-xl font-black tracking-wide">CUMPLEAÑOS SOFÍA</h2>
              <button className="text-xs opacity-60 hover:opacity-100 underline mt-1">Ver detalles →</button>
            </div>
            <div className="flex gap-4 text-center">
              <div><p className="text-2xl font-black">00</p><p className="text-[9px] opacity-60 uppercase">días</p></div>
              <span className="text-2xl font-light opacity-40">:</span>
              <div><p className="text-2xl font-black">00</p><p className="text-[9px] opacity-60 uppercase">horas</p></div>
              <span className="text-2xl font-light opacity-40">:</span>
              <div><p className="text-2xl font-black">00</p><p className="text-[9px] opacity-60 uppercase">minutos</p></div>
            </div>
          </section>

          {/* Grid de Eventos y Actividad */}
          <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
            
            {/* Listado Próximos Eventos */}
            <div className="xl:col-span-2 bg-white p-6 rounded-2xl shadow-sm space-y-4">
              <div className="flex justify-between items-center border-b pb-3">
                <h3 className="font-bold text-slate-800">Próximos eventos</h3>
                <button className="text-xs text-[#2D144B] font-bold hover:underline">Ver todos →</button>
              </div>
              
              <div className="space-y-3">
                <EventRow title="Cumple Sofía" date="15 de agosto de 2026" status="Confirmado" color="bg-green-100 text-green-700" price="$12,500 MXN" />
                <EventRow title="Graduación" date="15 de abril de 2026" status="Pendiente de pago" color="bg-amber-100 text-amber-700" price="$38,500 MXN" />
                <EventRow title="Fin de año 2025" date="15 de diciembre de 2025" status="Finalizado" color="bg-blue-100 text-blue-700" price="$22,800 MXN" />
              </div>
            </div>

            {/* Grid Mi Actividad */}
            <div className="bg-white p-6 rounded-2xl shadow-sm space-y-4">
              <h3 className="font-bold text-slate-800 border-b pb-3">Mi actividad</h3>
              <div className="grid grid-cols-2 gap-3">
                <StatCard label="Eventos realizados" val="8" />
                <StatCard label="Servicios contratados" val="24" />
                <StatCard label="Ahorro acumulado" val="$6,450" sub="MXN" />
                <StatCard label="Proveedores Favoritos" val="24" />
              </div>
            </div>

          </div>

        </main>
      </div>
    </div>
  );
}

/* MINI COMPONENTES INTERNOS */
function SidebarLink({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-[#EFE9F7] text-[#2D144B]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
      {icon}
      <span>{label}</span>
    </button>
  );
}

function EventRow({ title, date, status, color, price }: { title: string, date: string, status: string, color: string, price: string }) {
  return (
    <div className="flex justify-between items-center p-3 rounded-xl border border-slate-50 hover:bg-slate-50 transition-colors">
      <div className="flex gap-3 items-center">
        <div className="w-10 h-10 bg-slate-100 rounded-lg"></div>
        <div>
          <h4 className="text-sm font-bold text-slate-700">{title}</h4>
          <p className="text-xs text-slate-400">{date}</p>
        </div>
      </div>
      <div className="text-right">
        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${color}`}>{status}</span>
        <p className="text-sm font-black text-slate-700 mt-1">{price}</p>
      </div>
    </div>
  );
}

function StatCard({ label, val, sub }: { label: string, val: string, sub?: string }) {
  return (
    <div className="bg-[#F8F9FA] p-3 rounded-xl border border-slate-100 flex flex-col justify-between">
      <p className="text-[11px] text-slate-500 font-medium leading-tight">{label}</p>
      <p className="text-2xl font-black text-[#2D144B] mt-2">
        {val} {sub && <span className="text-xs font-normal text-slate-400">{sub}</span>}
      </p>
    </div>
  );
}