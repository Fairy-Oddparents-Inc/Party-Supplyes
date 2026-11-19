'use client';

import { useState } from 'react';
import {
    Check,
    Calendar as CalendarIcon,
    Clock,
    MapPin,
    Truck,
    ShieldCheck,
    Star,
    ChevronRight,
    Pen,
    Users,
    CreditCard,
    Info,
    Lock,
    ArrowRight,
    Cake,
    LayoutDashboard,
    MessageSquare,
    Heart,
    Award,
    Settings,
    CheckCircle2,
    ChevronLeft,
    ChevronRight as ChevronRightIcon,
    HelpCircle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Footer from '@/components/layout/Footer';
import GoogleAddressPicker from '@/components/reservas/GoogleAddressPicker';

interface AdditionalItem {
    id: string;
    title: string;
    subtitle: string;
    price: number;
    unit?: string;
    image: string;
}

export default function ServiceSummaryPage() {
    const [notes, setNotes] = useState<string>('');
    const [isChecked, setIsChecked] = useState<boolean>(false);
    const [eventAddress, setEventAddress] = useState('Calle Reforma 123, Col. Centro, Naucalpan, Estado de México.');
    // Estado para controlar si el sidebar está colapsado o expandido mediante el botón
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState<boolean>(false);

    const additionalItems: AdditionalItem[] = [
        { id: '1', title: 'Carpa 6x6', subtitle: 'Para 40 personas', price: 2200, image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&w=300&q=80' },
        { id: '2', title: 'Mantelería Premium', subtitle: 'Varios colores', price: 450, image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=300&q=80' },
        { id: '3', title: 'Sillas Tiffany', subtitle: 'Acojinadas', price: 80, unit: '/u', image: 'https://images.unsplash.com/photo-1505236858219-8359eb29e329?auto=format&fit=crop&w=300&q=80' },
        { id: '4', title: 'Iluminación Vintage', subtitle: 'Guirnaldas LED', price: 550, image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=300&q=80' },
    ];

    const recommendations: AdditionalItem[] = [
        { id: 'r1', title: 'Decoración con globos', subtitle: 'Fiesta Catalán', price: 1800, image: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=300&q=80' },
        { id: 'r2', title: 'DJ + sonido', subtitle: 'Beat Events', price: 2500, image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&w=300&q=80' },
        { id: 'r3', title: 'Mesa de dulces', subtitle: 'Dulce Detalle', price: 1600, image: 'https://images.unsplash.com/photo-1535223289827-42f1e9919769?auto=format&fit=crop&w=300&q=80' },
        { id: 'r4', title: 'Fotografía de evento', subtitle: 'Momentos Inolvidables', price: 2200, image: 'https://images.unsplash.com/photo-1537633552985-df8429e8048b?auto=format&fit=crop&w=300&q=80' },
    ];

    return (
        <div className="min-h-screen bg-[#F4F3F8] flex flex-col">
            <div className="flex flex-1">

                {/* SIDEBAR IZQUIERDO CONTROLADO POR BOTÓN */}
                <aside
                    className={`bg-white border-r border-slate-100 p-4 flex flex-col justify-between shrink-0 transition-all duration-300 relative ${isSidebarCollapsed ? 'w-20' : 'w-64'
                        }`}
                >
                    <div className="space-y-6">
                        {/* Botón para alternar el estado del sidebar */}
                        <div className={`flex items-center ${isSidebarCollapsed ? 'justify-center' : 'justify-end'} mb-2`}>
                            <button
                                onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
                                title={isSidebarCollapsed ? "Expandir sidebar" : "Colapsar sidebar"}
                            >
                                {isSidebarCollapsed ? <ChevronRightIcon size={18} /> : <ChevronLeft size={18} />}
                            </button>
                        </div>

                        <nav className="space-y-1">
                            <SidebarLink icon={<LayoutDashboard size={18} />} label="Resumen" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<CalendarIcon size={18} />} label="Mis eventos" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<CheckCircle2 size={18} />} label="Reservaciones" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<CreditCard size={18} />} label="Pagos" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<MessageSquare size={18} />} label="Mensajes" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<Heart size={18} />} label="Favoritos" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<Award size={18} />} label="Recompensas" collapsed={isSidebarCollapsed} />
                            <SidebarLink icon={<Settings size={18} />} label="Configuración" collapsed={isSidebarCollapsed} />
                        </nav>
                    </div>

                    {/* Banner de ayuda inferior adaptativo */}
                    <div className={`bg-[#EFE9F7] rounded-xl text-center transition-all ${isSidebarCollapsed ? 'p-2' : 'p-4 space-y-3'}`}>
                        {!isSidebarCollapsed ? (
                            <>
                                <p className="text-xs font-bold text-[#2D144B]">¿Necesitas ayuda?</p>
                                <p className="text-[11px] text-slate-500">Nuestro equipo está listo para apoyarte.</p>
                                <Button size="sm" className="w-full bg-white text-[#2D144B] border border-[#2D144B]/20 hover:bg-slate-50 text-xs">
                                    Contactar soporte
                                </Button>
                            </>
                        ) : (
                            <div className="flex justify-center py-2" title="¿Necesitas ayuda?">
                                <HelpCircle size={20} className="text-[#2D144B]" />
                            </div>
                        )}
                    </div>
                </aside>

                {/* CONTENIDO PRINCIPAL */}
                <main className="flex-1 p-8 space-y-6 overflow-y-auto max-w-7xl mx-auto">

                    {/* Stepper de Progreso */}
                    <div className="flex items-center justify-center max-w-xl mx-auto mb-2">
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                                <Check size={16} />
                            </div>
                            <span className="ml-2 text-sm font-semibold text-slate-700">Selección</span>
                        </div>
                        <div className="w-16 sm:w-24 h-0.5 bg-emerald-500 mx-3"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-pink-600 text-white flex items-center justify-center font-bold text-sm shadow-md ring-4 ring-pink-100">
                                2
                            </div>
                            <span className="ml-2 text-sm font-bold text-pink-600">Resumen</span>
                        </div>
                        <div className="w-16 sm:w-24 h-0.5 bg-slate-300 mx-3"></div>
                        <div className="flex items-center">
                            <div className="w-8 h-8 rounded-full bg-slate-200 text-slate-500 flex items-center justify-center font-bold text-sm">
                                3
                            </div>
                            <span className="ml-2 text-sm font-medium text-slate-400">Pago</span>
                        </div>
                    </div>

                    {/* Encabezado */}
                    <div className="mb-6">
                        <nav className="text-xs text-slate-500 mb-1 flex items-center gap-1">
                            <span>Inicio</span> &gt; <span>Mi cuenta</span> &gt; <span className="text-slate-800 font-medium">Resumen de mi servicio</span>
                        </nav>
                        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900">Resumen de mi servicio</h1>
                        <p className="text-sm text-slate-500">Revisa los datos y horarios antes de continuar al pago.</p>
                    </div>

                    {/* Grid Principal */}
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* COLUMNA IZQUIERDA */}
                        <div className="lg:col-span-2 space-y-6">

                            {/* Paquete Principal */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col sm:flex-row gap-5 items-center">
                                <div className="relative w-full sm:w-56 h-36 rounded-xl overflow-hidden shrink-0 shadow-inner">
                                    <img src="https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=600&q=80" alt="Paquete Mesas" className="w-full h-full object-cover" />
                                    <span className="absolute top-2 left-2 bg-pink-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow">Mobiliario</span>
                                </div>
                                <div className="flex-1 w-full">
                                    <h2 className="text-lg font-bold text-slate-900 mb-1">Paquete 10 Mesas + 80 Sillas</h2>
                                    <div className="flex items-center gap-2 text-xs text-emerald-600 mb-2 font-medium">
                                        <span>Fiestas Premium</span>
                                        <span>•</span>
                                        <span className="bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded flex items-center gap-1 border border-emerald-200">
                                            <ShieldCheck size={14} /> Proveedor verificado
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mb-3">
                                        <Star size={14} className="fill-amber-400 text-amber-400" />
                                        <span className="text-slate-700">4.9</span>
                                        <span className="text-slate-400 font-normal">(20 reseñas)</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-600 mb-4">
                                        <Truck size={14} className="text-slate-400" /> Entrega y montaje incluidos
                                    </div>
                                    <button className="text-pink-600 hover:text-pink-700 text-xs font-semibold hover:underline flex items-center gap-1">
                                        Ver detalles del paquete <ChevronRight size={12} />
                                    </button>
                                </div>
                            </div>

                            {/* 1. Datos de tu evento */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">1</span>
                                        Datos de tu evento
                                    </h3>
                                    <button className="text-pink-600 hover:text-pink-700 text-xs font-semibold flex items-center gap-1">
                                        <Pen size={12} /> Editar
                                    </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4 text-sm">
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Fecha del evento</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <CalendarIcon size={16} className="text-pink-600" />
                                            <span className="text-xs">24 de noviembre de 2026</span>
                                        </div>
                                        <span className="text-[10px] text-emerald-600 font-medium mt-1 block">Fecha disponible</span>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Tipo de evento</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <Cake size={16} className="text-pink-600" />
                                            <span className="text-xs">Cumpleaños</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Personas aproximadas</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <Users size={16} className="text-pink-600" />
                                            <span className="text-xs">60</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Horario del evento (Inicio)</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <Clock size={16} className="text-pink-600" />
                                            <span className="text-xs">15:00 h</span>
                                        </div>
                                    </div>
                                    <div>
                                        <span className="block text-xs text-slate-400 mb-1">Horario del evento (Fin)</span>
                                        <div className="flex items-center gap-2 font-medium text-slate-800 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                                            <Clock size={16} className="text-pink-600" />
                                            <span className="text-xs">21:00 h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* 2. Ubicación y logística */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">2</span>
                                        Ubicación y logística
                                    </h3>
                                </div>

                                <GoogleAddressPicker
                                    address={eventAddress}
                                    onAddressChange={setEventAddress}
                                />

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-3">
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                                        <Truck size={20} className="text-slate-500" />
                                        <div>
                                            <span className="block text-xs text-slate-400">Llegada y montaje</span>
                                            <span className="text-xs font-bold text-slate-800">13:00 h</span>
                                            <span className="block text-[10px] text-slate-500">Antes del inicio del evento</span>
                                        </div>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 flex items-center gap-3">
                                        <Clock size={20} className="text-slate-500" />
                                        <div>
                                            <span className="block text-xs text-slate-400">Recolección del servicio</span>
                                            <span className="text-xs font-bold text-slate-800">22:00 h</span>
                                            <span className="block text-[10px] text-slate-500">24 de noviembre de 2026</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2 text-xs text-emerald-600 font-medium">
                                    <Check size={14} /> Montaje y desmontaje incluidos.
                                </div>
                            </div>

                            {/* 3. Completa tu evento */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <div className="mb-4 pb-3 border-b border-slate-100">
                                    <h3 className="font-bold text-slate-900 flex items-center gap-2">
                                        <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">3</span>
                                        Completa tu evento
                                    </h3>
                                    <p className="text-xs text-slate-400 mt-0.5">Servicios de Fiestas Premium</p>
                                </div>

                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
                                    {additionalItems.map((item) => (
                                        <div key={item.id} className="border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between hover:border-pink-300 transition">
                                            <div>
                                                <img src={item.image} alt={item.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                                                <h4 className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{item.title}</h4>
                                                <p className="text-[10px] text-slate-400">{item.subtitle}</p>
                                            </div>
                                            <div className="mt-3">
                                                <span className="block text-[10px] text-slate-400">Desde</span>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-extrabold text-slate-900">${item.price.toLocaleString()} <span className="text-[9px] font-normal">{item.unit || 'MXN'}</span></span>
                                                    <button className="bg-pink-50 text-pink-600 border border-pink-200 text-[10px] font-bold px-2 py-1 rounded-md hover:bg-pink-600 hover:text-white transition">Agregar</button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mb-4 pt-2">
                                    <h4 className="text-xs font-bold text-slate-700 mb-3">También te puede interesar</h4>
                                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                        {recommendations.map((rec) => (
                                            <div key={rec.id} className="border border-slate-200 rounded-xl p-2.5 flex flex-col justify-between">
                                                <div>
                                                    <img src={rec.image} alt={rec.title} className="w-full h-20 object-cover rounded-lg mb-2" />
                                                    <h5 className="text-xs font-bold text-slate-800 leading-tight mb-0.5">{rec.title}</h5>
                                                    <p className="text-[10px] text-slate-400">{rec.subtitle}</p>
                                                </div>
                                                <div className="mt-3">
                                                    <span className="block text-[10px] text-slate-400">Desde</span>
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-xs font-extrabold text-slate-900">${rec.price.toLocaleString()} <span className="text-[9px] font-normal">MXN</span></span>
                                                        <button className="bg-pink-50 text-pink-600 border border-pink-200 text-[10px] font-bold px-2 py-1 rounded-md hover:bg-pink-600 hover:text-white transition">Agregar</button>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            {/* 4. Notas para el proveedor */}
                            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
                                <h3 className="font-bold text-slate-900 flex items-center gap-2 mb-3">
                                    <span className="w-6 h-6 rounded-full bg-slate-100 text-slate-700 text-xs flex items-center justify-center font-bold">4</span>
                                    Notas para el proveedor
                                </h3>
                                <textarea
                                    rows={3}
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    maxLength={500}
                                    placeholder="Acceso al salón, estacionamiento o indicaciones especiales..."
                                    className="w-full text-xs p-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-pink-500 mb-2 resize-none"
                                />
                                <div className="flex items-center justify-between text-[11px] text-slate-400">
                                    <label className="flex items-center gap-2 cursor-pointer">
                                        <input
                                            type="checkbox"
                                            checked={isChecked}
                                            onChange={(e) => setIsChecked(e.target.checked)}
                                            className="rounded text-pink-600 focus:ring-pink-500 w-3.5 h-3.5"
                                        />
                                        <span>He revisado la fecha, dirección y horarios de mi servicio.</span>
                                    </label>
                                    <span>{notes.length}/500</span>
                                </div>
                            </div>

                        </div>

                        {/* COLUMNA DERECHA (Panel de Resumen y Pago Sticky) */}
                        <div className="space-y-6 lg:sticky lg:top-6">

                            {/* Alerta superior de confirmación */}
                            <div className="bg-[#1C0E35] text-white rounded-2xl p-4 shadow-sm flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-[#2D144B] flex items-center justify-center text-pink-400 shrink-0 text-lg">
                                    <CalendarIcon size={20} />
                                </div>
                                <div className="text-xs">
                                    <p className="font-bold">Revisa y confirma tu servicio</p>
                                    <p className="text-indigo-200">24 NOV 2026 • 60 personas</p>
                                </div>
                            </div>

                            {/* Resumen de tu reserva */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-4">
                                <h3 className="font-bold text-slate-900 text-sm pb-3 border-b border-slate-100">Resumen de tu reserva</h3>

                                <div className="space-y-2.5 text-xs">
                                    <div className="flex justify-between text-slate-600">
                                        <span>Paquete seleccionado</span>
                                        <span className="font-bold text-slate-900">$4,950 <span className="font-normal">MXN</span></span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Entrega</span>
                                        <span className="text-emerald-600 font-medium">Incluida</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Montaje</span>
                                        <span className="text-emerald-600 font-medium">Incluido</span>
                                    </div>
                                    <div className="flex justify-between text-slate-600">
                                        <span>Servicios adicionales</span>
                                        <span className="font-bold text-slate-900">$0 <span className="font-normal">MXN</span></span>
                                    </div>
                                    <div className="flex justify-between text-slate-600 pb-2 border-b border-slate-100">
                                        <span>Comisión de Supparty</span>
                                        <span className="font-bold text-slate-900">$495 <span className="font-normal">MXN</span></span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center pt-1">
                                    <span className="font-bold text-slate-900 text-sm">Total</span>
                                    <span className="text-xl font-extrabold text-slate-900">$5,445 <span className="text-xs font-normal">MXN</span></span>
                                </div>

                                <div className="bg-pink-50 border border-pink-100 rounded-xl p-3.5 flex items-center justify-between">
                                    <div className="flex items-start gap-2.5">
                                        <CreditCard size={18} className="text-pink-600 mt-0.5" />
                                        <div>
                                            <span className="block text-[10px] text-slate-500">Aparta hoy con</span>
                                            <span className="text-sm font-extrabold text-pink-600">$800 <span className="text-[10px] font-normal">MXN</span></span>
                                            <span className="block text-[9px] text-slate-400 mt-0.5">Saldo pendiente: $4,645 MXN</span>
                                        </div>
                                    </div>
                                </div>

                                <p className="text-[10px] text-slate-400 text-center">
                                    <Info size={12} className="inline mr-1" /> Revisa las condiciones de pago antes de continuar.
                                </p>

                                <button className="w-full bg-pink-600 hover:bg-pink-700 text-white font-bold py-3 px-4 rounded-xl shadow-md transition flex items-center justify-center gap-2 text-xs">
                                    Continuar al pago <ArrowRight size={14} />
                                </button>

                                <p className="text-[10px] text-slate-400 text-center flex items-center justify-center gap-1">
                                    <Lock size={12} /> Aún no se realizará ningún cargo.
                                </p>

                                <div className="text-center pt-2">
                                    <a href="#" className="text-xs text-slate-500 hover:text-slate-800 underline">Volver al servicio</a>
                                </div>
                            </div>

                            {/* Tu servicio en un vistazo */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 space-y-3">
                                <h3 className="font-bold text-slate-900 text-xs uppercase tracking-wider text-slate-400 mb-1">Tu servicio en un vistazo</h3>
                                <div className="space-y-3 text-xs text-slate-600">
                                    <div className="flex items-start gap-2.5">
                                        <CalendarIcon size={16} className="text-pink-600 mt-0.5" />
                                        <div>
                                            <span className="block font-medium text-slate-800">Fecha disponible</span>
                                            <span>24 de noviembre de 2026</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <MapPin size={16} className="text-pink-600 mt-0.5" />
                                        <div>
                                            <span className="block font-medium text-slate-800">Ubicación</span>
                                            <span>{eventAddress}</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Truck size={16} className="text-pink-600 mt-0.5" />
                                        <div>
                                            <span className="block font-medium text-slate-800">Llegada y montaje</span>
                                            <span>13:00 h</span>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2.5">
                                        <Clock size={16} className="text-pink-600 mt-0.5" />
                                        <div>
                                            <span className="block font-medium text-slate-800">Recolección</span>
                                            <span>22:00 h</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Ayuda */}
                            <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 text-center relative overflow-hidden">
                                <h3 className="font-bold text-slate-900 text-xs mb-1">¿Necesitas ayuda?</h3>
                                <p className="text-[11px] text-slate-400 mb-4">Nuestro equipo está listo para apoyarte.</p>
                                <div className="flex justify-center mb-4">
                                    <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80" alt="Soporte" className="w-16 h-16 rounded-full object-cover border-2 border-pink-100 shadow-sm" />
                                </div>
                                <button className="w-full bg-white border border-slate-200 hover:bg-slate-50 text-slate-800 font-semibold py-2 px-4 rounded-xl text-xs transition shadow-xs">
                                    Contactar soporte
                                </button>
                            </div>

                        </div>

                    </div>

                </main>
            </div>
            <Footer />
        </div>
    );
}

interface SidebarLinkProps {
    icon: React.ReactNode;
    label: string;
    active?: boolean;
    collapsed?: boolean;
}

function SidebarLink({ icon, label, active = false, collapsed = false }: SidebarLinkProps) {
    return (
        <button
            title={collapsed ? label : undefined}
            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? 'bg-[#EFE9F7] text-[#2D144B]' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'
                } ${collapsed ? 'justify-center px-2' : ''}`}
        >
            <span className="shrink-0">{icon}</span>
            {!collapsed && <span className="truncate">{label}</span>}
        </button>
    );
}